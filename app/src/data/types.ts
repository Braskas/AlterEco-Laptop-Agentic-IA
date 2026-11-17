/**
 * Modèle de données Hooka — reprend les 12 entités de la spec technique, section 6
 * (Spec techniques/specifications-techniques-le-reflexe_1.md).
 * Les noms de champs sont en anglais (code), les valeurs affichées restent en français.
 */

export type ISODate = string; // "2026-11-12"
export type ISODateTime = string; // "2026-11-17T09:41:00Z"

// ── Référentiels ────────────────────────────────────────────────────────────

/** Domaines actifs dans le MVP, plus les domaines verrouillés (affichés, non utilisables). */
export type DomainId =
  | "alimentation"
  | "seconde-main"
  | "energie"
  | "deplacements"
  | "numerique"
  | "maison";

export type Domain = {
  id: DomainId;
  label: string;
  /** false = verrouillé dans le prototype (bouton « Me prévenir », E1.2b). */
  active: boolean;
};

export type BudgetLevel = "serre" | "equilibre" | "confortable";

/** Temps disponible pour une décision (E1.5). Fixe le détour maximal accepté. */
export type TimeBudget = "court" | "moyen" | "long";

export type Certainty = "solide" | "probable" | "conteste" | "a-reverifier";

export type ConsentPurpose = "localisation" | "camera" | "micro" | "notifications";

// ── Entités utilisateur (persistées dans la base fictive) ───────────────────

/** Utilisateur — anonyme tant qu'aucun compte n'est créé. */
export type User = {
  id: string;
  createdAt: ISODateTime;
  onboardingDone: boolean;
};

/** Profil — modifiable depuis E9.3. */
export type Profile = {
  budget: BudgetLevel;
  city: string;
  postalCode: string;
  usualStores: string[];
  timeBudget: TimeBudget;
};

/** DomainePrioritaire — les 3 domaines choisis en E1.2. */
export type PriorityDomain = {
  domain: DomainId;
  rank: 1 | 2 | 3;
};

/** GesteEnPlace — cochés en E2.1, modifiables en E9.2. */
export type Gesture = {
  id: string;
  domain: DomainId;
  label: string; // « J'achète en vrac »
  /** Phrase de valorisation affichée sur la carte E5 : « Tu prends déjà le vrac. » */
  praise: string;
};

export type UserGesture = {
  gestureId: string;
  origin: "mini-bilan" | "app";
  since: ISODate;
};

/** Besoin — ce que la personne cherche. Le contenu brut d'un scan n'est jamais conservé. */
export type Need = {
  input: "scan" | "texte" | "voix" | "lieu";
  domain?: DomainId;
  /** Code-barres ou identifiant de produit reconnu. */
  productId?: string;
  /** Texte libre ou transcription vocale. */
  query?: string;
};

/** Demande — besoin sans réponse (hors domaines, non reconnu, « Me prévenir »). */
export type UnmetRequest = {
  id: string;
  type: "hors-domaines" | "non-reconnu" | "me-prevenir";
  domain?: DomainId;
  text?: string;
  createdAt: ISODateTime;
};

/** Decision — réponse à une carte. Déclarative. */
export type Decision = {
  id: string;
  recommendationId: string;
  answer: "validee" | "passee";
  skipReason?: "trop-cher" | "trop-loin" | "pas-le-temps" | "pas-envie" | "autre";
  feeling?: "encourage" | "neutre" | "culpabilise";
  createdAt: ISODateTime;
};

/** MiseDeCote — « Garder pour plus tard » (E7.3). */
export type SetAside = {
  recommendationId: string;
  createdAt: ISODateTime;
};

/** Signalement — erreur d'adresse, de prix ou de donnée (E6.2). */
export type Report = {
  id: string;
  recommendationId: string;
  subject: "adresse" | "prix" | "horaires" | "donnee";
  message?: string;
  status: "recu" | "en-cours" | "corrige";
  createdAt: ISODateTime;
  fixedAt?: ISODateTime;
};

/** Consentement — une finalité à la fois, retirable (E1.6, E9.4). */
export type Consent = {
  purpose: ConsentPurpose;
  granted: boolean;
  updatedAt: ISODateTime;
};

// ── Catalogue (lecture seule, vient des connecteurs de données) ─────────────

/** Source — toute recommandation affichée cite au moins une source datée. */
export type Source = {
  id: string;
  name: string; // « Relevé Hooka », « ADEME »
  url: string;
  /** Nature de la donnée : détermine la certitude de départ. */
  kind: "releve" | "officielle" | "annonce" | "communautaire";
  /** Ce qui a été vérifié : « Prix relevé », « Horaires relevés ». */
  label: string;
  lastVerifiedAt: ISODate | null;
  /** Donnée contestée par d'autres sources. */
  disputed?: boolean;
};

export type Place = {
  id: string;
  name: string; // « Épicerie du Coin »
  address: string;
  /** Distance au point de départ de la démo (Lyon 7e). 0 = sur place. */
  distanceM: number;
  walkMinutes: number;
  hours?: string; // « ouvert jusqu'à 19 h »
};

/** Produit reconnu au scan (E4.2). */
export type Product = {
  id: string;
  barcode?: string;
  name: string;
  domain: DomainId;
  price?: number;
  /** Simule une source indisponible (E5.7). */
  sourceUnavailable?: boolean;
};

/** Recommandation — une alternative pour un besoin. Sans source datée, non affichable. */
export type Recommendation = {
  id: string;
  domain: DomainId;
  /** Produits ou mots-clés qui déclenchent cette recommandation. */
  matches: { productIds?: string[]; keywords?: string[] };
  title: string; // « Yaourt nature vrac 500 g »
  context: string; // « Dans ton magasin », « Près de chez toi », « Pour ton logement »
  placeId?: string;
  /** Ligne de méta sous le titre quand il n'y a pas de lieu : « Chez toi · 2 min de réglage ». */
  meta?: string;
  detail: string; // « Même rayon, deux étagères plus bas »
  price?: number;
  referencePrice?: number;
  referenceLabel?: string; // « neuve »
  gain: { euros: number; period?: "mois" | "an"; label: string }; // « 0,44 € dans ma poche »
  time: { minutes: number; label: string }; // « Sans détour », « 11 min »
  impact: { label: string }; // « ≈ 120 g de plastique évités » — une seule équivalence
  /** Geste déjà en place qui va dans le même sens (phrase de valorisation). */
  relatedGestureId?: string;
  hypotheses: string[];
  sourceIds: string[];
  /** Budgets pour lesquels l'alternative reste accessible. */
  budgets: BudgetLevel[];
};

// ── Vue assemblée par le moteur pour l'écran E5 ─────────────────────────────

export type Card = {
  recommendation: Recommendation;
  place?: Place;
  sources: Source[];
  certainty: Certainty;
  /** Source principale affichée sur la pastille de certitude. */
  primarySource: Source;
  /** « Tu prends déjà le vrac. Même sens. » si un geste lié est en place. */
  praise?: string;
  /** Avertissement « Adresse à revérifier… » si une source est trop ancienne. */
  staleWarning?: string;
};

export type CardResult =
  | { status: "ok"; card: Card }
  | { status: "aucune-alternative" } // E5.5
  | { status: "source-indisponible" } // E5.7
  | { status: "non-reconnu" }; // E4.3
