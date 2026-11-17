import styles from "./Toggle.module.css";

/**
 * Figma : Hooka/Toggle (9:158) — État = Actif | Inactif.
 * Piste ink quand actif (jamais rose : réservé au bouton principal).
 * Toujours accompagné du mot « Activé » / « Coupé » dans la ligne (cf. ListRow).
 */
type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
};

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={styles.toggle}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.knob} />
    </button>
  );
}
