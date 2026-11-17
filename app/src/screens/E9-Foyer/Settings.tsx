import { useNavigate } from "react-router";
import { Clock, LayoutGrid, MapPin, ShoppingBasket, Wallet } from "lucide-react";
import { Header, ListRow } from "../../components";
import { profileApi } from "../../data/api";
import { useAsync } from "../../hooks/useAsync";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import { budgetLabel, timeOption } from "../../lib/labels";

/**
 * /foyer/reglages — E9.3 · Mes réglages.
 * Chaque ligne rouvre l'écran d'onboarding correspondant en mode édition (?retour=…).
 */
const RETOUR = `?retour=${encodeURIComponent("/foyer/reglages")}`;

export function Settings() {
  const navigate = useNavigate();
  const data = useAsync(async () => {
    const [profile, priority, domains] = await Promise.all([
      profileApi.getProfile(),
      profileApi.getPriorityDomains(),
      profileApi.listDomains(),
    ]);
    return { profile, priority, domains };
  }, []);

  const p = data.data?.profile;
  const domainLabels = data.data?.priority
    .map((pd) => data.data!.domains.find((d) => d.id === pd.domain)?.label)
    .filter(Boolean)
    .join(", ");

  return (
    <PhoneFrame header={<Header title="Mes réglages" />}>
      {p && (
        <div>
          <ListRow
            icon={LayoutGrid}
            label="Domaines"
            value={domainLabels || "À choisir"}
            onClick={() => navigate(`/onboarding/domaines${RETOUR}`)}
          />
          <ListRow
            icon={Wallet}
            label="Budget"
            value={budgetLabel(p.budget)}
            onClick={() => navigate(`/onboarding/budget${RETOUR}`)}
          />
          <ListRow
            icon={MapPin}
            label="Lieu"
            value={p.city || "À renseigner"}
            onClick={() => navigate(`/onboarding/lieu${RETOUR}`)}
          />
          <ListRow
            icon={ShoppingBasket}
            label="Enseignes"
            value={p.usualStores.join(", ") || "Aucune"}
            onClick={() => navigate(`/onboarding/lieu${RETOUR}`)}
          />
          <ListRow
            icon={Clock}
            label="Temps disponible"
            value={timeOption(p.timeBudget).title}
            onClick={() => navigate(`/onboarding/temps${RETOUR}`)}
          />
        </div>
      )}
    </PhoneFrame>
  );
}
