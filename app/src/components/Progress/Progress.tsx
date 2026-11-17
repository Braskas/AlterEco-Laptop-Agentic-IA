import { cx } from "../../lib/cx";
import styles from "./Progress.module.css";

/**
 * Figma : Hooka/Progression (7:94) — Étape = 1 à 4.
 * Barre de l'onboarding : segments faits en ink. (Priorité « À confirmer » dans la spec.)
 */
type ProgressProps = {
  step: number;
  total?: number;
};

export function Progress({ step, total = 4 }: ProgressProps) {
  return (
    <div
      className={styles.progress}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-label={`Étape ${step} sur ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cx(styles.segment, i < step && styles.done)} />
      ))}
    </div>
  );
}
