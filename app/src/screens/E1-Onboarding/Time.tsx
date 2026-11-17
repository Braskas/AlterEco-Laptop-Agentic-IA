import { useEffect, useState } from "react";
import { Option } from "../../components";
import { profileApi } from "../../data/api";
import type { TimeBudget } from "../../data/types";
import { useAsync } from "../../hooks/useAsync";
import { TIME_OPTIONS } from "../../lib/labels";
import shared from "../shared/Screen.module.css";
import { OnboardingStep } from "./OnboardingStep";

/** E1.5 · Tu as combien de temps ? — fixe le détour maximal accepté par le moteur. */
export function Time() {
  const profile = useAsync(() => profileApi.getProfile(), []);
  const [time, setTime] = useState<TimeBudget>("moyen");

  useEffect(() => {
    if (profile.status === "success") setTime(profile.data.timeBudget);
  }, [profile.status]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <OnboardingStep
      step={4}
      title="Tu as combien de temps ?"
      lead="D’habitude, pour décider d’un achat."
      nextLabel="C’est parti"
      onNext={async () => {
        await profileApi.updateProfile({ timeBudget: time });
        const user = await profileApi.getUser();
        if (user.onboardingDone) return "/accueil";
        await profileApi.completeOnboarding();
        return "/mini-bilan";
      }}
    >
      <div className={shared.stack}>
        {TIME_OPTIONS.map((o) => (
          <Option
            key={o.id}
            name="temps"
            title={o.title}
            help={o.help}
            checked={time === o.id}
            onChange={() => setTime(o.id)}
          />
        ))}
      </div>
    </OnboardingStep>
  );
}
