import { useId, type ReactNode } from "react";
import type { Certainty } from "../../data/types";
import { Button } from "../Button";
import { Sheet } from "../Sheet";
import { SourceBadge } from "../SourceBadge";
import styles from "./TrustSheet.module.css";

/**
 * Figma : Hooka/TrustSheet (9:62) — fiche de confiance (E6.1), feuille depuis le bas.
 * Critères, sources avec lien et date, méthode, incertitudes en clair, date, signalement,
 * retour à la carte.
 */
export type TrustSource = {
  name: string;
  url: string;
  certainty: Certainty;
  /** « Vérifiée le 4 nov. 2026 » */
  dateLabel: string;
};

type TrustSheetProps = {
  criteria: string;
  sources: TrustSource[];
  method: string;
  uncertainties: string;
  updatedAt: string;
  onReport: () => void;
  onClose: () => void;
  inline?: boolean;
  /** Toast affiché au-dessus de la feuille. */
  above?: ReactNode;
};

export function TrustSheet({
  criteria,
  sources,
  method,
  uncertainties,
  updatedAt,
  onReport,
  onClose,
  inline,
  above,
}: TrustSheetProps) {
  const titleId = useId();

  return (
    <Sheet onClose={onClose} inline={inline} labelledBy={titleId} above={above}>
      <h2 id={titleId} className={styles.title}>
        Pourquoi ce choix ?
      </h2>

      <Block label="Critères">{criteria}</Block>

      <div className={styles.sources}>
        <h3 className={styles.label}>Sources</h3>
        {sources.map((source) => (
          <div key={source.url} className={styles.source}>
            <a href={source.url} target="_blank" rel="noreferrer" className={styles.link}>
              {source.name}
            </a>
            <div>
              <SourceBadge certainty={source.certainty} source={source.dateLabel} />
            </div>
          </div>
        ))}
      </div>

      <Block label="Méthode">{method}</Block>
      <Block label="Incertitudes">{uncertainties}</Block>
      <Block label="Mis à jour">{updatedAt}</Block>

      <button type="button" className={styles.report} onClick={onReport}>
        Une info ne va pas ? Dis-le nous.
      </button>

      <Button variant="secondary" block onClick={onClose}>
        Retour à la carte
      </Button>
    </Sheet>
  );
}

function Block({ label, children }: { label: string; children: string }) {
  return (
    <div className={styles.block}>
      <h3 className={styles.label}>{label}</h3>
      <p className={styles.text}>{children}</p>
    </div>
  );
}
