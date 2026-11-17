import { useTheme } from "../../context/ThemeContext";
import wordmarkInk from "../../assets/logo/hooka-wordmark-ink.svg";
import wordmarkCream from "../../assets/logo/hooka-wordmark-cream.svg";
import symbol from "../../assets/logo/hooka-symbol.svg";
import styles from "./Logo.module.css";

/**
 * Figma : Hooka/Logo (5:214) — Type = Wordmark ink | Wordmark cream | Symbole.
 * SVG exportés tels quels depuis Figma (couleurs fixes de marque).
 *
 * `type="wordmark"` choisit seul la couleur : ink en Jour, cream en Nuit (sur bg).
 * Force `tone` sur un fond particulier (cream sur ink ou violet le jour).
 * Le symbole ne se pose jamais sur un fond rose.
 */
type LogoProps = {
  type?: "wordmark" | "symbol";
  tone?: "auto" | "ink" | "cream";
  /** Largeur en px. Minimum DS : 72 (wordmark), 24 (symbole). */
  width?: number;
  className?: string;
};

export function Logo({ type = "wordmark", tone = "auto", width, className }: LogoProps) {
  const { theme } = useTheme();

  if (type === "symbol") {
    const size = Math.max(width ?? 44, 24);
    return <img src={symbol} alt="Hooka" width={size} height={size} className={className} />;
  }

  const resolvedTone = tone === "auto" ? (theme === "dark" ? "cream" : "ink") : tone;
  const w = Math.max(width ?? 120, 72);
  return (
    <img
      src={resolvedTone === "cream" ? wordmarkCream : wordmarkInk}
      alt="Hooka"
      width={w}
      height={Math.round((w * 33) / 120)}
      className={[styles.wordmark, className].filter(Boolean).join(" ")}
    />
  );
}
