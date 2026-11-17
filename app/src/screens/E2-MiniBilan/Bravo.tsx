import { useNavigate } from "react-router";
import { Check } from "lucide-react";
import { Button, Chip } from "../../components";
import { profileApi } from "../../data/api";
import { useAsync } from "../../hooks/useAsync";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import shared from "../shared/Screen.module.css";
import styles from "./MiniBilan.module.css";

/** E2.2 · Retour positif — valoriser ce qui est déjà fait, jamais de score. */
export function Bravo() {
  const navigate = useNavigate();
  const gestures = useAsync(async () => {
    const [all, mine] = await Promise.all([profileApi.listGestures(), profileApi.getUserGestures()]);
    return all.filter((g) => mine.some((m) => m.gestureId === g.id));
  }, []);

  const done = gestures.data ?? [];
  const count = done.length;

  return (
    <PhoneFrame
      footer={
        <Button block onClick={() => navigate("/accueil")}>
          Aller à l’accueil
        </Button>
      }
    >
      <div className={`${styles.intro} ${shared.noHeader}`}>
        <h1 className={shared.title}>{count ? "Joli départ." : "On part de là."}</h1>
        <p className={shared.lead}>
          {count
            ? `Tu fais déjà ${count} ${count > 1 ? "petits pas" : "petit pas"}. On part de là.`
            : "Pas de gestes cochés : Hooka te propose le premier."}
        </p>
      </div>
      {count > 0 && (
        <section className={`${shared.card} ${styles.card}`}>
          <p className={shared.context}>Déjà fait</p>
          {done.map((g) => (
            <p key={g.id} className={styles.done}>
              <Chip variant="lilac" icon={Check}>
                Petit pas
              </Chip>
              <span>{g.doneLabel}</span>
            </p>
          ))}
        </section>
      )}
      <p className={shared.caption}>Hooka s’en sert pour te proposer la suite.</p>
    </PhoneFrame>
  );
}
