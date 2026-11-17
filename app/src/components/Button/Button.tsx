import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "../Icon";
import { cx } from "../../lib/cx";
import styles from "./Button.module.css";

/**
 * Figma : Hooka/Button (6:82)
 *   Variante = Principal | Secondaire | Impact | Lien  → variant
 *   Taille   = M | L                                 → size
 *   État     = Défaut | Désactivé                    → disabled
 *
 * Règle DS : un seul bouton « primary » (rose) par écran. Libellé de 1 à 3 mots,
 * verbe d'action en premier. Désactivé : explique la raison à côté.
 */
export type ButtonVariant = "primary" | "secondary" | "impact" | "link";
export type ButtonSize = "m" | "l";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  /** Prend toute la largeur du conteneur (bas d'écran). */
  block?: boolean;
};

export function Button({
  children,
  variant = "primary",
  size = "m",
  icon,
  block = false,
  disabled,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cx(styles.button, styles[variant], styles[size], block && styles.block, className)}
      {...rest}
    >
      {icon && <Icon as={icon} size={24} />}
      <span>{children}</span>
    </button>
  );
}
