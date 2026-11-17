import { catalog, read, write } from "../db";
import { delay, nowIso } from "../../lib/delay";
import type { Domain, DomainId, Gesture, PriorityDomain, Profile, User, UserGesture } from "../types";

export async function getUser(): Promise<User> {
  await delay();
  return read("user");
}

export async function completeOnboarding(): Promise<User> {
  await delay();
  return write("user", (u) => ({ ...u, onboardingDone: true }));
}

export async function getProfile(): Promise<Profile> {
  await delay();
  return read("profile");
}

export async function updateProfile(patch: Partial<Profile>): Promise<Profile> {
  await delay();
  return write("profile", (p) => ({ ...p, ...patch }));
}

/** Tous les domaines, actifs et verrouillés (E1.2, E3.4). */
export async function listDomains(): Promise<Domain[]> {
  await delay(100);
  return structuredClone(catalog.domains);
}

export async function getPriorityDomains(): Promise<PriorityDomain[]> {
  await delay();
  return read("priorityDomains");
}

/** E1.2 : 3 domaines au plus, dans l'ordre de choix. */
export async function setPriorityDomains(domains: DomainId[]): Promise<PriorityDomain[]> {
  await delay();
  const ranked = domains.slice(0, 3).map((domain, i) => ({ domain, rank: (i + 1) as 1 | 2 | 3 }));
  return write("priorityDomains", () => ranked);
}

/** Enseignes proposées en E1.4. */
export async function listStores(): Promise<string[]> {
  await delay(100);
  return [...catalog.stores];
}

/** Catalogue des gestes proposés au mini-bilan (E2.1). */
export async function listGestures(): Promise<Gesture[]> {
  await delay(100);
  return structuredClone(catalog.gestures);
}

export async function getUserGestures(): Promise<UserGesture[]> {
  await delay();
  return read("gestures");
}

/** E2.1 / E9.2 : remplace la liste des gestes déjà en place. */
export async function setUserGestures(
  gestureIds: string[],
  origin: UserGesture["origin"],
): Promise<UserGesture[]> {
  await delay();
  const today = nowIso().slice(0, 10);
  return write("gestures", (current) =>
    gestureIds.map(
      (gestureId) =>
        current.find((g) => g.gestureId === gestureId) ?? { gestureId, origin, since: today },
    ),
  );
}
