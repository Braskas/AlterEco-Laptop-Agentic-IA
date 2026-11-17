const euroFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** 1.45 → « 1,45 € », 35 → « 35 € » */
export function formatEuros(value: number): string {
  const hasCents = !Number.isInteger(value);
  return euroFormatter
    .formatToParts(value)
    .map((p) => (p.type === "fraction" && hasCents ? p.value.padEnd(2, "0") : p.value))
    .join("")
    .replace(/ | /g, " ");
}

/** 900 → « 900 m », 1400 → « 1,4 km », 0 → « ici » */
export function formatDistance(meters: number): string {
  if (meters === 0) return "ici";
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} km`;
}

const MONTHS_SHORT = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

/** "2026-11-12" → « 12 nov. » ; avec l'année : « avr. 2026 » */
export function formatShortDate(iso: string, withYear = false): string {
  const [y, m, d] = iso.split("-").map(Number);
  const month = MONTHS_SHORT[m - 1];
  return withYear ? `${month} ${y}` : `${d} ${month}`;
}

/** Nombre de jours entiers entre deux dates ISO (AAAA-MM-JJ). */
export function daysBetween(fromIso: string, toIso: string): number {
  const ms = Date.parse(toIso) - Date.parse(fromIso);
  return Math.floor(ms / 86_400_000);
}

/** Compteur du foyer : euros ronds au-delà de 10 € (« 142 € »), centimes en dessous (« 0,44 € »). */
export function formatEurosTotal(value: number): string {
  return formatEuros(value >= 10 ? Math.round(value) : value);
}
