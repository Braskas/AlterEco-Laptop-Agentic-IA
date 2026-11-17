import type { ReactNode } from "react";
import { HomeIndicator, StatusBar } from "../../components";
import styles from "./PhoneFrame.module.css";

/**
 * Cadre d'écran 393 × 852 (taille des écrans Figma) :
 *   StatusBar · header (EnTête) · contenu défilant · footer (actions) · HomeIndicator
 *
 * Sur desktop : maquette centrée avec la barre d'état et l'indicateur d'accueil.
 * Sur mobile : plein écran, sans ces deux éléments (le système les dessine déjà).
 * Les feuilles (Sheet) et toasts se posent dans `overlay`, au-dessus du contenu.
 */
type PhoneFrameProps = {
  children: ReactNode;
  header?: ReactNode;
  /** Zone collée en bas (boutons d'action), au-dessus de l'indicateur d'accueil. */
  footer?: ReactNode;
  /** Feuille, toast… positionnés dans le cadre. */
  overlay?: ReactNode;
};

export function PhoneFrame({ children, header, footer, overlay }: PhoneFrameProps) {
  return (
    <div className={styles.stage}>
      <div className={styles.phone}>
        <StatusBar className={styles.deviceChrome} />
        {header && <div className={styles.header}>{header}</div>}
        <main className={styles.content}>{children}</main>
        {footer && <div className={styles.footer}>{footer}</div>}
        <HomeIndicator className={styles.deviceChrome} />
        {overlay}
      </div>
    </div>
  );
}
