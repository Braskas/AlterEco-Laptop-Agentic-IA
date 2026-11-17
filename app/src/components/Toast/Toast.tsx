import { useEffect } from "react";
import { CircleCheck } from "lucide-react";
import { Icon } from "../Icon";
import styles from "./Toast.module.css";

/**
 * Figma : Hooka/Toast (9:131) — retour éphémère, sobre et factuel.
 *   {toast && <Toast onDone={() => setToast(null)}>{toast}</Toast>}
 */
type ToastProps = {
  children: string;
  /** Appelé après `duration` ms : le parent retire le toast. */
  onDone?: () => void;
  duration?: number;
};

export function Toast({ children, onDone, duration = 3500 }: ToastProps) {
  useEffect(() => {
    if (!onDone) return;
    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer);
  }, [onDone, duration]);

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <Icon as={CircleCheck} />
      <p className={styles.message}>{children}</p>
    </div>
  );
}
