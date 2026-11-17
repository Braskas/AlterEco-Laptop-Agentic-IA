/**
 * Lieux réels (E1.4) — deux services publics gratuits, sans clé :
 *   - Villes : API Découpage administratif (geo.api.gouv.fr), France uniquement.
 *   - Enseignes : OpenStreetMap via l'API Overpass (données ODbL, © contributeurs OpenStreetMap).
 *
 * Ce qui part vers ces services : le texte tapé dans « Ville ou code postal », puis les
 * coordonnées du centre de la commune choisie (jamais la position de la personne).
 * En cas d'échec, les écrans retombent sur la saisie libre et la liste d'exemple.
 */
import { catalog } from "../db";
import type { DomainId } from "../types";

export type City = {
  /** Code INSEE */
  code: string;
  name: string;
  postalCodes: string[];
  department?: string;
  lat: number;
  lon: number;
};

const GEO_API = "https://geo.api.gouv.fr/communes";
/**
 * Instances publiques d'Overpass, interrogées en parallèle : la première qui répond gagne.
 * Elles sont gratuites mais parfois saturées ; d'où le délai maximal et le cache local.
 */
const OVERPASS_APIS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];
const OVERPASS_TIMEOUT_MS = 25_000;
/** Rayon de recherche des enseignes autour du centre de la commune. */
export const STORE_RADIUS_M = 3000;
export const MAX_STORES = 8;

type GeoCommune = {
  code: string;
  nom: string;
  codesPostaux?: string[];
  departement?: { nom: string };
  centre?: { coordinates: [number, number] };
};

/** Recherche une commune par nom (« clermont ») ou par code postal (« 63000 »). */
export async function searchCities(query: string, signal?: AbortSignal): Promise<City[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const params = new URLSearchParams({ fields: "nom,code,codesPostaux,centre,departement", limit: "6" });
  if (/^\d{5}$/.test(q)) params.set("codePostal", q);
  else if (/^\d+$/.test(q)) return [];
  else {
    params.set("nom", q);
    params.set("boost", "population");
  }

  const res = await fetch(`${GEO_API}?${params}`, { signal });
  if (!res.ok) throw new Error(`geo.api.gouv.fr : ${res.status}`);
  const data = (await res.json()) as GeoCommune[];
  return data
    .filter((c) => c.centre)
    .map((c) => ({
      code: c.code,
      name: c.nom,
      postalCodes: c.codesPostaux ?? [],
      department: c.departement?.nom,
      lon: c.centre!.coordinates[0],
      lat: c.centre!.coordinates[1],
    }));
}

/** « Clermont-Ferrand (63000) » */
export function cityLabel(city: Pick<City, "name" | "postalCodes">): string {
  return city.postalCodes[0] ? `${city.name} (${city.postalCodes[0]})` : city.name;
}

// ── Enseignes OpenStreetMap ─────────────────────────────────────────────────

type OsmElement = {
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

/** Types de commerces OSM retenus, rangés par domaine Hooka. */
const SHOP_DOMAIN: Record<string, DomainId> = {
  supermarket: "alimentation",
  convenience: "alimentation",
  organic: "alimentation",
  greengrocer: "alimentation",
  marketplace: "alimentation",
  second_hand: "seconde-main",
  charity: "seconde-main",
  doityourself: "seconde-main",
  hardware: "seconde-main",
};

/** Places réservées par domaine, pour garder un peu de seconde main et de bricolage. */
const QUOTA: Partial<Record<DomainId, number>> = { alimentation: 5, "seconde-main": 3 };

/** Noms trop génériques pour aider à choisir. */
const GENERIC = /^(alimentation( générale)?|sup[eé]rette|[ée]picerie|march[ée]|friperie|brocante|magasin)$/i;

function distanceM(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Transforme la réponse OSM en pastilles : une par enseigne (marque, sinon nom), sans doublon,
 * les plus proches d'abord, avec des places réservées par domaine. Fonction pure, testée.
 */
export function pickStores(elements: OsmElement[], center: { lat: number; lon: number }, max = MAX_STORES): string[] {
  const best = new Map<string, { label: string; domain: DomainId; distance: number }>();

  for (const el of elements) {
    const tags = el.tags ?? {};
    const kind = tags.shop ?? (tags.amenity === "marketplace" ? "marketplace" : undefined);
    const domain = kind ? SHOP_DOMAIN[kind] : undefined;
    const point = el.center ?? (el.lat !== undefined && el.lon !== undefined ? { lat: el.lat, lon: el.lon } : null);
    const label = (tags.brand ?? tags.name ?? "").trim();
    if (!domain || !point || !label || GENERIC.test(label)) continue;

    const key = label.toLocaleLowerCase("fr");
    const distance = distanceM(center, point);
    const known = best.get(key);
    if (!known || distance < known.distance) best.set(key, { label, domain, distance });
  }

  const sorted = [...best.values()].sort((a, b) => a.distance - b.distance);
  const picked: typeof sorted = [];
  for (const [domain, quota] of Object.entries(QUOTA)) {
    picked.push(...sorted.filter((s) => s.domain === domain).slice(0, quota));
  }
  // Complète avec les plus proches restants si un domaine n'a pas rempli sa part
  for (const s of sorted) {
    if (picked.length >= max) break;
    if (!picked.includes(s)) picked.push(s);
  }
  return picked
    .slice(0, max)
    .sort((a, b) => a.distance - b.distance)
    .map((s) => s.label);
}

const CACHE_KEY = "hooka.stores.v1";
const CACHE_DAYS = 30;
type StoreCache = Record<string, { at: number; stores: string[] }>;

function readCache(): StoreCache {
  try {
    return JSON.parse(globalThis.localStorage?.getItem(CACHE_KEY) ?? "{}") as StoreCache;
  } catch {
    return {};
  }
}

function writeCache(code: string, stores: string[]): void {
  try {
    const cache = readCache();
    cache[code] = { at: Date.now(), stores };
    globalThis.localStorage?.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* stockage indisponible : on se passe du cache */
  }
}

async function askOverpass(url: string, query: string, signal: AbortSignal): Promise<OsmElement[]> {
  const res = await fetch(url, { method: "POST", body: new URLSearchParams({ data: query }), signal });
  if (!res.ok) throw new Error(`Overpass ${url} : ${res.status}`);
  return ((await res.json()) as { elements: OsmElement[] }).elements;
}

/**
 * Enseignes réelles autour d'une commune.
 * Cache local de 30 jours par commune ; sinon les instances Overpass sont interrogées en parallèle.
 */
export async function nearbyStores(city: Pick<City, "code" | "lat" | "lon">, signal?: AbortSignal): Promise<string[]> {
  const cached = readCache()[city.code];
  if (cached && Date.now() - cached.at < CACHE_DAYS * 86_400_000) return cached.stores;

  const kinds = Object.keys(SHOP_DOMAIN).filter((k) => k !== "marketplace").join("|");
  const around = `around:${STORE_RADIUS_M},${city.lat},${city.lon}`;
  const query = `[out:json][timeout:20];(nwr(${around})["shop"~"^(${kinds})$"];nwr(${around})["amenity"="marketplace"];);out tags center 200;`;

  // Un seul contrôleur pour tout couper : délai dépassé, écran quitté, ou une instance a gagné.
  const controller = new AbortController();
  const stop = () => controller.abort();
  signal?.addEventListener("abort", stop);
  const timer = setTimeout(stop, OVERPASS_TIMEOUT_MS);
  try {
    const elements = await Promise.any(OVERPASS_APIS.map((url) => askOverpass(url, query, controller.signal)));
    const stores = pickStores(elements, city);
    writeCache(city.code, stores);
    return stores;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", stop);
    controller.abort();
  }
}

/** Liste d'exemple (base fictive) quand OpenStreetMap ne répond pas. */
export function demoStores(): string[] {
  return [...catalog.stores];
}
