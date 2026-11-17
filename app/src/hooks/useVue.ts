import { useCallback } from "react";
import { useSearchParams } from "react-router";

/**
 * État d'écran porté par l'URL : `?vue=pourquoi`, `?vue=passer`…
 * Permet d'ouvrir directement un état Figma (E5.6, E6.1…) depuis /ecrans,
 * et de garder le bouton « retour » du navigateur cohérent.
 */
export function useVue<T extends string>(): [T | null, (vue: T | null) => void] {
  const [params, setParams] = useSearchParams();
  const vue = params.get("vue") as T | null;

  const setVue = useCallback(
    (next: T | null) => {
      setParams(
        (current) => {
          const p = new URLSearchParams(current);
          if (next) p.set("vue", next);
          else p.delete("vue");
          return p;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  return [vue, setVue];
}
