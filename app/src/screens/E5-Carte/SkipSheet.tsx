import { useId, useState } from "react";
import { Button, Chip, Sheet, Toast } from "../../components";
import type { Decision } from "../../data/types";
import shared from "../shared/Screen.module.css";
import styles from "./SkipSheet.module.css";

/** E5.6 · Pas aujourd'hui — raison facultative, sans pénalité. */
const REASONS: { id: NonNullable<Decision["skipReason"]>; label: string }[] = [
  { id: "trop-cher", label: "Trop cher" },
  { id: "pas-le-temps", label: "Pas le temps" },
  { id: "trop-loin", label: "Trop loin" },
  { id: "pas-envie", label: "Pas envie" },
];

type SkipSheetProps = {
  onReason: (reason: Decision["skipReason"]) => void;
  onHome: () => void;
  onSkipQuestion: () => void;
};

export function SkipSheet({ onReason, onHome, onSkipQuestion }: SkipSheetProps) {
  const titleId = useId();
  const [reason, setReason] = useState<Decision["skipReason"]>();
  const [toast, setToast] = useState(true);

  return (
    <Sheet
      onClose={onSkipQuestion}
      labelledBy={titleId}
      above={toast ? <Toast onDone={() => setToast(false)}>Aucune pénalité. On retient ta préférence.</Toast> : null}
    >
      <h2 id={titleId} className={styles.title}>
        Une raison ? (facultatif)
      </h2>
      <p className={shared.lead}>Ça nous aide à mieux viser la prochaine fois.</p>
      <div className={shared.chips}>
        {REASONS.map((r) => (
          <Chip
            key={r.id}
            selected={reason === r.id}
            onClick={() => {
              setReason(r.id);
              onReason(r.id);
            }}
          >
            {r.label}
          </Chip>
        ))}
      </div>
      <Button variant="secondary" block onClick={onHome}>
        Retour à l’accueil
      </Button>
      <Button variant="link" className={shared.footerLink} onClick={onSkipQuestion}>
        Passer
      </Button>
    </Sheet>
  );
}
