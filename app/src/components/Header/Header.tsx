import { useNavigate } from "react-router";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { Icon } from "../Icon";
import styles from "./Header.module.css";

/**
 * Figma : Hooka/EnTête (7:95) — retour 48 px, titre `heading`, action à droite.
 *   <Header title="Mon foyer" action={{ icon: House, label: "Accueil", onClick }} />
 * Sans `onBack`, le retour revient à la page précédente.
 */
type HeaderProps = {
  title?: string;
  back?: boolean;
  onBack?: () => void;
  action?: { icon: LucideIcon; label: string; onClick: () => void };
};

export function Header({ title, back = true, onBack, action }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      {back && (
        <button
          type="button"
          className={styles.iconButton}
          onClick={onBack ?? (() => navigate(-1))}
          aria-label="Retour"
        >
          <Icon as={ArrowLeft} />
        </button>
      )}
      {title ? <h1 className={styles.title}>{title}</h1> : <span className={styles.spacer} />}
      {action && (
        <button type="button" className={styles.iconButton} onClick={action.onClick} aria-label={action.label}>
          <Icon as={action.icon} />
        </button>
      )}
    </header>
  );
}
