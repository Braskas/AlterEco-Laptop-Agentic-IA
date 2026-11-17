import { catalog, newId, read, write } from "../db";
import { buildCard, nextStep, totals, type Totals } from "../../engine/recommend";
import { DEMO_TODAY, delay, nowIso } from "../../lib/delay";
import type { Card, Decision, DomainId, NextStep, Recommendation, SetAside } from "../types";

/** E7 « Y aller » / « C'est fait » → décision validée (déclarative), puis E8. */
export async function acceptCard(recommendationId: string): Promise<Decision> {
  await delay();
  const decision: Decision = {
    id: newId("dec"),
    recommendationId,
    answer: "validee",
    createdAt: nowIso(),
  };
  write("decisions", (list) => [...list, decision]);
  // Une alternative validée n'a plus à rester « gardée pour plus tard ».
  write("setAside", (list) => list.filter((s) => s.recommendationId !== recommendationId));
  return decision;
}

/** E5.6 « Pas aujourd'hui », raison facultative. Aucune autre conséquence. */
export async function skipCard(
  recommendationId: string,
  skipReason?: Decision["skipReason"],
): Promise<Decision> {
  await delay();
  const decision: Decision = {
    id: newId("dec"),
    recommendationId,
    answer: "passee",
    skipReason,
    createdAt: nowIso(),
  };
  write("decisions", (list) => [...list, decision]);
  return decision;
}

/** E5.6 : raison facultative, ajoutée après coup à la décision « passée ». */
export async function setSkipReason(decisionId: string, skipReason: Decision["skipReason"]): Promise<void> {
  await delay(100);
  write("decisions", (list) => list.map((d) => (d.id === decisionId ? { ...d, skipReason } : d)));
}

/** E8 : ressenti facultatif après validation. */
export async function setFeeling(decisionId: string, feeling: Decision["feeling"]): Promise<void> {
  await delay(100);
  write("decisions", (list) => list.map((d) => (d.id === decisionId ? { ...d, feeling } : d)));
}

/** E7.3 « Garder pour plus tard ». */
export async function setAside(recommendationId: string): Promise<SetAside[]> {
  await delay();
  return write("setAside", (list) =>
    list.some((s) => s.recommendationId === recommendationId)
      ? list
      : [...list, { recommendationId, createdAt: nowIso() }],
  );
}

/** E9.1 « Gardé pour plus tard » : cartes complètes (lieu, distance). */
export async function listSetAside(): Promise<Card[]> {
  await delay();
  const ctx = { userGestures: read("gestures"), catalog, today: DEMO_TODAY };
  return read("setAside").flatMap((s) => {
    const rec = catalog.recommendations.find((r) => r.id === s.recommendationId);
    const card = rec && buildCard(rec, ctx);
    return card ? [card] : [];
  });
}

export type HistoryItem = { decision: Decision; recommendation: Recommendation };

function validatedHistory(): HistoryItem[] {
  return read("decisions")
    .filter((d) => d.answer === "validee")
    .reverse()
    .flatMap((decision) => {
      const recommendation = catalog.recommendations.find((r) => r.id === decision.recommendationId);
      return recommendation ? [{ decision, recommendation }] : [];
    });
}

/** E9.1 : historique des décisions validées, de la plus récente à la plus ancienne. */
export async function listHistory(): Promise<HistoryItem[]> {
  await delay();
  return validatedHistory();
}

export type HouseholdSummary = Totals & {
  /** Décisions validées depuis le 1er du mois de démo. */
  countThisMonth: number;
};

/** E8 / E9.1 : compteur du foyer (euros cumulés, km de voiture évités). */
export async function getSummary(): Promise<HouseholdSummary> {
  await delay();
  const history = validatedHistory();
  const month = DEMO_TODAY.slice(0, 7);
  return {
    ...totals(history.map((h) => h.recommendation)),
    countThisMonth: history.filter((h) => h.decision.createdAt.slice(0, 7) === month).length,
  };
}

/** Compatibilité : euros cumulés et nombre de décisions validées. */
export async function getTotalGain(): Promise<{ euros: number; count: number }> {
  const { euros, count } = await getSummary();
  return { euros, count };
}

export type ConfirmationData = {
  decision: Decision;
  recommendation: Recommendation;
  summary: HouseholdSummary;
  /** Première décision validée du foyer (E8.2). */
  isFirst: boolean;
  next?: NextStep;
};

/** E8 : tout ce qu'il faut pour l'écran de confirmation. */
export async function getConfirmation(decisionId: string): Promise<ConfirmationData | null> {
  await delay();
  const decision = read("decisions").find((d) => d.id === decisionId);
  const recommendation = decision && catalog.recommendations.find((r) => r.id === decision.recommendationId);
  if (!decision || !recommendation) return null;
  const history = validatedHistory();
  const month = DEMO_TODAY.slice(0, 7);
  return {
    decision,
    recommendation,
    summary: {
      ...totals(history.map((h) => h.recommendation)),
      countThisMonth: history.filter((h) => h.decision.createdAt.slice(0, 7) === month).length,
    },
    isFirst: history.length === 1,
    next: getNextStepSync(recommendation.domain),
  };
}

function getNextStepSync(domain: DomainId): NextStep | undefined {
  return nextStep(domain, read("gestures"), catalog.nextSteps);
}
