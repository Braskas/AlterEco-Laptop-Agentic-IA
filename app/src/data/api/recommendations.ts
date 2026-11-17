import { catalog, newId, read, write } from "../db";
import { recommend } from "../../engine/recommend";
import { DEMO_TODAY, delay, nowIso } from "../../lib/delay";
import type { CardResult, Need, Product, Recommendation, UnmetRequest } from "../types";

/**
 * E4 → E5 : transforme un besoin (scan, voix, texte, lieu) en une seule carte.
 * Délai plus long pour laisser voir l'écran de chargement (E4.7).
 */
export async function getCardForNeed(need: Need): Promise<CardResult> {
  await delay(700);
  const result = recommend({
    need,
    profile: read("profile"),
    userGestures: read("gestures"),
    catalog,
    today: DEMO_TODAY,
  });

  // Les besoins sans réponse alimentent l'indicateur « Demandes sans réponse ».
  if (result.status === "non-reconnu" || result.status === "aucune-alternative") {
    logUnmetRequest({ type: "non-reconnu", domain: need.domain, text: need.query });
  }
  return result;
}

/** E4.1 : simule la lecture d'un code-barres. */
export async function scanBarcode(barcode: string): Promise<Product | null> {
  await delay(400);
  return structuredClone(catalog.products.find((p) => p.barcode === barcode) ?? null);
}

/** Produits scannables de la démo (pour choisir un scan fictif). */
export async function listDemoProducts(): Promise<Product[]> {
  await delay(100);
  return structuredClone(catalog.products);
}

export async function getRecommendation(id: string): Promise<Recommendation | null> {
  await delay(100);
  return structuredClone(catalog.recommendations.find((r) => r.id === id) ?? null);
}

/** E1.2b « Me prévenir », E3.3 hors domaines, E4.3 non reconnu. */
export function logUnmetRequest(request: Omit<UnmetRequest, "id" | "createdAt">): void {
  write("requests", (list) => [...list, { ...request, id: newId("req"), createdAt: nowIso() }]);
}
