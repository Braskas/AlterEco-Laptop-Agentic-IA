import { Link, useNavigate } from "react-router";
import { Moon, Sun, Play, ChevronRight } from "lucide-react";
import { Button, Chip, Icon } from "../../components";
import { useTheme } from "../../context/ThemeContext";
import { resetDb, type Scenario } from "../../data/api";
import { allScreens, screenSections, type ScreenEntry } from "../registry";
import styles from "./ScreenIndex.module.css";

const SCENARIO_LABEL: Record<Scenario, string> = {
  nouveau: "Nouveau",
  habitue: "Habitué",
  premier: "Premier gain",
};

/**
 * /ecrans — sommaire de revue design : les 43 écrans Figma.
 * Chaque ligne charge le scénario de démo de l'écran, puis ouvre l'état du parcours.
 */
export function ScreenIndex() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const done = allScreens.filter((s) => s.ready).length;

  function open(screen: ScreenEntry) {
    if (screen.scenario) resetDb(screen.scenario);
    navigate(screen.to ?? screen.path);
  }

  function startJourney() {
    resetDb("nouveau");
    navigate("/onboarding/bienvenue");
  }

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
          <Button variant="secondary" icon={theme === "light" ? Moon : Sun} onClick={toggleTheme}>
            {theme === "light" ? "Nuit" : "Jour"}
          </Button>
          <Button icon={Play} onClick={startJourney}>
            Parcours complet
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
                <button type="button" className={styles.row} onClick={() => open(screen)}>
                  <span className={`label ${styles.code}`}>{screen.code}</span>
                  <span className="body">{screen.title}</span>
                  <Chip variant={screen.ready ? "lilac" : "default"}>
                    {screen.scenario ? SCENARIO_LABEL[screen.scenario] : screen.ready ? "Prêt" : "À faire"}
                  </Chip>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
