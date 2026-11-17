import { Button } from "../Button";
import styles from "./EmptyState.module.css";

/**
 * Figma : Hooka/ÉtatVide (9:146) — état vide ou problème technique. Jamais « erreur ».
 *   <EmptyState title="Rien de fiable ici pour l'instant." message="…" action={{ label: "Autre recherche", onClick }} />
 */
type EmptyStateProps = {
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
};

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      {action && (
        <Button variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </section>
  );
}
