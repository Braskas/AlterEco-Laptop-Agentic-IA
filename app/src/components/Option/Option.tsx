import { Check, Lock } from "lucide-react";
import { Icon } from "../Icon";
import { cx } from "../../lib/cx";
import styles from "./Option.module.css";

/**
 * Figma : Hooka/Option (7:73)
 *   Type = Radio | Case                    → type ("radio" : un seul choix, "checkbox" : plusieurs)
 *   État = Non choisi | Choisi | Verrouillé → checked / locked
 *
 * Radio : choix d'onboarding (budget, temps). Case : gestes du mini-bilan (E2.1).
 * Verrouillé : domaine « bientôt », avec cadenas et bouton « Me prévenir » (E1.2b).
 */
type OptionProps = {
  type?: "radio" | "checkbox";
  title: string;
  help?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  /** Domaine verrouillé : non cochable, affiche « Me prévenir ». */
  locked?: boolean;
  onNotify?: () => void;
  /** Regroupe les radios entre elles. */
  name?: string;
};

export function Option({
  type = "radio",
  title,
  help,
  checked = false,
  onChange,
  locked = false,
  onNotify,
  name,
}: OptionProps) {
  const indicatorClass = cx(styles.indicator, type === "radio" ? styles.round : styles.square);

  if (locked) {
    return (
      <div className={cx(styles.option, styles.locked)}>
        <span className={styles.lockIcon}>
          <Icon as={Lock} />
        </span>
        <span className={styles.texts}>
          <span className={styles.title}>{title}</span>
          {help && <span className={styles.help}>{help}</span>}
        </span>
        <button type="button" className={styles.notify} onClick={onNotify}>
          Me prévenir
        </button>
      </div>
    );
  }

  return (
    <label className={cx(styles.option, checked && styles.checked)}>
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className={styles.native}
      />
      <span className={indicatorClass} aria-hidden="true">
        {checked && <Icon as={Check} size={16} strokeWidth={3} />}
      </span>
      <span className={styles.texts}>
        <span className={styles.title}>{title}</span>
        {help && <span className={styles.help}>{help}</span>}
      </span>
    </label>
  );
}
