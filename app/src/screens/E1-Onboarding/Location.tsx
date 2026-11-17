import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Autocomplete, Button, Chip, Field } from "../../components";
import { placesApi, profileApi, type City } from "../../data/api";
import { useAsync } from "../../hooks/useAsync";
import shared from "../shared/Screen.module.css";
import { OnboardingStep } from "./OnboardingStep";
import styles from "./Location.module.css";

/**
 * E1.4 · Tu vis où ?
 *   - Ville ou code postal : communes réelles (geo.api.gouv.fr), au fil de la frappe.
 *   - Tes enseignes habituelles : commerces OpenStreetMap autour de la commune choisie.
 * Si un service ne répond pas : la saisie libre reste possible et la liste d'exemple revient.
 */
type SearchState = "idle" | "loading" | "empty" | "error";
type StoresState = "demo" | "loading" | "ready" | "error";

export function Location() {
  const profile = useAsync(() => profileApi.getProfile(), []);
  const [text, setText] = useState("");
  const [city, setCity] = useState<City | null>(null);
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [search, setSearch] = useState<SearchState>("idle");

  const [available, setAvailable] = useState<string[]>(placesApi.demoStores());
  const [storesState, setStoresState] = useState<StoresState>("demo");
  const [stores, setStores] = useState<string[]>([]);
  const [extra, setExtra] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [newStore, setNewStore] = useState("");
  const [storesAttempt, setStoresAttempt] = useState(0);
  const restored = useRef(false);

  // Reprend le profil : commune déjà choisie (avec son centre) ou saisie libre (« Lyon 7e »).
  useEffect(() => {
    if (profile.status !== "success" || restored.current) return;
    restored.current = true;
    const p = profile.data;
    setStores(p.usualStores);
    if (p.cityCode && p.cityCenter) {
      const saved: City = {
        code: p.cityCode,
        name: p.city,
        postalCodes: p.postalCode ? [p.postalCode] : [],
        lat: p.cityCenter.lat,
        lon: p.cityCenter.lon,
      };
      setCity(saved);
      setText(placesApi.cityLabel(saved));
    } else {
      setText(p.city);
      setExtra(p.usualStores.filter((s) => !placesApi.demoStores().includes(s)));
    }
  }, [profile.status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Suggestions de communes, 250 ms après la dernière frappe
  useEffect(() => {
    if (city && text === placesApi.cityLabel(city)) return;
    if (text.trim().length < 2) {
      setSuggestions([]);
      setSearch("idle");
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearch("loading");
      try {
        const found = await placesApi.searchCities(text, controller.signal);
        setSuggestions(found);
        setSearch(found.length ? "idle" : "empty");
      } catch (e) {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setSearch("error");
        }
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [text, city]);

  // Enseignes autour de la commune choisie
  useEffect(() => {
    if (!city) {
      setAvailable(placesApi.demoStores());
      setStoresState("demo");
      return;
    }
    const controller = new AbortController();
    setStoresState("loading");
    placesApi
      .nearbyStores(city, controller.signal)
      .then((found) => {
        setAvailable(found);
        setStoresState("ready");
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setAvailable(placesApi.demoStores());
        setStoresState("error");
      });
    return () => controller.abort();
  }, [city, storesAttempt]);

  function selectCity(next: City) {
    setCity(next);
    setText(placesApi.cityLabel(next));
    setSuggestions([]);
    setStores([]); // nouvelle ville, nouvelles enseignes
    setExtra([]);
  }

  function changeText(value: string) {
    setText(value);
    if (city && value !== placesApi.cityLabel(city)) setCity(null);
  }

  const allStores = [...available, ...extra.filter((s) => !available.includes(s))];

  function toggle(store: string) {
    setStores((list) => (list.includes(store) ? list.filter((s) => s !== store) : [...list, store]));
  }

  function addStore() {
    const name = newStore.trim();
    if (name && !allStores.includes(name)) setExtra((l) => [...l, name]);
    if (name && !stores.includes(name)) setStores((l) => [...l, name]);
    setNewStore("");
    setAdding(false);
  }

  const searchHint =
    search === "error"
      ? "Recherche indisponible : écris simplement ta ville."
      : search === "empty"
        ? "Aucune commune trouvée. Vérifie l’orthographe ou le code postal."
        : city?.department
          ? `${city.name} · ${city.department}`
          : undefined;

  const storesCaption: Record<StoresState, string> = {
    demo: "Exemples de la démo. Choisis ta ville dans la liste pour voir les enseignes près de chez toi.",
    loading: `On cherche les enseignes autour de ${city?.name ?? "chez toi"}… (jusqu’à 25 secondes)`,
    ready: available.length
      ? `À moins de ${placesApi.STORE_RADIUS_M / 1000} km de ${city?.name} · données © OpenStreetMap`
      : "Pas d’enseigne connue autour. Ajoute les tiennes.",
    error: "Enseignes indisponibles pour l’instant : voici des exemples.",
  };

  return (
    <OnboardingStep
      step={3}
      title="Tu vis où ?"
      lead="Pour trouver près de chez toi."
      nextDisabled={!text.trim()}
      onNext={async () => {
        const typedPostal = text.match(/\b\d{5}\b/)?.[0] ?? "";
        await profileApi.updateProfile({
          city: city ? city.name : text.trim(),
          postalCode: city ? (city.postalCodes[0] ?? "") : typedPostal,
          cityCode: city?.code,
          cityCenter: city ? { lat: city.lat, lon: city.lon } : undefined,
          usualStores: stores,
        });
        return "/onboarding/temps";
      }}
    >
      <Autocomplete
        label="Ville ou code postal"
        showLabel
        placeholder="Clermont-Ferrand, 63000…"
        value={text}
        onChange={changeText}
        loading={search === "loading"}
        hint={searchHint}
        autoComplete="address-level2"
        options={suggestions.map((c) => ({
          id: c.code,
          label: c.name,
          meta: [c.postalCodes.slice(0, 3).join(", "), c.department].filter(Boolean).join(" · "),
        }))}
        onSelect={(option) => {
          const next = suggestions.find((c) => c.code === option.id);
          if (next) selectCity(next);
        }}
      />

      <div className={shared.section}>
        <p className={shared.context}>Tes enseignes habituelles (facultatif)</p>
        <div className={shared.chips} aria-busy={storesState === "loading"}>
          {storesState !== "loading" &&
            allStores.map((store) => (
              <Chip key={store} selected={stores.includes(store)} onClick={() => toggle(store)}>
                {store}
              </Chip>
            ))}
          <Chip icon={Plus} onClick={() => setAdding(true)}>
            Ajouter
          </Chip>
        </div>
        <p className={styles.caption} aria-live="polite">
          {storesCaption[storesState]}
        </p>
        {storesState === "error" && (
          <Button variant="link" className={shared.footerLink} onClick={() => setStoresAttempt((n) => n + 1)}>
            Réessayer
          </Button>
        )}
        {adding && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addStore();
            }}
          >
            <Field
              label="Nom de l’enseigne"
              placeholder="Nom de l’enseigne, puis Entrée"
              endIcon={null}
              autoFocus
              value={newStore}
              onChange={(e) => setNewStore(e.target.value)}
              onBlur={addStore}
            />
          </form>
        )}
      </div>
    </OnboardingStep>
  );
}
