import { Chip } from "../Chip";
import styles from "./DoubleBonus.module.css";

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
          <span className={styles.figure}>{money.value}</span>
          <span className={styles.detail}>{money.detail}</span>
        </div>
        <div className={`${styles.tile} ${styles.planet}`}>
          <span className={styles.label}>Pour la planète</span>
          {planet ? (
            <>
              <span className={`${styles.figure} ${styles.violet}`}>{planet.value}</span>
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
