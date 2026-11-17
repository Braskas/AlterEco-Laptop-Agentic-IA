import type { LucideIcon, LucideProps } from "lucide-react";

/**
 * Icône Hooka (Figma : Hooka/Icône/*). Les icônes Figma sont des Lucide :
 * on passe directement le composant Lucide, au trait de 2 px, couleur héritée.
 *   <Icon as={ScanLine} />
 */
type IconProps = Omit<LucideProps, "ref"> & {
  as: LucideIcon;
  size?: 16 | 20 | 24;
  /** Libellé lu par les lecteurs d'écran. Sans label, l'icône est décorative. */
  label?: string;
};

export function Icon({ as: Component, size = 24, label, ...rest }: IconProps) {
  return (
    <Component
      size={size}
      strokeWidth={2}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable={false}
      {...rest}
    />
  );
}
