import styles from "./Handle.module.css";

/** Figma : Hooka/Poignée (9:60). Poignée en haut des feuilles (TrustSheet, permissions). */
export function Handle({ className }: { className?: string }) {
  return (
    <div className={[styles.zone, className].filter(Boolean).join(" ")} aria-hidden="true">
      <span className={styles.bar} />
    </div>
  );
}
