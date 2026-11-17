import type { LucideIcon } from "lucide-react";
import { Icon } from "../Icon";
import { cx } from "../../lib/cx";
import styles from "./Chip.module.css";

/**
 * Figma : Hooka/Chip (6:108)
 *   Variante = Défaut | Blush | Violet | Lilac | Rose → variant
 *   Taille   = Compacte | Tactile                     → size
 *
 * Blush = gain en euros, Violet = impact (une seule équivalence), Lilac = petit pas,
 * Défaut = info neutre. Une pastille cliquable est toujours « touch » (48 px).
 * Avec onClick (ou selected), la pastille devient un <button>.
 */
export type ChipVariant = "default" | "blush" | "violet" | "lilac" | "rose";
export type ChipSize = "compact" | "touch";

type ChipProps = {
  children: string;
  variant?: ChipVariant;
  size?: ChipSize;
  icon?: LucideIcon;
  onClick?: () => void;
  /** Pastille de choix (onboarding) : état sélectionné annoncé aux lecteurs d'écran. */
  selected?: boolean;
  className?: string;
};

export function Chip({
  children,
  variant = "default",
  size,
  icon,
  onClick,
  selected,
  className,
}: ChipProps) {
  const interactive = onClick !== undefined || selected !== undefined;
  // Une pastille cliquable est forcément tactile (règle DS) ; sinon compacte par défaut.
  const resolvedSize: ChipSize = interactive ? "touch" : (size ?? "compact");
  const classes = cx(styles.chip, styles[variant], styles[resolvedSize], className);
  const content = (
    <>
      {icon && <Icon as={icon} size={16} />}
      <span>{children}</span>
    </>
  );

  if (interactive) {
    return (
      <button type="button" className={classes} onClick={onClick} aria-pressed={selected}>
        {content}
      </button>
    );
  }
  return <span className={classes}>{content}</span>;
}
