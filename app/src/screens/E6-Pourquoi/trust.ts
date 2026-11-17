import type { TrustSource } from "../../components";
import type { Card, Profile, Source } from "../../data/types";
import { sourceCertainty } from "../../engine/recommend";
import { DEMO_TODAY } from "../../lib/delay";
import { criteriaLine } from "../../lib/labels";

const VERB: Record<Source["kind"], string> = {
  releve: "Relevé le",
  annonce: "Vérifiée le",
  officielle: "Publiée le",
  communautaire: "Signalée le",
};

function longDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function shortDateWithYear(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Transforme une carte du moteur en contenu de la fiche « Pourquoi ce choix ? » (E6.1). */
export function trustSheetProps(card: Card, profile: Profile) {
  const sources: TrustSource[] = card.sources.map((s) => ({
    name: s.name,
    url: s.url,
    certainty: sourceCertainty(s, DEMO_TODAY) ?? "probable",
    dateLabel: `${VERB[s.kind]} ${shortDateWithYear(s.lastVerifiedAt!)}`,
  }));
  const latest = card.sources.map((s) => s.lastVerifiedAt!).sort().at(-1)!;

  return {
    criteria: criteriaLine(profile.budget, profile.timeBudget),
    sources,
    method: card.recommendation.method,
    uncertainties: card.recommendation.uncertainty,
    updatedAt: longDate(latest),
  };
}
