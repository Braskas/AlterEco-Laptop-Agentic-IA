import { catalog, newId, read, write } from "../db";
import { delay, nowIso } from "../../lib/delay";
import type { Decision, Recommendation, SetAside } from "../types";

/** E5 « Je fonce » → E7 / E8. */
export async function acceptCard(recommendationId: string): Promise<Decision> {
  await delay();
  const decision: Decision = {
    id: newId("dec"),
    recommendationId,
    answer: "validee",
    createdAt: nowIso(),
  };
  write("decisions", (list) => [...list, decision]);
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

export type HistoryItem = { decision: Decision; recommendation: Recommendation };

/** E9.1 : historique des décisions validées, de la plus récente à la plus ancienne. */
export async function listHistory(): Promise<HistoryItem[]> {
  await delay();
  return read("decisions")
    .filter((d) => d.answer === "validee")
    .reverse()
    .flatMap((decision) => {
      const recommendation = catalog.recommendations.find((r) => r.id === decision.recommendationId);
      return recommendation ? [{ decision, recommendation }] : [];
    });
}

/** E8.2 / E9.1 : compteur de gains déclarés (euros cumulés). */
export async function getTotalGain(): Promise<{ euros: number; count: number }> {
  const history = await listHistory();
  return {
    euros: history.reduce((sum, h) => sum + h.recommendation.gain.euros, 0),
    count: history.length,
  };
}
