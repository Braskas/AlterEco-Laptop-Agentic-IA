import { Link } from "react-router";
import { Moon, Sun, RotateCcw, ChevronRight } from "lucide-react";
import { Button, Chip, Icon } from "../../components";
import { useTheme } from "../../context/ThemeContext";
import { resetDb } from "../../data/api";
import { allScreens, screenSections } from "../registry";
import styles from "./ScreenIndex.module.css";

/** /ecrans — sommaire de revue design : les 43 écrans Figma et leur avancement. */
export function ScreenIndex() {
  const { theme, toggleTheme } = useTheme();
  const done = allScreens.filter((s) => s.ready).length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className="title">Écrans Hooka</h1>
          <p className={`caption ${styles.muted}`}>
            {done} / {allScreens.length} développés · page Figma « 03 Écrans »
          </p>
        </div>
        <div className={styles.tools}>
          <Button
            variant="secondary"
            icon={theme === "light" ? Moon : Sun}
            onClick={toggleTheme}
          >
            {theme === "light" ? "Nuit" : "Jour"}
          </Button>
          <Button variant="secondary" icon={RotateCcw} onClick={() => resetDb()}>
            Réinitialiser
          </Button>
        </div>
      </header>

      <Link to="/composants" className={styles.row}>
        <span className="body-strong">Composants</span>
        <span className={`caption ${styles.muted}`}>page Figma « 02 Composants »</span>
        <Icon as={ChevronRight} />
      </Link>

      {screenSections.map((section) => (
        <section key={section.code} className={styles.section}>
          <h2 className="heading">
            {section.code} · {section.title}
          </h2>
          <ul className={styles.list}>
            {section.screens.map((screen) => (
              <li key={screen.path}>
                <Link to={screen.path} className={styles.row}>
                  <span className={`label ${styles.code}`}>{screen.code}</span>
                  <span className="body">{screen.title}</span>
                  <Chip variant={screen.ready ? "lilac" : "default"}>
                    {screen.ready ? "Prêt" : "À faire"}
                  </Chip>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
