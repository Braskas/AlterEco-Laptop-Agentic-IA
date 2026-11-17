/**
 * Base de données fictive.
 *
 * - Le catalogue (sources, lieux, produits, recommandations…) est en lecture seule :
 *   il vient des fichiers seed/*.json, comme s'il venait des connecteurs de données.
 * - Les tables de l'utilisateur (profil, gestes, décisions…) sont modifiables et
 *   persistées dans localStorage, pour survivre à un rechargement de page.
 *
 * Les écrans n'importent jamais ce fichier : ils passent par data/api/*.
 */
import type {
  Consent,
  Decision,
  Domain,
  Gesture,
  Place,
  PriorityDomain,
  Product,
  Profile,
  Recommendation,
  Report,
  SetAside,
  Source,
  UnmetRequest,
  User,
  UserGesture,
} from "./types";
import domainsSeed from "./seed/domains.json";
import gesturesSeed from "./seed/gestures.json";
import placesSeed from "./seed/places.json";
import productsSeed from "./seed/products.json";
import recommendationsSeed from "./seed/recommendations.json";
import sourcesSeed from "./seed/sources.json";
import userSeed from "./seed/user.json";

// ── Catalogue (lecture seule) ───────────────────────────────────────────────

export type Catalog = {
  domains: Domain[];
  gestures: Gesture[];
  places: Place[];
  products: Product[];
  recommendations: Recommendation[];
  sources: Source[];
};

export const catalog: Catalog = {
  domains: domainsSeed as Domain[],
  gestures: gesturesSeed as Gesture[],
  places: placesSeed as Place[],
  products: productsSeed as Product[],
  recommendations: recommendationsSeed as Recommendation[],
  sources: sourcesSeed as Source[],
};

// ── Tables utilisateur (persistées) ─────────────────────────────────────────

export type UserTables = {
  user: User;
  profile: Profile;
  priorityDomains: PriorityDomain[];
  gestures: UserGesture[];
  decisions: Decision[];
  setAside: SetAside[];
  reports: Report[];
  requests: UnmetRequest[];
  consents: Consent[];
};

const STORAGE_KEY = "hooka.db.v1";

function freshTables(): UserTables {
  return structuredClone(userSeed) as UserTables;
}

function load(): UserTables {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (raw) return { ...freshTables(), ...(JSON.parse(raw) as Partial<UserTables>) };
  } catch {
    /* stockage indisponible ou corrompu : on repart des données de démo */
  }
  return freshTables();
}

let tables: UserTables = load();

function save(): void {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(tables));
  } catch {
    /* ignore */
  }
}

/** Lecture d'une copie (les écrans ne peuvent pas muter la base par accident). */
export function read<K extends keyof UserTables>(key: K): UserTables[K] {
  return structuredClone(tables[key]);
}

/** Écriture : la fonction reçoit une copie et renvoie la nouvelle valeur. */
export function write<K extends keyof UserTables>(
  key: K,
  update: (current: UserTables[K]) => UserTables[K],
): UserTables[K] {
  tables = { ...tables, [key]: update(structuredClone(tables[key])) };
  save();
  return read(key);
}

/** Remet la démo à zéro (bouton dans /ecrans, et entre deux tests). */
export function resetDb(): void {
  tables = freshTables();
  save();
}

/** Identifiant court pour les nouvelles lignes. */
export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
