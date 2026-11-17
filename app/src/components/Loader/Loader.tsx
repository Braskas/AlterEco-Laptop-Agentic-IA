import styles from "./Loader.module.css";

/**
 * Figma : Hooka/Chargement (9:136) — symbole Hooka 72 px + microcopy.
 * Les pupilles glissent vers la droite (animation coupée sous prefers-reduced-motion).
 * Le symbole est en SVG inline (mêmes tracés que assets/logo/hooka-symbol.svg)
 * pour pouvoir animer les pupilles.
 */
export function Loader({ message = "On fouille le quartier…" }: { message?: string }) {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <svg width="72" height="72" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <path
          d="M34.375 0H9.625C4.30926 0 0 4.30926 0 9.625V34.375C0 39.6907 4.30926 44 9.625 44H34.375C39.6907 44 44 39.6907 44 34.375V9.625C44 4.30926 39.6907 0 34.375 0Z"
          fill="#FF3E8E"
        />
        <circle cx="15.9844" cy="22" r="5.3281" stroke="#17131F" strokeWidth="2.57812" />
        <circle cx="29.9062" cy="22" r="5.3281" stroke="#17131F" strokeWidth="2.57812" />
        <g className={styles.pupils}>
          <circle cx="17.3594" cy="22" r="1.8906" fill="#17131F" />
          <circle cx="31.2812" cy="22" r="1.8906" fill="#17131F" />
        </g>
      </svg>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
