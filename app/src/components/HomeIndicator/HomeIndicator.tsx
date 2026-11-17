import styles from "./HomeIndicator.module.css";

/** Figma : Hooka/HomeIndicator (7:111). Maquette uniquement, masqué sur vrai mobile. */
export function HomeIndicator({ className }: { className?: string }) {
  return (
    <div className={[styles.zone, className].filter(Boolean).join(" ")} aria-hidden="true">
      <span className={styles.bar} />
    </div>
  );
}
