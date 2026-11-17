import { useNavigate } from "react-router";
import { Bookmark, Check, CircleCheck, Lock, Settings, ShieldCheck } from "lucide-react";
import { Banner, DoubleBonus, Header, HistoryRow, Icon, ListRow, Loader } from "../../components";
import { decisionsApi, profileApi } from "../../data/api";
import { useAsync } from "../../hooks/useAsync";
import { useOnline } from "../../hooks/useOnline";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import { formatDistance, formatEuros, formatEurosTotal } from "../../lib/format";
import { shortDateFromIso } from "../../lib/labels";
import shared from "../shared/Screen.module.css";
import styles from "./Foyer.module.css";

/**
 * /foyer — E9.1 · Mon foyer : compteur, historique daté, gardé pour plus tard, profil.
 * Hors ligne (ou ?horsligne=1) → E9.6 : bandeau, tout reste consultable.
 */
export function Household() {
  const navigate = useNavigate();
  const online = useOnline();
  const data = useAsync(async () => {
    const [summary, history, kept, gestures, domains] = await Promise.all([
      decisionsApi.getSummary(),
      decisionsApi.listHistory(),
      decisionsApi.listSetAside(),
      profileApi.getUserGestures(),
      profileApi.listDomains(),
    ]);
    return { summary, history, kept, gestures, domains };
  }, []);

  if (data.status !== "success") {
    return (
      <PhoneFrame header={<Header />}>
        <div className={styles.center}>
          <Loader message="On ouvre ton foyer…" />
        </div>
      </PhoneFrame>
    );
  }

  const { summary, history, kept, gestures, domains } = data.data;
  const latest = history[0];
  const domainLabel = (id: string) => domains.find((d) => d.id === id)?.label ?? "";
  const steps = gestures.length;

  return (
    <PhoneFrame header={<Header onBack={() => navigate("/accueil")} />}>
      <h1 className={shared.title}>Mon foyer</h1>

      {!online && <Banner type="attention">Hors ligne. Tes gains et ton profil restent visibles.</Banner>}

      <DoubleBonus
        money={{
          value: formatEurosTotal(summary.euros),
          detail: latest
            ? `dont ${formatEuros(latest.recommendation.gain.euros)} sur ${latest.recommendation.shortName}`
            : "Ton premier gain arrive.",
        }}
        planet={summary.carKm > 0 ? { value: `${summary.carKm} km`, detail: "de voiture évités" } : null}
      />

      {summary.countThisMonth > 0 && (
        <p className={styles.count}>
          <Icon as={CircleCheck} />
          {summary.countThisMonth} {summary.countThisMonth > 1 ? "décisions validées" : "décision validée"} ce
          mois-ci
        </p>
      )}

      {history.length > 0 && (
        <section className={styles.group}>
          <h2 className={shared.context}>Historique</h2>
          <div>
            {history.slice(0, 3).map(({ decision, recommendation: r }) => (
              <HistoryRow
                key={decision.id}
                title={r.title}
                meta={`${shortDateFromIso(decision.createdAt)} · ${domainLabel(r.domain)}`}
                gain={`${formatEuros(r.gain.euros)}${r.gain.period === "mois" ? "/mois" : ""}`}
              />
            ))}
          </div>
        </section>
      )}

      {kept.length > 0 && (
        <section className={styles.group}>
          <h2 className={shared.context}>Gardé pour plus tard</h2>
          <div>
            {kept.map((c) => (
              <ListRow
                key={c.recommendation.id}
                icon={Bookmark}
                label={c.recommendation.title}
                value={c.place ? `${c.place.name} · ${formatDistance(c.place.distanceM)}` : c.recommendation.meta}
                onClick={() => navigate(`/action/${c.recommendation.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      <section className={styles.group}>
        <h2 className={shared.context}>Mon profil</h2>
        <div>
          <ListRow
            icon={Check}
            label="Gestes déjà faits"
            value={steps ? `${steps} ${steps > 1 ? "petits pas" : "petit pas"}` : "Aucun pour l’instant"}
            onClick={() => navigate("/foyer/gestes")}
          />
          <ListRow
            icon={Settings}
            label="Mes réglages"
            value="Budget, lieu, temps"
            onClick={() => navigate("/foyer/reglages")}
          />
          <ListRow
            icon={Lock}
            label="Autorisations"
            value="Caméra, micro, lieu"
            onClick={() => navigate("/foyer/autorisations")}
          />
          <ListRow
            icon={ShieldCheck}
            label="Sources et méthode"
            value="D’où viennent les infos"
            onClick={() => navigate("/foyer/sources")}
          />
        </div>
      </section>
    </PhoneFrame>
  );
}
