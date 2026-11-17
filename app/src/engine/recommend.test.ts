import { describe, expect, it } from "vitest";
import { catalog } from "../data/db";
import type { Need, Profile, UserGesture } from "../data/types";
import { nextStep, recommend, sourceCertainty, totals } from "./recommend";

const TODAY = "2026-11-17";

const profile: Profile = {
  budget: "equilibre",
  city: "Lyon",
  postalCode: "69007",
  usualStores: [],
  timeBudget: "moyen",
};

const gestures: UserGesture[] = [{ gestureId: "g-vrac", origin: "mini-bilan", since: TODAY }];

function run(need: Need, overrides: Partial<Profile> = {}) {
  return recommend({
    need,
    profile: { ...profile, ...overrides },
    userGestures: gestures,
    catalog,
    today: TODAY,
  });
}

describe("recommend", () => {
  it("renvoie une seule carte pour un produit scanné connu (E5.1)", () => {
    const result = run({ input: "scan", productId: "prod-yaourt-marque" });
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.card.recommendation.id).toBe("r-yaourt-vrac");
    expect(result.card.place?.name).toBe("Épicerie du Coin");
  });

  it("valorise un geste déjà en place", () => {
    const result = run({ input: "scan", productId: "prod-yaourt-marque" });
    expect(result.status === "ok" && result.card.praise).toBe("Tu prends déjà le vrac. Même sens.");
  });

  it("affiche « Solide · Prix relevé » pour un relevé récent (comme Figma E5.1)", () => {
    const result = run({ input: "scan", productId: "prod-yaourt-marque" });
    expect(result.status === "ok" && result.card.certainty).toBe("solide");
    expect(result.status === "ok" && result.card.primarySource.label).toBe("Prix relevé");
  });

  it("prend la certitude de la source la plus faible", () => {
    // Relevé de prix récent (solide) + facteur ADEME de sept. (probable) → probable
    const yaourt = catalog.recommendations.find((r) => r.id === "r-yaourt-vrac")!;
    const result = recommend({
      need: { input: "scan", productId: "prod-yaourt-marque" },
      profile,
      userGestures: gestures,
      catalog: {
        ...catalog,
        recommendations: [{ ...yaourt, sourceIds: ["s-prix-epicerie", "s-emballages"] }],
      },
      today: TODAY,
    });
    expect(result.status === "ok" && result.card.certainty).toBe("probable");
    expect(result.status === "ok" && result.card.primarySource.id).toBe("s-emballages");
  });

  it("signale une source trop ancienne comme « à revérifier » (E5.4)", () => {
    const result = run({ input: "scan", productId: "prod-veste-neuve" });
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.card.certainty).toBe("a-reverifier");
    expect(result.card.staleWarning).toContain("avr. 2026");
  });

  it("n'affiche pas une recommandation sans source datée (E5.5)", () => {
    expect(run({ input: "scan", productId: "prod-chips" }).status).toBe("aucune-alternative");
  });

  it("refuse un produit inconnu (E4.3)", () => {
    expect(run({ input: "scan", productId: "inconnu" }).status).toBe("non-reconnu");
  });

  it("indique une source indisponible (E5.7)", () => {
    expect(run({ input: "scan", productId: "prod-cafe-capsules" }).status).toBe("source-indisponible");
  });

  it("respecte le temps disponible", () => {
    // Cordonnerie à 38 min : trop loin pour un temps « moyen », OK pour « long »
    expect(run({ input: "texte", query: "chaussures" }).status).toBe("aucune-alternative");
    expect(run({ input: "texte", query: "chaussures" }, { timeBudget: "long" }).status).toBe("ok");
  });

  it("respecte le budget", () => {
    expect(
      run({ input: "texte", query: "chaussures" }, { timeBudget: "long", budget: "serre" }).status,
    ).toBe("aucune-alternative");
  });

  it("comprend une demande vocale (E4.4)", () => {
    const result = run({ input: "voix", query: "je cherche une perceuse" });
    expect(result.status === "ok" && result.card.recommendation.id).toBe("r-perceuse-reconditionnee");
  });
});

describe("sourceCertainty", () => {
  const base = catalog.sources.find((s) => s.id === "s-prix-epicerie")!;

  it("relevé de moins de 30 jours → solide", () => {
    expect(sourceCertainty(base, TODAY)).toBe("solide");
  });

  it("relevé de plus de 30 jours → probable", () => {
    expect(sourceCertainty({ ...base, lastVerifiedAt: "2026-09-01" }, TODAY)).toBe("probable");
  });

  it("donnée contestée → contesté", () => {
    expect(sourceCertainty({ ...base, disputed: true }, TODAY)).toBe("conteste");
  });

  it("source non datée → inutilisable", () => {
    expect(sourceCertainty({ ...base, lastVerifiedAt: null }, TODAY)).toBeNull();
  });
});

describe("nextStep", () => {
  it("propose le pas qui suit un geste déjà fait", () => {
    const step = nextStep("seconde-main", [{ gestureId: "g-occasion", origin: "app", since: TODAY }], catalog.nextSteps);
    expect(step?.title).toBe("Fais réparer au lieu de racheter");
  });

  it("propose le geste de base s'il n'est pas encore fait", () => {
    expect(nextStep("alimentation", [], catalog.nextSteps)?.gestureId).toBe("g-vrac");
  });
});

describe("totals", () => {
  it("additionne euros et CO₂, convertis en km de voiture", () => {
    const recs = catalog.recommendations.filter((r) =>
      ["r-perceuse-reconditionnee", "r-yaourt-vrac"].includes(r.id),
    );
    expect(totals(recs)).toEqual({ euros: 54.44, co2Kg: 9, carKm: 45, count: 2 });
  });
});
