import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

/**
 * Connexion réseau. `?horsligne=1` force le mode hors ligne pour la démo (E9.6).
 */
export function useOnline(): boolean {
  const [params] = useSearchParams();
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  return online && params.get("horsligne") !== "1";
}
