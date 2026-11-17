import { Link } from "react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Icon } from "../../components";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import { figmaUrl, type ScreenEntry } from "../registry";
import styles from "./Placeholder.module.css";

/** Écran pas encore développé : affiche son code et le lien vers son nœud Figma. */
export function Placeholder({ screen }: { screen: ScreenEntry }) {
  return (
    <PhoneFrame>
      <Link to="/ecrans" className={styles.back} aria-label="Retour aux écrans">
        <Icon as={ArrowLeft} />
      </Link>
      <div className={styles.body}>
        <p className={`label ${styles.code}`}>{screen.code}</p>
        <h1 className="title">{screen.title}</h1>
        <p className={`body ${styles.muted}`}>Écran à développer.</p>
        <a className={styles.link} href={figmaUrl(screen.figmaNodeId)} target="_blank" rel="noreferrer">
          Voir dans Figma <Icon as={ExternalLink} size={16} />
        </a>
      </div>
    </PhoneFrame>
  );
}
