import { useEffect, useState } from "react";
import { Option } from "../../components";
import { profileApi } from "../../data/api";
import type { BudgetLevel } from "../../data/types";
import { useAsync } from "../../hooks/useAsync";
import { BUDGET_OPTIONS } from "../../lib/labels";
import shared from "../shared/Screen.module.css";
import { OnboardingStep } from "./OnboardingStep";

/** E1.3 · Ton budget, en gros ? */
export function Budget() {
  const profile = useAsync(() => profileApi.getProfile(), []);
  const [budget, setBudget] = useState<BudgetLevel>("equilibre");

  useEffect(() => {
    if (profile.status === "success") setBudget(profile.data.budget);
  }, [profile.status]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <OnboardingStep
      step={2}
      title="Ton budget, en gros ?"
      lead="Modifiable plus tard, dans Mon foyer."
      onNext={async () => {
        await profileApi.updateProfile({ budget });
        return "/onboarding/lieu";
      }}
    >
      <div className={shared.stack}>
        {BUDGET_OPTIONS.map((o) => (
          <Option
            key={o.id}
            name="budget"
            title={o.title}
            help={o.help}
            checked={budget === o.id}
            onChange={() => setBudget(o.id)}
          />
        ))}
      </div>
    </OnboardingStep>
  );
}
