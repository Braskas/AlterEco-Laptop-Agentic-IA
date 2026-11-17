import { beforeEach, describe, expect, it } from "vitest";
import { consentsApi, decisionsApi, profileApi, recommendationsApi, resetDb } from ".";

beforeEach(() => resetDb());

describe("base fictive", () => {
  it("part du profil de démo Lyon 7e", async () => {
    const profile = await profileApi.getProfile();
    expect(profile.postalCode).toBe("69007");
    expect(profile.budget).toBe("equilibre");
  });

  it("persiste une modification de profil", async () => {
    await profileApi.updateProfile({ budget: "serre" });
    expect((await profileApi.getProfile()).budget).toBe("serre");
  });

  it("garde 3 domaines prioritaires au plus", async () => {
    const ranked = await profileApi.setPriorityDomains(["energie", "alimentation", "seconde-main", "numerique"]);
    expect(ranked).toHaveLength(3);
    expect(ranked[0]).toEqual({ domain: "energie", rank: 1 });
  });

  it("enchaîne scan → carte → décision → compteur de gains", async () => {
    const product = await recommendationsApi.scanBarcode("3165140761802");
    expect(product?.id).toBe("prod-perceuse-neuve");

    const result = await recommendationsApi.getCardForNeed({ input: "scan", productId: product!.id });
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;

    await decisionsApi.acceptCard(result.card.recommendation.id);
    expect(await decisionsApi.getTotalGain()).toEqual({ euros: 54, count: 1 });
  });

  it("ne compte pas une carte passée dans les gains", async () => {
    await decisionsApi.skipCard("r-yaourt-vrac", "pas-envie");
    expect((await decisionsApi.getTotalGain()).count).toBe(0);
  });

  it("gère chaque autorisation séparément", async () => {
    await consentsApi.setConsent("camera", true);
    await consentsApi.setConsent("micro", false);
    expect(await consentsApi.hasConsent("camera")).toBe(true);
    expect(await consentsApi.hasConsent("micro")).toBe(false);
    expect(await consentsApi.hasConsent("localisation")).toBe(false);
  });
});
