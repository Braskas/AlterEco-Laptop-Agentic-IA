import styles from "./StatusBar.module.css";

/**
 * Figma : Hooka/StatusBar (7:105). Barre d'état de maquette (9:41).
 * Affichée seulement dans le cadre téléphone sur desktop : sur un vrai mobile,
 * c'est le système qui la dessine (PhoneFrame la masque).
 */
export function StatusBar({ className }: { className?: string }) {
  return (
    <div className={[styles.bar, className].filter(Boolean).join(" ")} aria-hidden="true">
      <span className={styles.time}>9:41</span>
      <span className={styles.indicators}>
        <span className={styles.signal} />
        <span className={styles.wifi} />
        <span className={styles.battery} />
      </span>
    </div>
  );
}
