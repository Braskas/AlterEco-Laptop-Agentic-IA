import { useNavigate } from "react-router";
import { Button, Logo } from "../../components";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import shared from "../shared/Screen.module.css";
import styles from "./Welcome.module.css";

/** E1.1 · Bienvenue — aplats géométriques de la marque (disques et pilules), sans compte. */
export function Welcome() {
  const navigate = useNavigate();

  return (
    <PhoneFrame
      footer={
        <>
          <Button block size="l" onClick={() => navigate("/onboarding/domaines")}>
            Commencer
          </Button>
          <p className={shared.centerCaption}>Sans compte. Trois minutes, pas plus.</p>
        </>
      }
    >
      <Logo />
      <div className={styles.shapes} aria-hidden="true">
        <span className={styles.disc} />
        <span className={styles.pill} />
        <span className={styles.blush} />
        <span className={styles.violet} />
      </div>
      <div className={styles.text}>
        <h1 className={shared.title}>Le bon réflexe, en 30 secondes.</h1>
        <p className={shared.lead}>Une idée maligne au moment de choisir.</p>
      </div>
    </PhoneFrame>
  );
}
