import { ChevronRight, type LucideIcon } from "lucide-react";
import { Icon } from "../Icon";
import { Toggle } from "../Toggle";
import styles from "./ListRow.module.css";

/**
 * Figma : Hooka/LigneListe (9:177) — Fin = Chevron | Toggle.
 * Ligne de réglage de 56 px : icône, libellé, valeur actuelle, chevron ou interrupteur.
 *   <ListRow icon={MapPin} label="Lieu" value="Lyon 7e" onClick={…} />
 *   <ListRow icon={Camera} label="Caméra" toggle={{ checked, onChange }} />
 * Avec un interrupteur, la valeur commence par « Activé » / « Coupé » (un mot en plus de la couleur),
 * suivi de `value` : « Activée · pour scanner ».
 */
type ListRowProps = {
  icon: LucideIcon;
  label: string;
  value?: string;
  onClick?: () => void;
  toggle?: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    /** Mot d'état accordé, par défaut « Activé » / « Coupé » (« Activée », « Coupées »…). */
    labels?: { on: string; off: string };
  };
};

export function ListRow({ icon, label, value, onClick, toggle }: ListRowProps) {
  const stateWord = toggle && (toggle.checked ? (toggle.labels?.on ?? "Activé") : (toggle.labels?.off ?? "Coupé"));
  const shownValue = stateWord ? [stateWord, value].filter(Boolean).join(" · ") : value;
  const texts = (
    <span className={styles.texts}>
      <span className={styles.label}>{label}</span>
      {shownValue && <span className={styles.value}>{shownValue}</span>}
    </span>
  );

  if (toggle) {
    return (
      <div className={styles.row}>
        <Icon as={icon} />
        {texts}
        <Toggle label={label} checked={toggle.checked} onChange={toggle.onChange} />
      </div>
    );
  }

  return (
    <button type="button" className={styles.row} onClick={onClick}>
      <Icon as={icon} />
      {texts}
      <Icon as={ChevronRight} className={styles.chevron} />
    </button>
  );
}
