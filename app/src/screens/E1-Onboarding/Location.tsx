import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Chip, Field } from "../../components";
import { profileApi } from "../../data/api";
import { useAsync } from "../../hooks/useAsync";
import shared from "../shared/Screen.module.css";
import { OnboardingStep } from "./OnboardingStep";

/** E1.4 · Tu vis où ? — ville et enseignes habituelles (facultatif). */
export function Location() {
  const profile = useAsync(() => profileApi.getProfile(), []);
  const catalogStores = useAsync(() => profileApi.listStores(), []);
  const [city, setCity] = useState("");
  const [stores, setStores] = useState<string[]>([]);
  const [extra, setExtra] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [newStore, setNewStore] = useState("");

  useEffect(() => {
    if (profile.status !== "success") return;
    setCity(profile.data.city || "Lyon 7e");
    setStores(profile.data.usualStores);
  }, [profile.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const allStores = [...(catalogStores.data ?? []), ...extra];

  function toggle(store: string) {
    setStores((list) => (list.includes(store) ? list.filter((s) => s !== store) : [...list, store]));
  }

  function addStore() {
    const name = newStore.trim();
    if (name && !allStores.includes(name)) setExtra((l) => [...l, name]);
    if (name) setStores((l) => [...l, name]);
    setNewStore("");
    setAdding(false);
  }

  return (
    <OnboardingStep
      step={3}
      title="Tu vis où ?"
      lead="Pour trouver près de chez toi."
      nextDisabled={!city.trim()}
      onNext={async () => {
        await profileApi.updateProfile({ city: city.trim(), usualStores: stores });
        return "/onboarding/temps";
      }}
    >
      <Field
        label="Ville ou code postal"
        showLabel
        endIcon={null}
        value={city}
        onChange={(e) => setCity(e.target.value)}
        autoComplete="address-level2"
      />
      <div className={shared.section}>
        <p className={shared.context}>Tes enseignes habituelles (facultatif)</p>
        <div className={shared.chips}>
          {allStores.map((store) => (
            <Chip key={store} selected={stores.includes(store)} onClick={() => toggle(store)}>
              {store}
            </Chip>
          ))}
          <Chip icon={Plus} onClick={() => setAdding(true)}>
            Ajouter
          </Chip>
        </div>
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
