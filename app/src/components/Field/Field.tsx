import { useId, type InputHTMLAttributes } from "react";
import { Mic, type LucideIcon } from "lucide-react";
import { Icon } from "../Icon";
import styles from "./Field.module.css";

/**
 * Figma : Hooka/Champ (7:20) — État = Vide | Rempli | Focus (gérés par le navigateur).
 * Surface, contour line 1,5 px, rayon radius-sm. Placeholder ink-soft. Focus : anneau 3 px.
 * Icône de fin optionnelle : micro = dictée (E4.4). Passe `endIcon={null}` pour la retirer.
 */
type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  /** Libellé lu par les lecteurs d'écran (visible si `showLabel`). */
  label: string;
  showLabel?: boolean;
  endIcon?: LucideIcon | null;
  onEndIconClick?: () => void;
  endIconLabel?: string;
};

export function Field({
  label,
  showLabel = false,
  endIcon = Mic,
  onEndIconClick,
  endIconLabel = "Dicter",
  className,
  id,
  ...inputProps
}: FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
      <label htmlFor={inputId} className={showLabel ? styles.label : styles.srOnly}>
        {label}
      </label>
      <div className={styles.field}>
        <input id={inputId} className={styles.input} {...inputProps} />
        {endIcon &&
          (onEndIconClick ? (
            <button type="button" className={styles.endButton} onClick={onEndIconClick} aria-label={endIconLabel}>
              <Icon as={endIcon} />
            </button>
          ) : (
            <Icon as={endIcon} />
          ))}
      </div>
    </div>
  );
}
