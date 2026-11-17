/**
 * Simule la latence réseau de la future API, pour voir les états de chargement (E4.7).
 * Désactivée pendant les tests.
 */
export function delay(ms = 250): Promise<void> {
  if (import.meta.env.MODE === "test") return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Date du jour de la démo. Fixe, pour que la fraîcheur des sources reste stable. */
export const DEMO_TODAY = "2026-11-17";

export function nowIso(): string {
  return new Date().toISOString();
}
