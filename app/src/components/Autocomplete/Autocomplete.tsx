import { useId, useState, type KeyboardEvent } from "react";
import { MapPin, type LucideIcon } from "lucide-react";
import { Field } from "../Field";
import { Icon } from "../Icon";
import { cx } from "../../lib/cx";
import styles from "./Autocomplete.module.css";

/**
 * Champ avec suggestions (motif ARIA « combobox »), construit sur Hooka/Champ.
 * Pas de nœud Figma dédié : la liste reprend la surface, le filet et l'ombre lift-sm du DS.
 *
 *   <Autocomplete label="Ville" value={text} onChange={setText}
 *     options={[{ id, label, meta }]} onSelect={…} loading={…} />
 *
 * Clavier : ↓ ↑ pour parcourir, Entrée pour choisir, Échap pour fermer.
 */
export type AutocompleteOption = { id: string; label: string; meta?: string };

type AutocompleteProps = {
  label: string;
  showLabel?: boolean;
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
  options: AutocompleteOption[];
  onSelect: (option: AutocompleteOption) => void;
  loading?: boolean;
  /** Message sous le champ quand il n'y a pas de suggestion (aucun résultat, service indisponible). */
  hint?: string;
  optionIcon?: LucideIcon;
  autoComplete?: string;
};

export function Autocomplete({
  label,
  showLabel,
  placeholder,
  value,
  onChange,
  options,
  onSelect,
  loading,
  hint,
  optionIcon = MapPin,
  autoComplete = "off",
}: AutocompleteProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const expanded = open && options.length > 0;

  function choose(option: AutocompleteOption) {
    onSelect(option);
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" && options.length) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp" && options.length) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? options.length - 1 : i - 1));
    } else if (e.key === "Enter" && expanded && active >= 0) {
      e.preventDefault();
      choose(options[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <Field
        label={label}
        showLabel={showLabel}
        placeholder={placeholder}
        endIcon={null}
        value={value}
        autoComplete={autoComplete}
        role="combobox"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={expanded && active >= 0 ? `${listId}-${active}` : undefined}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />

      {expanded && (
        <ul id={listId} role="listbox" aria-label={label} className={styles.list}>
          {options.map((option, i) => (
            <li
              key={option.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={cx(styles.option, i === active && styles.active)}
              // mousedown plutôt que click : se déclenche avant le blur du champ
              onMouseDown={(e) => {
                e.preventDefault();
                choose(option);
              }}
              onMouseEnter={() => setActive(i)}
            >
              <Icon as={optionIcon} size={20} />
              <span className={styles.texts}>
                <span className={styles.label}>{option.label}</span>
                {option.meta && <span className={styles.meta}>{option.meta}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className={styles.hint} aria-live="polite">
        {loading ? "On cherche…" : hint}
      </p>
    </div>
  );
}
