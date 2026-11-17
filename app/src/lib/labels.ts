import type { BudgetLevel, DomainId, TimeBudget } from "../data/types";

/** Libellés Figma des choix d'onboarding (E1.3, E1.5), réutilisés dans les réglages (E9.3). */
export const BUDGET_OPTIONS: { id: BudgetLevel; title: string; help: string }[] = [
  { id: "serre", title: "Serré", help: "Chaque euro compte." },
  { id: "equilibre", title: "Équilibré", help: "Le juste prix, sans prise de tête." },
  { id: "confortable", title: "Confortable", help: "Prêt à payer un peu plus." },
];

export const TIME_OPTIONS: { id: TimeBudget; title: string; help: string; criterion: string }[] = [
  { id: "court", title: "Moins d’une minute", help: "Une idée, tout de suite.", criterion: "tout de suite" },
  {
    id: "moyen",
    title: "Quelques minutes",
    help: "Un petit détour, si ça vaut le coup.",
    criterion: "quelques minutes",
  },
  { id: "long", title: "Je prends mon temps", help: "Montre-moi le détail.", criterion: "sans se presser" },
];

export function budgetLabel(id: BudgetLevel): string {
  return BUDGET_OPTIONS.find((o) => o.id === id)!.title;
}

export function timeOption(id: TimeBudget) {
  return TIME_OPTIONS.find((o) => o.id === id)!;
}

const DISTANCE_BY_TIME: Record<TimeBudget, string> = {
  court: "sur place",
  moyen: "à moins d’1 km",
  long: "à moins de 3 km",
};

/** Ligne de rappel du profil : « Budget équilibré · Lyon 7e · quelques minutes » (E4.7). */
export function profileLine(budget: BudgetLevel, city: string, time: TimeBudget): string {
  return [`Budget ${budgetLabel(budget).toLowerCase()}`, city, timeOption(time).criterion]
    .filter(Boolean)
    .join(" · ");
}

/** Critères de la fiche de confiance : « Budget équilibré · à moins d'1 km · quelques minutes » (E6.1). */
export function criteriaLine(budget: BudgetLevel, time: TimeBudget): string {
  return [`Budget ${budgetLabel(budget).toLowerCase()}`, DISTANCE_BY_TIME[time], timeOption(time).criterion].join(
    " · ",
  );
}

/** Lieux rapides de l'accueil (E3.1) → domaine proposé. */
export const PLACE_SHORTCUTS: { label: string; domain: DomainId; banner: string }[] = [
  { label: "Supermarché", domain: "alimentation", banner: "Tu es au supermarché. On regarde l’alimentation ?" },
  { label: "Bricolage", domain: "seconde-main", banner: "Tu es dans un magasin de bricolage. On regarde la seconde main ?" },
  { label: "Maison", domain: "energie", banner: "Tu es chez toi. On regarde ton énergie ?" },
];

/** Mots qui signalent un domaine pas encore ouvert (E3.3). */
export const LOCKED_KEYWORDS: { domain: DomainId; words: string[]; message: string }[] = [
  {
    domain: "deplacements",
    words: ["train", "billet", "bus", "voiture", "vélo", "velo", "avion", "covoiturage"],
    message: "Les déplacements arrivent bientôt. On note ta demande.",
  },
  {
    domain: "numerique",
    words: ["téléphone", "telephone", "ordinateur", "forfait", "box", "internet"],
    message: "Le numérique arrive bientôt. On note ta demande.",
  },
];

/** Mois courts : « 14 nov. » à partir d'une date ISO complète. */
export function shortDateFromIso(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
