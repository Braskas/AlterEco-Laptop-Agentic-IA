import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Bookmark, MapPin, Navigation } from "lucide-react";
import { Button, Chip, EmptyState, Header, Icon, Loader, Toast } from "../../components";
import { decisionsApi, recommendationsApi } from "../../data/api";
import { useAsync } from "../../hooks/useAsync";
import { useVue } from "../../hooks/useVue";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import { formatDistance } from "../../lib/format";
import shared from "../shared/Screen.module.css";
import styles from "./ActionScreen.module.css";

/**
 * /action/:recId — E7 · Action lancée après « Je fonce ».
 *   avec un lieu → E7.1 (itinéraire) · avec des étapes → E7.2 (énergie) · ?vue=garde → E7.3
 * La décision n'est enregistrée qu'à « Y aller » / « C'est fait » (déclaratif), puis E8.
 */
export function ActionScreen() {
  const { recId = "" } = useParams();
  const navigate = useNavigate();
  const [vue, setVue] = useVue<"garde">();
  const [busy, setBusy] = useState(false);
  const card = useAsync(() => recommendationsApi.getCardById(recId), [recId]);

  if (card.status === "loading") {
    return (
      <PhoneFrame>
        <div className={styles.center}>
          <Loader message="On prépare la suite…" />
        </div>
      </PhoneFrame>
    );
  }

  if (card.status === "error" || !card.data) {
    return (
      <PhoneFrame header={<Header />}>
        <EmptyState
          title="Oups, on a perdu le fil."
          message="Cette idée n’est plus disponible."
          action={{ label: "Retour à l’accueil", onClick: () => navigate("/accueil") }}
        />
      </PhoneFrame>
    );
  }

  const { recommendation: rec, place } = card.data;
  const guided = !!rec.steps?.length;

  async function confirm() {
    setBusy(true);
    const decision = await decisionsApi.acceptCard(rec.id);
    navigate(`/confirmation/${decision.id}`);
  }

  async function keep() {
    await decisionsApi.setAside(rec.id);
    setVue("garde");
  }

  const footer = (
    <>
      {vue === "garde" && <Toast onDone={() => setVue(null)}>Gardé. Retrouve-le dans Mon foyer.</Toast>}
      <Button block icon={guided ? undefined : Navigation} onClick={confirm} disabled={busy}>
        {guided ? "C’est fait" : "Y aller"}
      </Button>
      <Button block variant="secondary" icon={Bookmark} onClick={keep}>
        Garder pour plus tard
      </Button>
      <Button variant="link" className={shared.footerLink} onClick={() => navigate("/accueil")}>
        Retour à l’accueil
      </Button>
    </>
  );

  return (
    <PhoneFrame header={<Header />} footer={footer}>
      <h1 className={shared.title}>C’est parti.</h1>

      {guided ? (
        <>
          {rec.actionIntro && <p className={shared.lead}>{rec.actionIntro}</p>}
          <section className={shared.card}>
            <ol className={styles.steps}>
              {rec.steps!.map((step, i) => (
                <li key={step} className={styles.step}>
                  <span className={styles.number} aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div>
              <Chip variant="blush">{rec.gain.label}</Chip>
            </div>
          </section>
        </>
      ) : (
        <section className={shared.card}>
          <h2 className={shared.heading}>{rec.title}</h2>
          {place && (
            <>
              <p className={styles.meta}>
                {place.name}
                {place.hours && ` · ${place.hours}`}
              </p>
              <div className={styles.route}>
                <Icon as={MapPin} />
                <span>
                  {place.distanceM === 0
                    ? "Sur place, même rayon"
                    : `${formatDistance(place.distanceM)} · ${place.walkMinutes} min à pied`}
                </span>
              </div>
            </>
          )}
          <div>
            <Chip variant="blush">{rec.gain.label}</Chip>
          </div>
        </section>
      )}
    </PhoneFrame>
  );
}
