import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowLeft, Bell, Camera, Clock, House, MapPin, ScanLine } from "lucide-react";
import {
  Banner,
  Button,
  Chip,
  DoubleBonus,
  EmptyState,
  Field,
  Handle,
  Header,
  HistoryRow,
  HomeIndicator,
  HookCard,
  Icon,
  ListRow,
  Loader,
  Logo,
  Notification,
  Option,
  PermissionSheet,
  Progress,
  SourceBadge,
  StatusBar,
  Toast,
  Toggle,
  TrustSheet,
  type ButtonVariant,
  type ChipVariant,
} from "../../components";
import { useTheme } from "../../context/ThemeContext";
import { catalog, read } from "../../data/db";
import type { Card, Certainty, Need } from "../../data/types";
import { recommend } from "../../engine/recommend";
import { DEMO_TODAY } from "../../lib/delay";
import styles from "./ComponentGallery.module.css";

const buttonVariants: { variant: ButtonVariant; figma: string }[] = [
  { variant: "primary", figma: "Principal" },
  { variant: "secondary", figma: "Secondaire" },
  { variant: "impact", figma: "Impact" },
  { variant: "link", figma: "Lien" },
];

const chipVariants: ChipVariant[] = ["default", "blush", "violet", "lilac", "rose"];
const certainties: Certainty[] = ["solide", "probable", "conteste", "a-reverifier"];

/** Les cartes de la galerie passent par le vrai moteur, sur la base fictive. */
function demoCard(need: Need): Card | null {
  const result = recommend({
    need,
    profile: read("profile"),
    userGestures: read("gestures"),
    catalog,
    today: DEMO_TODAY,
  });
  return result.status === "ok" ? result.card : null;
}

function Section({ title, figma, children }: { title: string; figma: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className="heading">{title}</h2>
      <p className={`caption ${styles.muted}`}>Figma : {figma}</p>
      <div className={styles.grid}>{children}</div>
    </section>
  );
}

function Line({ name, children, column }: { name: string; children: ReactNode; column?: boolean }) {
  return (
    <div className={column ? styles.column : styles.line}>
      <span className={`micro ${styles.muted} ${styles.name}`}>{name}</span>
      {children}
    </div>
  );
}

const noop = () => {};

/** /composants — chaque composant dans toutes ses variantes Figma, pour comparer. */
export function ComponentGallery() {
  const { theme, toggleTheme } = useTheme();
  const [budget, setBudget] = useState("equilibre");
  const [gestures, setGestures] = useState<string[]>(["vrac"]);
  const [toggleOn, setToggleOn] = useState(true);
  const [showToast, setShowToast] = useState(true);
  const [chipChoice, setChipChoice] = useState("alimentation");

  const yaourt = demoCard({ input: "scan", productId: "prod-yaourt-marque" });
  const veste = demoCard({ input: "scan", productId: "prod-veste-neuve" });

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

      <Section title="Logo" figma="Hooka/Logo · Type">
        <Line name="Wordmark">
          <Logo />
        </Line>
        <Line name="Cream">
          <span className={styles.inkTile}>
            <Logo tone="cream" />
          </span>
        </Line>
        <Line name="Symbole">
          <Logo type="symbol" />
        </Line>
      </Section>

      <Section title="Button" figma="Hooka/Button · Variante × Taille × État">
        {buttonVariants.map(({ variant, figma }) => (
          <Line key={variant} name={figma}>
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
          </Line>
        ))}
        <Line name="Avec icône">
          <Button icon={ScanLine} size="l">
            Scanner
          </Button>
        </Line>
      </Section>

      <Section title="Chip" figma="Hooka/Chip · Variante × Taille">
        <Line name="Compacte">
          {chipVariants.map((variant) => (
            <Chip key={variant} variant={variant}>
              Petit pas
            </Chip>
          ))}
        </Line>
        <Line name="Tactile">
          {chipVariants.map((variant) => (
            <Chip key={variant} variant={variant} size="touch">
              Petit pas
            </Chip>
          ))}
        </Line>
        <Line name="Choix">
          {["alimentation", "seconde-main", "energie"].map((id) => (
            <Chip key={id} selected={chipChoice === id} onClick={() => setChipChoice(id)}>
              {catalog.domains.find((d) => d.id === id)!.label}
            </Chip>
          ))}
        </Line>
        <Line name="En contexte">
          <Chip variant="blush">0,44 € dans ma poche</Chip>
          <Chip icon={Clock}>Sans détour</Chip>
          <Chip variant="violet">≈ 120 g de plastique évités</Chip>
        </Line>
      </Section>

      <Section title="Champ" figma="Hooka/Champ · État">
        <Line name="Vide / Focus" column>
          <Field label="Ta demande" placeholder="Une perceuse, ma facture…" onEndIconClick={noop} />
        </Line>
        <Line name="Rempli" column>
          <Field label="Ta demande" defaultValue="Une perceuse" />
        </Line>
      </Section>

      <Section title="Option" figma="Hooka/Option · Type × État">
        <Line name="Radio" column>
          {[
            { id: "serre", title: "Serré", help: "Chaque euro compte." },
            { id: "equilibre", title: "Équilibré", help: "Le juste prix, sans prise de tête." },
          ].map((o) => (
            <Option
              key={o.id}
              name="budget"
              title={o.title}
              help={o.help}
              checked={budget === o.id}
              onChange={() => setBudget(o.id)}
            />
          ))}
        </Line>
        <Line name="Case" column>
          {[
            { id: "vrac", title: "J’achète en vrac", help: "Alimentation" },
            { id: "bio", title: "Je prends du bio de saison", help: "Alimentation" },
          ].map((o) => (
            <Option
              key={o.id}
              type="checkbox"
              title={o.title}
              help={o.help}
              checked={gestures.includes(o.id)}
              onChange={(c) => setGestures((g) => (c ? [...g, o.id] : g.filter((x) => x !== o.id)))}
            />
          ))}
        </Line>
        <Line name="Verrouillé" column>
          <Option locked title="Déplacements" help="Bientôt dans Hooka." onNotify={noop} />
        </Line>
      </Section>

      <Section title="Toggle · Progression" figma="Hooka/Toggle · Hooka/Progression">
        <Line name="Toggle">
          <Toggle label="Démo" checked={toggleOn} onChange={setToggleOn} />
          <Toggle label="Démo inactif" checked={false} onChange={noop} />
        </Line>
        {[1, 2, 3, 4].map((step) => (
          <Line key={step} name={`Étape ${step}`} column>
            <Progress step={step} />
          </Line>
        ))}
      </Section>

      <Section title="EnTête · StatusBar · HomeIndicator · Poignée" figma="Hooka/EnTête, StatusBar…">
        <div className={styles.phoneStrip}>
          <StatusBar />
          <div className={styles.pad}>
            <Header title="Mon foyer" action={{ icon: House, label: "Accueil", onClick: noop }} />
          </div>
          <Handle />
          <HomeIndicator />
        </div>
      </Section>

      <Section title="PastilleSource" figma="Hooka/PastilleSource · Certitude">
        <Line name="Certitude">
          {certainties.map((c) => (
            <SourceBadge key={c} certainty={c} source="Open Food Facts · 12 nov." />
          ))}
        </Line>
      </Section>

      <Section title="HookCard" figma="Hooka/HookCard (données du moteur)">
        <div className={styles.cards}>
          {yaourt && <HookCard card={yaourt} onAccept={noop} onSkip={noop} onWhy={noop} />}
          {veste && <HookCard card={veste} onAccept={noop} onSkip={noop} onWhy={noop} />}
        </div>
      </Section>

      <Section title="DoubleBonus" figma="Hooka/DoubleBonus · État">
        <div className={styles.cards}>
          <DoubleBonus
            money={{ value: "142 €", detail: "dont 54 € sur ta perceuse" }}
            planet={{ value: "38 km", detail: "de voiture évités" }}
            nextStep="Vrac fait. Prochain : la gourde."
          />
          <DoubleBonus
            money={{ value: "142 €", detail: "dont 54 € sur ta perceuse" }}
            planet={null}
            nextStep="Vrac fait. Prochain : la gourde."
          />
        </div>
      </Section>

      <Section title="Bandeau · Toast · Notification" figma="Hooka/Bandeau, Toast, Notification">
        <div className={styles.cards}>
          <div className={styles.stack}>
            <Banner type="attention">Hors ligne. Tes gains restent visibles.</Banner>
            <Banner>Hors ligne. Tes gains restent visibles.</Banner>
          </div>
          <div className={styles.stack}>
            {showToast ? (
              <Toast onDone={() => setShowToast(false)}>Aucune pénalité. On retient ta préférence.</Toast>
            ) : (
              <Button variant="secondary" icon={Bell} onClick={() => setShowToast(true)}>
                Revoir le toast
              </Button>
            )}
            <Notification title="Un Hook ici" body="Tu es au marché. 30 secondes pour une idée ?" time="12:04" />
          </div>
        </div>
      </Section>

      <Section title="Chargement · ÉtatVide" figma="Hooka/Chargement, Hooka/ÉtatVide">
        <div className={styles.cards}>
          <Loader />
          <EmptyState
            title="Oups, on a perdu le fil."
            message="On réessaie ? Tes gains restent visibles."
            action={{ label: "Réessayer", onClick: noop }}
          />
        </div>
      </Section>

      <Section title="LigneListe · LigneHistorique" figma="Hooka/LigneListe, Hooka/LigneHistorique">
        <div className={styles.cards}>
          <div>
            <ListRow icon={MapPin} label="Lieu" value="Lyon 7e" onClick={noop} />
            <ListRow icon={Camera} label="Caméra" toggle={{ checked: toggleOn, onChange: setToggleOn }} />
          </div>
          <div>
            <HistoryRow title="Perceuse reconditionnée" meta="14 nov. · Seconde main" gain="54 €" />
            <HistoryRow title="Yaourt nature vrac 500 g" meta="12 nov. · Alimentation" gain="0,44 €" />
          </div>
        </div>
      </Section>

      <Section title="TrustSheet · FeuillePermission" figma="Hooka/TrustSheet, Hooka/FeuillePermission">
        <div className={styles.cards}>
          <TrustSheet
            inline
            criteria="Budget équilibré · à moins d’1 km · quelques minutes"
            sources={[
              {
                name: "Annonce de la ressourcerie",
                url: "https://example.org/annonces/perceuse-123",
                certainty: "probable",
                dateLabel: "Vérifiée le 4 nov. 2026",
              },
              {
                name: "Prix neuf moyen, 3 enseignes",
                url: "https://example.org/prix-neuf",
                certainty: "solide",
                dateLabel: "Relevé le 28 oct. 2026",
              },
            ]}
            method="Gain = prix neuf moyen moins prix affiché. Impact = fabrication évitée, base ADEME."
            uncertainties="Estimation prudente, à plus ou moins 15 %. L’état réel se vérifie sur place."
            updatedAt="4 novembre 2026"
            onReport={noop}
            onClose={noop}
          />
          <div className={styles.stack}>
            <PermissionSheet inline type="camera" onAllow={noop} onDecline={noop} />
            <PermissionSheet inline type="micro" onAllow={noop} onDecline={noop} />
            <PermissionSheet inline type="localisation" onAllow={noop} onDecline={noop} />
          </div>
        </div>
      </Section>
    </div>
  );
}
