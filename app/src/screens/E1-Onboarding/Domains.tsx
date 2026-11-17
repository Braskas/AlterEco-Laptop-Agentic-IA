import { useEffect, useState } from "react";
import { Option, Toast } from "../../components";
import { profileApi, recommendationsApi } from "../../data/api";
import type { DomainId } from "../../data/types";
import { useAsync } from "../../hooks/useAsync";
import { useVue } from "../../hooks/useVue";
import shared from "../shared/Screen.module.css";
import { OnboardingStep } from "./OnboardingStep";

/** E1.2 · Choisis tes 3 domaines — E1.2b (?vue=prevenu) : toast après « Me prévenir ». */
export function Domains() {
  const [vue, setVue] = useVue<"prevenu">();
  const domains = useAsync(() => profileApi.listDomains(), []);
  const saved = useAsync(() => profileApi.getPriorityDomains(), []);
  const [chosen, setChosen] = useState<DomainId[]>([]);

  // Préremplit : choix enregistrés, sinon les domaines actifs (3 dans le prototype).
  useEffect(() => {
    if (saved.status !== "success" || domains.status !== "success") return;
    setChosen(
      saved.data.length
        ? saved.data.map((d) => d.domain)
        : domains.data.filter((d) => d.active).map((d) => d.id).slice(0, 3),
    );
  }, [saved.status, domains.status]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggle(id: DomainId, on: boolean) {
    setChosen((list) => (on ? [...list, id].slice(-3) : list.filter((d) => d !== id)));
  }

  return (
    <OnboardingStep
      step={1}
      title="Choisis tes 3 domaines"
      lead="On commence par ceux-là. Les autres arrivent."
      nextDisabled={chosen.length === 0}
      onNext={async () => {
        await profileApi.setPriorityDomains(chosen);
        return "/onboarding/budget";
      }}
      toast={vue === "prevenu" && <Toast onDone={() => setVue(null)}>Noté. On te prévient dès que c’est prêt.</Toast>}
    >
      <div className={shared.stack}>
        {domains.data?.map((d) =>
          d.active ? (
            <Option
              key={d.id}
              type="checkbox"
              title={d.label}
              help={d.description}
              checked={chosen.includes(d.id)}
              onChange={(on) => toggle(d.id, on)}
            />
          ) : (
            <Option
              key={d.id}
              locked
              title={d.label}
              help={d.description}
              onNotify={() => {
                recommendationsApi.logUnmetRequest({ type: "me-prevenir", domain: d.id });
                setVue("prevenu");
              }}
            />
          ),
        )}
      </div>
    </OnboardingStep>
  );
}
