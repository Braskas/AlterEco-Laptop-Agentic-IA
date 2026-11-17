import { CircleAlert, CircleDot, Scale, ShieldCheck, type LucideIcon } from "lucide-react";
import type { Certainty } from "../../data/types";
import { Icon } from "../Icon";
import { cx } from "../../lib/cx";
import styles from "./SourceBadge.module.css";

/**
 * Figma : Hooka/PastilleSource (8:51) — Certitude = Solide | Probable | Contesté | À revérifier.
 * Niveau de certitude (mot + icône), puis source et date.
 * « À revérifier » (plus de 6 mois) : ink sur blush.
 *   <SourceBadge certainty="solide" source="Prix relevé · 12 nov." />
 */
const CERTAINTY: Record<Certainty, { label: string; icon: LucideIcon }> = {
  solide: { label: "Solide", icon: ShieldCheck },
  probable: { label: "Probable", icon: CircleDot },
  conteste: { label: "Contesté", icon: Scale },
  "a-reverifier": { label: "À revérifier", icon: CircleAlert },
};

type SourceBadgeProps = {
  certainty: Certainty;
  source: string;
};

export function SourceBadge({ certainty, source }: SourceBadgeProps) {
  const { label, icon } = CERTAINTY[certainty];
  return (
    <span className={cx(styles.badge, certainty === "a-reverifier" && styles.stale)}>
      <Icon as={icon} size={16} />
      <span className={styles.level}>{label}</span>
      <span className={styles.source}>{source}</span>
    </span>
  );
}
