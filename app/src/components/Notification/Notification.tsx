import { Logo } from "../Logo";
import styles from "./Notification.module.css";

/**
 * Figma : Hooka/Notification (9:104) — aperçu de notification système.
 * Titre de 3 mots, corps de 12 mots, une par jour, aucun emoji.
 */
type NotificationProps = {
  title: string;
  body: string;
  time: string;
  onClick?: () => void;
};

export function Notification({ title, body, time, onClick }: NotificationProps) {
  const content = (
    <>
      <Logo type="symbol" width={44} />
      <span className={styles.content}>
        <span className={styles.top}>
          <span className={styles.title}>{title}</span>
          <span className={styles.time}>{time}</span>
        </span>
        <span className={styles.body}>{body}</span>
      </span>
    </>
  );

  return onClick ? (
    <button type="button" className={styles.notification} onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className={styles.notification}>{content}</div>
  );
}
