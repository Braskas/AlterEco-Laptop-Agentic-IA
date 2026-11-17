import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Mic } from "lucide-react";
import { Button, Field, Header, Icon, PermissionSheet } from "../../components";
import { consentsApi } from "../../data/api";
import { useAsync } from "../../hooks/useAsync";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import { cx } from "../../lib/cx";
import shared from "../shared/Screen.module.css";
import styles from "./Capture.module.css";

/**
 * /capture/voix — E4.4 · Demande voix. Sans autorisation micro : feuille E1.6 · Micro.
 * Prototype : la dictée est simulée (la phrase s'écrit toute seule), le champ reste modifiable.
 */
const DEMO_PHRASE = "Il me faut une perceuse";

export function Voice() {
  const navigate = useNavigate();
  const micro = useAsync(() => consentsApi.hasConsent("micro"), []);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);

  // Dictée simulée, lettre par lettre
  useEffect(() => {
    if (!micro.data) return;
    setListening(true);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setText(DEMO_PHRASE.slice(0, i));
      if (i >= DEMO_PHRASE.length) {
        clearInterval(timer);
        setListening(false);
      }
    }, 60);
    return () => clearInterval(timer);
  }, [micro.data]);

  function search() {
    if (text.trim()) navigate(`/carte?q=${encodeURIComponent(text.trim())}`);
  }

  const overlay =
    micro.status === "success" && !micro.data ? (
      <PermissionSheet
        type="micro"
        onAllow={async () => {
          await consentsApi.setConsent("micro", true);
          micro.reload();
        }}
        onDecline={async () => {
          await consentsApi.setConsent("micro", false);
          navigate("/capture/texte", { replace: true });
        }}
      />
    ) : null;

  return (
    <PhoneFrame
      header={<Header />}
      overlay={overlay}
      footer={
        <Button block onClick={search} disabled={!text.trim()}>
          Chercher
        </Button>
      }
    >
      <h1 className={shared.title}>Dis-moi ce qu’il te faut.</h1>
      <Field label="Ta demande" endIcon={null} value={text} onChange={(e) => setText(e.target.value)} />
      <div className={styles.listening}>
        <span className={cx(styles.mic, listening && styles.active)}>
          <Icon as={Mic} />
        </span>
        <p className={styles.micLabel} aria-live="polite">
          {listening ? "Je t’écoute…" : "C’est noté."}
        </p>
        <p className={shared.caption}>L’audio n’est pas gardé.</p>
      </div>
      <p className={shared.caption}>Marche pour tous les domaines : outil, vêtement, meuble…</p>
    </PhoneFrame>
  );
}
