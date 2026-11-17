import { useId, useState } from "react";
import { Button, Field, Option, Sheet } from "../../components";
import { reportsApi } from "../../data/api";
import type { Report } from "../../data/types";
import shared from "../shared/Screen.module.css";
import styles from "./ReportSheet.module.css";

/**
 * E6.2 · Signaler — « Qu'est-ce qui ne va pas ? »
 * Utilisée depuis la carte (E6.1) et depuis « Sources et méthode » (E9.5, sans recommandation).
 */
const SUBJECTS: { id: Report["subject"]; title: string }[] = [
  { id: "adresse", title: "Adresse fermée ou déplacée" },
  { id: "prix", title: "Prix faux" },
  { id: "donnee", title: "Donnée périmée" },
];

type ReportSheetProps = {
  recommendationId?: string;
  onSent: () => void;
  onClose: () => void;
};

export function ReportSheet({ recommendationId, onSent, onClose }: ReportSheetProps) {
  const titleId = useId();
  const [subject, setSubject] = useState<Report["subject"]>("adresse");
  const [detail, setDetail] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    setSending(true);
    await reportsApi.sendReport(recommendationId, subject, detail || undefined);
    onSent();
  }

  return (
    <Sheet onClose={onClose} labelledBy={titleId}>
      <h2 id={titleId} className={styles.title}>
        Qu’est-ce qui ne va pas ?
      </h2>
      <div className={shared.stack}>
        {SUBJECTS.map((s) => (
          <Option
            key={s.id}
            name="signalement"
            title={s.title}
            checked={subject === s.id}
            onChange={() => setSubject(s.id)}
          />
        ))}
      </div>
      <Field
        label="Un détail"
        placeholder="Un détail ? (facultatif)"
        endIcon={null}
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
      />
      <Button block onClick={send} disabled={sending}>
        Envoyer
      </Button>
    </Sheet>
  );
}
