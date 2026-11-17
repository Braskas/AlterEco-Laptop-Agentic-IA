/**
 * Moteur de recommandation — version simplifiée de la spec, section 7.
 *
 * Fonctions pures : elles reçoivent le besoin, le profil et le catalogue, et renvoient
 * une seule carte ou un refus explicite. Aucun accès à la base ici, donc faciles à tester
 * et à remplacer plus tard par un appel au vrai moteur côté serveur.
 */
import type {
  Card,
  CardResult,
  Certainty,
  DomainId,
  Gesture,
  Need,
  NextStep,
  Place,
  Product,
  Profile,
  Recommendation,
  Source,
  TimeBudget,
  UserGesture,
} from "../data/types";
import { daysBetween, formatShortDate } from "../lib/format";

/** Au-delà, une source est « à revérifier » (spec §8 : données à jour). */
export const STALE_AFTER_DAYS = 180;
/** Au-delà, une source n'est plus « solide », au mieux « probable ». */
export const FRESH_FOR_DAYS = 30;
/** Équivalence « km de voiture évités » : ≈ 0,2 kg de CO₂ par km (ordre de grandeur ADEME). */
export const CO2_KG_PER_CAR_KM = 0.2;

/** Détour maximal accepté selon le temps disponible choisi en E1.5. */
export const MAX_DETOUR_MINUTES: Record<TimeBudget, number> = {
  court: 5,
  moyen: 20,
  long: 45,
};

type CatalogSlice = {
  recommendations: Recommendation[];
  sources: Source[];
  places: Place[];
  products: Product[];
  gestures: Gesture[];
};

export type EngineInput = {
  need: Need;
  profile: Profile;
  userGestures: UserGesture[];
  catalog: CatalogSlice;
  /** Date de référence pour la fraîcheur des sources. */
  today: string;
};

// ── Certitude ───────────────────────────────────────────────────────────────

const CERTAINTY_RANK: Record<Certainty, number> = {
  solide: 0,
  probable: 1,
  conteste: 2,
  "a-reverifier": 3,
};

/** Certitude d'une source, dérivée de sa nature et de son âge (jamais saisie à la main). */
export function sourceCertainty(source: Source, today: string): Certainty | null {
  if (!source.lastVerifiedAt) return null; // non datée → inutilisable
  const age = daysBetween(source.lastVerifiedAt, today);
  if (age > STALE_AFTER_DAYS) return "a-reverifier";
  if (source.disputed) return "conteste";
  if (source.kind === "releve" && age <= FRESH_FOR_DAYS) return "solide";
  return "probable";
}

/** La carte prend la certitude de sa source la plus faible. */
function worstCertainty(values: Certainty[]): Certainty {
  return values.reduce((worst, c) => (CERTAINTY_RANK[c] > CERTAINTY_RANK[worst] ? c : worst));
}

// ── Assemblage d'une carte ──────────────────────────────────────────────────

/**
 * Assemble la carte d'une recommandation (lieu, sources, certitude, valorisation).
 * Renvoie null si aucune source n'est datée : la carte n'est pas affichable (spec §6).
 */
export function buildCard(
  rec: Recommendation,
  ctx: { userGestures: UserGesture[]; catalog: CatalogSlice; today: string },
): Card | null {
  const { userGestures, catalog, today } = ctx;
  const datedSources = rec.sourceIds
    .map((id) => catalog.sources.find((s) => s.id === id))
    .filter((s): s is Source => !!s && sourceCertainty(s, today) !== null);
  if (datedSources.length === 0) return null;

  const certainty = worstCertainty(datedSources.map((s) => sourceCertainty(s, today)!));
  const staleSource = datedSources.find((s) => sourceCertainty(s, today) === "a-reverifier");
  // La pastille montre la source la plus faible : c'est elle qui fixe la certitude.
  const primarySource = datedSources.find((s) => sourceCertainty(s, today) === certainty)!;

  const gesture = rec.relatedGestureId
    ? catalog.gestures.find((g) => g.id === rec.relatedGestureId)
    : undefined;
  const hasGesture = gesture && userGestures.some((ug) => ug.gestureId === gesture.id);

  return {
    recommendation: rec,
    place: rec.placeId ? catalog.places.find((p) => p.id === rec.placeId) : undefined,
    sources: datedSources,
    certainty,
    primarySource,
    praise: hasGesture ? `${gesture.praise} Même sens.` : undefined,
    staleWarning: staleSource
      ? `${staleSource.label} en ${formatShortDate(staleSource.lastVerifiedAt!, true)}. À revérifier sur place.`
      : undefined,
  };
}

// ── Pipeline ────────────────────────────────────────────────────────────────

function findProduct(need: Need, products: Product[]): Product | undefined {
  return need.productId ? products.find((p) => p.id === need.productId) : undefined;
}

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function matchesNeed(rec: Recommendation, need: Need): boolean {
  if (need.domain && rec.domain !== need.domain) return false;
  if (need.productId && rec.matches.productIds?.includes(need.productId)) return true;
  const query = need.query ? normalize(need.query) : "";
  return !!query && !!rec.matches.keywords?.some((k) => query.includes(normalize(k)));
}

export function recommend(input: EngineInput): CardResult {
  const { need, profile, userGestures, catalog, today } = input;

  // 1–2. Normaliser le besoin et identifier le domaine
  const product = findProduct(need, catalog.products);
  if (need.productId && !product) return { status: "non-reconnu" };
  if (product?.sourceUnavailable) return { status: "source-indisponible" };

  const resolvedNeed: Need = { ...need, domain: need.domain ?? product?.domain };

  // 3. Candidates du domaine
  const candidates = catalog.recommendations.filter((r) => matchesNeed(r, resolvedNeed));
  if (candidates.length === 0 && !need.productId && !need.query) return { status: "non-reconnu" };

  // 4. Filtres : budget, temps disponible, sources datées
  const maxDetour = MAX_DETOUR_MINUTES[profile.timeBudget];
  const cards = candidates
    .filter((rec) => rec.budgets.includes(profile.budget) && rec.time.minutes <= maxDetour)
    .map((rec) => buildCard(rec, { userGestures, catalog, today }))
    .filter((c): c is Card => c !== null);

  // 5. Classer : certitude d'abord, puis gain, puis détour. On ne garde qu'une carte.
  cards.sort(
    (a, b) =>
      CERTAINTY_RANK[a.certainty] - CERTAINTY_RANK[b.certainty] ||
      b.recommendation.gain.euros - a.recommendation.gain.euros ||
      a.recommendation.time.minutes - b.recommendation.time.minutes,
  );

  // 8. Rien de fiable : message honnête plutôt qu'une proposition faible (E5.5).
  const best = cards[0];
  return best ? { status: "ok", card: best } : { status: "aucune-alternative" };
}

// ── Geste suivant et compteur ───────────────────────────────────────────────

/**
 * « Petit pas suivant » (E8) : dans le même domaine, le premier pas dont le geste n'est
 * pas encore en place, en privilégiant ceux qui suivent un geste déjà fait.
 */
export function nextStep(
  domain: DomainId,
  userGestures: UserGesture[],
  steps: NextStep[],
): NextStep | undefined {
  const done = new Set(userGestures.map((g) => g.gestureId));
  const open = steps.filter((s) => s.domain === domain && !done.has(s.gestureId));
  return open.find((s) => s.afterGestureId && done.has(s.afterGestureId)) ?? open.find((s) => !s.afterGestureId);
}

export type Totals = {
  euros: number;
  co2Kg: number;
  carKm: number;
  count: number;
};

/** Compteur du foyer (E8, E9.1) : somme des décisions validées. Jamais de score. */
export function totals(validated: Recommendation[]): Totals {
  const euros = validated.reduce((sum, r) => sum + r.gain.euros, 0);
  const co2Kg = validated.reduce((sum, r) => sum + r.impact.co2Kg, 0);
  return {
    euros: Math.round(euros * 100) / 100,
    co2Kg,
    carKm: Math.round(co2Kg / CO2_KG_PER_CAR_KM),
    count: validated.length,
  };
}
