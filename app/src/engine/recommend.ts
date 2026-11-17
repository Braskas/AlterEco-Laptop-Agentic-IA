/**
 * Moteur de recommandation — version simplifiée de la spec, section 7.
 *
 * Fonction pure : elle reçoit le besoin, le profil et le catalogue, et renvoie
 * une seule carte ou un refus explicite. Aucun accès à la base ici, donc facile à tester
 * et à remplacer plus tard par un appel au vrai moteur côté serveur.
 */
import type {
  Card,
  CardResult,
  Certainty,
  Gesture,
  Need,
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

/** Détour maximal accepté selon le temps disponible choisi en E1.5. */
export const MAX_DETOUR_MINUTES: Record<TimeBudget, number> = {
  court: 5,
  moyen: 20,
  long: 45,
};

export type EngineInput = {
  need: Need;
  profile: Profile;
  userGestures: UserGesture[];
  catalog: {
    recommendations: Recommendation[];
    sources: Source[];
    places: Place[];
    products: Product[];
    gestures: Gesture[];
  };
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

// ── Pipeline ────────────────────────────────────────────────────────────────

function findProduct(need: Need, products: Product[]): Product | undefined {
  return need.productId ? products.find((p) => p.id === need.productId) : undefined;
}

function matchesNeed(rec: Recommendation, need: Need): boolean {
  if (need.domain && rec.domain !== need.domain) return false;
  if (need.productId && rec.matches.productIds?.includes(need.productId)) return true;
  const query = need.query?.toLowerCase();
  return !!query && !!rec.matches.keywords?.some((k) => query.includes(k));
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
  const cards: Card[] = [];

  for (const rec of candidates) {
    if (!rec.budgets.includes(profile.budget)) continue;
    if (rec.time.minutes > maxDetour) continue;

    const sources = rec.sourceIds
      .map((id) => catalog.sources.find((s) => s.id === id))
      .filter((s): s is Source => !!s);
    const certainties = sources
      .map((s) => sourceCertainty(s, today))
      .filter((c): c is Certainty => c !== null);
    // Règle spec §6 : sans source datée, la recommandation n'est pas affichable.
    if (certainties.length === 0) continue;

    const datedSources = sources.filter((s) => s.lastVerifiedAt);
    const certainty = worstCertainty(certainties);
    const staleSource = datedSources.find(
      (s) => sourceCertainty(s, today) === "a-reverifier",
    );
    // La pastille montre la source la plus faible : c'est elle qui fixe la certitude.
    const primarySource =
      datedSources.find((s) => sourceCertainty(s, today) === certainty) ?? datedSources[0];

    const gesture = rec.relatedGestureId
      ? catalog.gestures.find((g) => g.id === rec.relatedGestureId)
      : undefined;
    const hasGesture = gesture && userGestures.some((ug) => ug.gestureId === gesture.id);

    cards.push({
      recommendation: rec,
      place: rec.placeId ? catalog.places.find((p) => p.id === rec.placeId) : undefined,
      sources: datedSources,
      certainty,
      primarySource,
      praise: hasGesture ? `${gesture.praise} Même sens.` : undefined,
      staleWarning: staleSource
        ? `${staleSource.label} en ${formatShortDate(staleSource.lastVerifiedAt!, true)}. À revérifier sur place.`
        : undefined,
    });
  }

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
