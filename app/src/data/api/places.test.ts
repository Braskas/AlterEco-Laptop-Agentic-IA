import { describe, expect, it } from "vitest";
import { cityLabel, pickStores } from "./places";

const center = { lat: 45.787, lon: 3.1127 };
const at = (dLat: number) => ({ lat: center.lat + dLat, lon: center.lon });

describe("pickStores", () => {
  it("garde une pastille par enseigne, la plus proche, sans noms génériques", () => {
    const stores = pickStores(
      [
        { ...at(0.01), tags: { shop: "convenience", brand: "Carrefour City" } },
        { ...at(0.001), tags: { shop: "convenience", brand: "Carrefour City" } },
        { ...at(0.002), tags: { shop: "convenience", name: "Alimentation Générale" } },
        { ...at(0.003), tags: { shop: "supermarket", name: "Biocoop" } },
        { ...at(0.004), tags: { shop: "bakery", name: "Boulangerie" } },
      ],
      center,
    );
    expect(stores).toEqual(["Carrefour City", "Biocoop"]);
  });

  it("réserve des places à la seconde main et au bricolage", () => {
    const food = Array.from({ length: 10 }, (_, i) => ({ ...at(0.0001 * (i + 1)), tags: { shop: "convenience", name: `Épicerie ${i}` } }));
    const stores = pickStores(
      [...food, { ...at(0.02), tags: { shop: "second_hand", name: "Emmaüs" } }, { center: at(0.03), tags: { shop: "doityourself", brand: "Leroy Merlin" } }],
      center,
    );
    expect(stores).toHaveLength(8);
    expect(stores).toContain("Emmaüs");
    expect(stores).toContain("Leroy Merlin");
  });
});

describe("cityLabel", () => {
  it("ajoute le premier code postal", () => {
    expect(cityLabel({ name: "Clermont-Ferrand", postalCodes: ["63000", "63100"] })).toBe("Clermont-Ferrand (63000)");
  });
});
