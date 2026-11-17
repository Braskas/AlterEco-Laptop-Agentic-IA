import { useEffect, type ReactNode } from "react";
import { Handle } from "../Handle";
import styles from "./Sheet.module.css";

/**
 * Feuille qui monte du bas (base commune de TrustSheet et PermissionSheet).
 * Figma : surface, coins hauts radius-lg, ombre lift, poignée, marge 16 px, bas 34 px.
 *
 * - `inline` : affichée en place, sans voile (galerie, captures).
 * - sinon : posée en bas du cadre téléphone, voile derrière, Échap ou clic sur le voile ferme.
 */
type SheetProps = {
  children: ReactNode;
  onClose?: () => void;
  inline?: boolean;
  /** Nom accessible de la feuille (id du titre). */
  labelledBy?: string;
};

export function Sheet({ children, onClose, inline = false, labelledBy }: SheetProps) {
  useEffect(() => {
    if (inline || !onClose) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inline, onClose]);

  const sheet = (
    <div
      className={styles.sheet}
      role={inline ? undefined : "dialog"}
      aria-modal={inline ? undefined : true}
      aria-labelledby={labelledBy}
    >
      <Handle />
      {children}
    </div>
  );

  if (inline) return sheet;

  return (
    <div className={styles.overlay}>
      <button type="button" className={styles.scrim} aria-label="Fermer" onClick={onClose} tabIndex={-1} />
      {sheet}
    </div>
  );
}
