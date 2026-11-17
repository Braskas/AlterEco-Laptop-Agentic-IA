import { Chip } from "../Chip";
import styles from "./HistoryRow.module.css";

/**
 * Figma : Hooka/LigneHistorique (9:178) — historique daté du foyer, gain en pastille blush.
 *   <HistoryRow title="Perceuse reconditionnée" meta="14 nov. · Seconde main" gain="54 €" />
 */
type HistoryRowProps = {
  title: string;
  meta: string;
  gain: string;
};

export function HistoryRow({ title, meta, gain }: HistoryRowProps) {
  return (
    <div className={styles.row}>
      <span className={styles.texts}>
        <span className={styles.title}>{title}</span>
        <span className={styles.meta}>{meta}</span>
      </span>
      <Chip variant="blush">{gain}</Chip>
    </div>
  );
}
