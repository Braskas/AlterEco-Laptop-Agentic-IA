import { useId } from "react";
import { Camera, MapPin, Mic, type LucideIcon } from "lucide-react";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Sheet } from "../Sheet";
import styles from "./PermissionSheet.module.css";

/**
 * Figma : Hooka/FeuillePermission (9:249) — Type = Caméra | Micro | Localisation.
 * Pré-autorisation demandée au moment où la fonction sert, avec une phrase d'explication.
 * Le choix manuel reste toujours possible (« Pas maintenant »).
 */
export type PermissionType = "camera" | "micro" | "localisation";

const CONTENT: Record<PermissionType, { icon: LucideIcon; title: string; text: string }> = {
  camera: { icon: Camera, title: "Lire le produit", text: "Pour lire le code-barres. La photo n’est pas gardée." },
  micro: { icon: Mic, title: "T’écouter", text: "Pour dicter ta demande. L’audio n’est pas gardé." },
  localisation: {
    icon: MapPin,
    title: "Savoir où tu es",
    text: "Pour proposer le bon domaine. Rien n’est suivi en continu.",
  },
};

type PermissionSheetProps = {
  type: PermissionType;
  onAllow: () => void;
  onDecline: () => void;
  inline?: boolean;
};

export function PermissionSheet({ type, onAllow, onDecline, inline }: PermissionSheetProps) {
  const titleId = useId();
  const { icon, title, text } = CONTENT[type];

  return (
    <Sheet onClose={onDecline} inline={inline} labelledBy={titleId}>
      <span className={styles.picto}>
        <Icon as={icon} />
      </span>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      <p className={styles.text}>{text}</p>
      <Button block onClick={onAllow}>
        Autoriser
      </Button>
      <Button variant="secondary" block onClick={onDecline}>
        Pas maintenant
      </Button>
    </Sheet>
  );
}
