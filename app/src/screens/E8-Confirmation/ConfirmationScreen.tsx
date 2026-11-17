import { useNavigate, useParams } from "react-router";
import { Button, DoubleBonus, EmptyState, Loader } from "../../components";
import { decisionsApi } from "../../data/api";
import { useAsync } from "../../hooks/useAsync";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import { formatEuros, formatEurosTotal } from "../../lib/format";
import shared from "../shared/Screen.module.css";
import styles from "./ConfirmationScreen.module.css";

/**
 * /confirmation/:decisionId — E8 · Confirmation et petit pas suivant.
 *   E8.1 : compteur cumulé · E8.2 : premier gain (la planète est encore à zéro → « À toi de jouer »).
 */
export function ConfirmationScreen() {
  const { decisionId = "" } = useParams();
  const navigate = useNavigate();
  const data = useAsync(() => decisionsApi.getConfirmation(decisionId), [decisionId]);

  if (data.status === "loading") {
    return (
      <PhoneFrame>
        <div className={styles.center}>
          <Loader message="On met à jour ton compteur…" />
        </div>
      </PhoneFrame>
    );
  }

  if (data.status === "error" || !data.data) {
    return (
      <PhoneFrame>
        <EmptyState
          title="Oups, on a perdu le fil."
          message="Tes gains restent visibles dans Mon foyer."
          action={{ label: "Mon foyer", onClick: () => navigate("/foyer") }}
        />
      </PhoneFrame>
    );
  }

  const { recommendation: rec, summary, isFirst, next } = data.data;
  const gain = formatEuros(rec.gain.euros);

  return (
    <PhoneFrame
      footer={
        <Button block variant="secondary" onClick={() => navigate("/accueil")}>
          Retour à l’accueil
        </Button>
      }
    >
      <div className={styles.intro}>
        <h1 className={shared.title}>Joli coup : {gain} gardés.</h1>
        <p className={shared.lead}>
          {isFirst ? "Ton premier gain. Le compteur démarre." : "Ajouté au compteur de ton foyer."}
        </p>
      </div>

      <DoubleBonus
        money={{
          value: formatEurosTotal(summary.euros),
          detail: isFirst ? `sur ${rec.shortName}` : `dont ${gain} sur ${rec.shortName}`,
        }}
        planet={summary.carKm > 0 ? { value: `${summary.carKm} km`, detail: "de voiture évités" } : null}
        nextStep={next?.chip}
      />

      {next && (
        <section className={shared.card}>
          <p className={shared.context}>Petit pas suivant</p>
          <h2 className={shared.heading}>{next.title}</h2>
          <p className={shared.caption}>{next.meta}</p>
          <Button block onClick={() => navigate(`/carte?q=${encodeURIComponent(next.query)}`)}>
            J’essaie
          </Button>
        </section>
      )}
    </PhoneFrame>
  );
}
