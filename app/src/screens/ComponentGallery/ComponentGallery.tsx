import { Link } from "react-router";
import { ArrowLeft, Clock, ScanLine } from "lucide-react";
import { Button, Chip, Icon, type ButtonVariant, type ChipVariant } from "../../components";
import { useTheme } from "../../context/ThemeContext";
import styles from "./ComponentGallery.module.css";

const buttonVariants: { variant: ButtonVariant; figma: string }[] = [
  { variant: "primary", figma: "Principal" },
  { variant: "secondary", figma: "Secondaire" },
  { variant: "impact", figma: "Impact" },
  { variant: "link", figma: "Lien" },
];

const chipVariants: ChipVariant[] = ["default", "blush", "violet", "lilac", "rose"];

/** /composants — chaque composant dans toutes ses variantes Figma, pour comparer. */
export function ComponentGallery() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/ecrans" className={styles.back} aria-label="Retour aux écrans">
          <Icon as={ArrowLeft} />
        </Link>
        <h1 className="title">Composants</h1>
        <Button variant="link" onClick={toggleTheme}>
          {theme === "light" ? "Voir en Nuit" : "Voir en Jour"}
        </Button>
      </header>

      <section className={styles.section}>
        <h2 className="heading">Button</h2>
        <p className={`caption ${styles.muted}`}>Figma : Hooka/Button · Variante × Taille × État</p>
        <div className={styles.grid}>
          {buttonVariants.map(({ variant, figma }) => (
            <div key={variant} className={styles.line}>
              <span className={`micro ${styles.muted} ${styles.name}`}>{figma}</span>
              <Button variant={variant}>Je fonce</Button>
              <Button variant={variant} disabled>
                Je fonce
              </Button>
              <Button variant={variant} size="l">
                Je fonce
              </Button>
              <Button variant={variant} size="l" disabled>
                Je fonce
              </Button>
            </div>
          ))}
          <div className={styles.line}>
            <span className={`micro ${styles.muted} ${styles.name}`}>Avec icône</span>
            <Button icon={ScanLine} size="l">
              Scanner
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className="heading">Chip</h2>
        <p className={`caption ${styles.muted}`}>Figma : Hooka/Chip · Variante × Taille</p>
        <div className={styles.grid}>
          <div className={styles.line}>
            <span className={`micro ${styles.muted} ${styles.name}`}>Compacte</span>
            {chipVariants.map((variant) => (
              <Chip key={variant} variant={variant}>
                Petit pas
              </Chip>
            ))}
          </div>
          <div className={styles.line}>
            <span className={`micro ${styles.muted} ${styles.name}`}>Tactile</span>
            {chipVariants.map((variant) => (
              <Chip key={variant} variant={variant} size="touch">
                Petit pas
              </Chip>
            ))}
          </div>
          <div className={styles.line}>
            <span className={`micro ${styles.muted} ${styles.name}`}>En contexte</span>
            <Chip variant="blush">0,44 € dans ma poche</Chip>
            <Chip icon={Clock}>Sans détour</Chip>
            <Chip variant="violet">≈ 120 g de plastique évités</Chip>
          </div>
        </div>
      </section>
    </div>
  );
}
