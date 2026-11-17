import { read, write } from "../db";
import { delay, nowIso } from "../../lib/delay";
import type { Consent, ConsentPurpose } from "../types";

/** E9.4 : état de chaque autorisation. Absente = jamais demandée. */
export async function listConsents(): Promise<Consent[]> {
  await delay();
  return read("consents");
}

export async function hasConsent(purpose: ConsentPurpose): Promise<boolean> {
  const consents = await listConsents();
  return consents.some((c) => c.purpose === purpose && c.granted);
}

/** E1.6 / E9.4 : accorder ou retirer une autorisation, une finalité à la fois. */
export async function setConsent(purpose: ConsentPurpose, granted: boolean): Promise<Consent[]> {
  await delay();
  return write("consents", (list) => [
    ...list.filter((c) => c.purpose !== purpose),
    { purpose, granted, updatedAt: nowIso() },
  ]);
}
