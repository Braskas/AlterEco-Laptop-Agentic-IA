import { useLayoutEffect, useRef } from "react";
import { Chip } from "../Chip";
import { cx } from "../../lib/cx";
import styles from "./DoubleBonus.module.css";

/**
 * Chiffre en 44 px (DS `figure`) qui rétrécit seulement s'il ne tient pas dans sa tuile
 * (« 129 km », « 1 240 € »…), au lieu de déborder.
 */
function Figure({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = "";
      if (el.scrollWidth > el.clientWidth) {
        const size = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = `${Math.floor((size * el.clientWidth) / el.scrollWidth)}px`;
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);
  return (
    <span ref={ref} className={cx(styles.figure, className)}>
      {children}
    </span>
  );
}

/**
 * Figma : Hooka/DoubleBonus (8:162) — État = Valeurs | Planète à zéro.
 * Tuile « Dans ma poche » (blush) + « Pour la planète » (brume, chiffre violet).
 * Une équivalence par tuile. Valeur nulle côté planète = « À toi de jouer ». Jamais de score.
 */
type DoubleBonusProps = {
  money: { value: string; detail: string };
  /** `null` = rien encore côté planète → « À toi de jouer ». */
  planet: { value: string; detail: string } | null;
  /** Ligne « Petit pas » (lilac) : le prochain geste. */
  nextStep?: string;
};

export function DoubleBonus({ money, planet, nextStep }: DoubleBonusProps) {
  return (
    <section className={styles.bonus}>
      <div className={styles.tiles}>
        <div className={`${styles.tile} ${styles.money}`}>
          <span className={styles.label}>Dans ma poche</span>
          <Figure>{money.value}</Figure>
          <span className={styles.detail}>{money.detail}</span>
        </div>
        <div className={`${styles.tile} ${styles.planet}`}>
          <span className={styles.label}>Pour la planète</span>
          {planet ? (
            <>
              <Figure className={styles.violet}>{planet.value}</Figure>
              <span className={styles.detail}>{planet.detail}</span>
            </>
          ) : (
            <>
              <span className={`${styles.empty} ${styles.violet}`}>À toi de jouer</span>
              <span className={styles.detail}>Ton premier impact arrive.</span>
            </>
          )}
        </div>
      </div>
      {nextStep && (
        <p className={styles.step}>
          <Chip variant="lilac">Petit pas</Chip>
          <span>{nextStep}</span>
        </p>
      )}
    </section>
  );
}
