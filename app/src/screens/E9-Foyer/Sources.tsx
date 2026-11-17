import { useState } from "react";
import { Button, Header, SourceBadge, Toast } from "../../components";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import { ReportSheet } from "../E6-Pourquoi/ReportSheet";
import shared from "../shared/Screen.module.css";
import styles from "./Foyer.module.css";

/** /foyer/sources — E9.5 · Sources et méthode : d'où viennent les infos, fraîcheur, certitude. */
const BLOCKS = [
  {
    title: "D’où viennent les infos",
    text: "Prix, adresses et aides viennent de sources publiques et de relevés.",
  },
  {
    title: "Vérifiées à la main",
    text: "Lyon et quelques enseignes, vérifiés par l’équipe. La date est toujours visible.",
  },
  { title: "Fraîcheur", text: "Au-delà de 6 mois, une info passe en « À revérifier »." },
];

export function Sources() {
  const [reporting, setReporting] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <PhoneFrame
      header={<Header title="Sources et méthode" />}
      overlay={
        reporting && (
          <ReportSheet
            onClose={() => setReporting(false)}
            onSent={() => {
              setReporting(false);
              setSent(true);
            }}
          />
        )
      }
      footer={sent ? <Toast onDone={() => setSent(false)}>Merci. On vérifie sous 7 jours.</Toast> : undefined}
    >
      {BLOCKS.map((b) => (
        <section key={b.title} className={styles.block}>
          <h2 className={styles.blockTitle}>{b.title}</h2>
          <p className={styles.note}>{b.text}</p>
        </section>
      ))}
      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Trois niveaux de certitude</h2>
        <div className={styles.badges}>
          <SourceBadge certainty="solide" source="Plusieurs sources récentes" />
          <SourceBadge certainty="probable" source="Une source récente" />
          <SourceBadge certainty="conteste" source="Les experts ne sont pas d’accord" />
        </div>
      </section>
      <Button variant="link" className={shared.footerLink} onClick={() => setReporting(true)}>
        Une info ne va pas ? Dis-le nous.
      </Button>
    </PhoneFrame>
  );
}
