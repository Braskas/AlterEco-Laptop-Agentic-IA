import { CircleAlert, Info } from "lucide-react";
import { Icon } from "../Icon";
import { cx } from "../../lib/cx";
import styles from "./Banner.module.css";

/**
 * Figma : Hooka/Bandeau (9:130) — Type = Attention | Info.
 * Attention : ink sur blush, un mot clair + icône (jamais de rouge). Info : surface.
 *   <Banner type="attention">Hors ligne. Tes gains restent visibles.</Banner>
 */
type BannerProps = {
  type?: "attention" | "info";
  children: string;
};

export function Banner({ type = "info", children }: BannerProps) {
  return (
    <div className={cx(styles.banner, styles[type])} role={type === "attention" ? "status" : undefined}>
      <Icon as={type === "attention" ? CircleAlert : Info} />
      <p className={styles.message}>{children}</p>
    </div>
  );
}
