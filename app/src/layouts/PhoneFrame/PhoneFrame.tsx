import type { ReactNode } from "react";
import styles from "./PhoneFrame.module.css";

/**
 * Cadre téléphone 393 × 852 (taille des écrans Figma).
 * Sur desktop, l'écran est centré comme une maquette ; sur mobile, il prend tout l'écran.
 * Les composants StatusBar / HomeIndicator (Figma 7:105, 7:111) viendront s'y brancher.
 */
type PhoneFrameProps = {
  children: ReactNode;
  /** Zone collée en bas (boutons d'action), au-dessus de l'indicateur d'accueil. */
  footer?: ReactNode;
};

export function PhoneFrame({ children, footer }: PhoneFrameProps) {
  return (
    <div className={styles.stage}>
      <div className={styles.phone}>
        <main className={styles.content}>{children}</main>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
