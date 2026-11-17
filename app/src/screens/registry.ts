/**
 * Registre des écrans de la page Figma « 03 Écrans » (version Jour).
 * Généré depuis les nœuds Figma : chaque écran a une route et un lien vers son nœud.
 * `to` est la route du parcours qui affiche l'état ; `scenario` le jeu de données de démo.
 */

import type { Scenario } from "../data/api";

export const FIGMA_FILE_KEY = "dqwyZajOYnHHguWm7vteuW";

export type ScreenEntry = {
  /** « E5.1 » */
  code: string;
  title: string;
  path: string;
  figmaNodeId: string;
  ready: boolean;
  /** URL du parcours qui affiche cet état (avec ses paramètres `?vue=`…). */
  to?: string;
  /** Scénario de démo chargé avant d'ouvrir l'écran depuis /ecrans. */
  scenario?: Scenario;
};

export type ScreenSection = { code: string; title: string; screens: ScreenEntry[] };

export const screenSections: ScreenSection[] = [
  {
    code: "E1",
    title: "Onboarding",
    screens: [
      { code: "E1.1", title: "Bienvenue", path: "/e1-onboarding/e1-1-bienvenue", figmaNodeId: "10:3", ready: true, to: "/onboarding/bienvenue", scenario: "nouveau" },
      { code: "E1.2", title: "Domaines", path: "/e1-onboarding/e1-2-domaines", figmaNodeId: "10:48", ready: true, to: "/onboarding/domaines", scenario: "nouveau" },
      { code: "E1.2b", title: "Domaines · Me prévenir", path: "/e1-onboarding/e1-2b-domaines-me-prevenir", figmaNodeId: "10:139", ready: true, to: "/onboarding/domaines?vue=prevenu", scenario: "nouveau" },
      { code: "E1.3", title: "Budget", path: "/e1-onboarding/e1-3-budget", figmaNodeId: "10:224", ready: true, to: "/onboarding/budget", scenario: "nouveau" },
      { code: "E1.4", title: "Lieu", path: "/e1-onboarding/e1-4-lieu", figmaNodeId: "10:273", ready: true, to: "/onboarding/lieu", scenario: "nouveau" },
      { code: "E1.5", title: "Temps", path: "/e1-onboarding/e1-5-temps", figmaNodeId: "10:347", ready: true, to: "/onboarding/temps", scenario: "nouveau" },
      { code: "E1.6", title: "Autorisation · Caméra", path: "/e1-onboarding/e1-6-autorisation-camera", figmaNodeId: "10:395", ready: true, to: "/capture/scan", scenario: "nouveau" },
      { code: "E1.6", title: "Autorisation · Micro", path: "/e1-onboarding/e1-6-autorisation-micro", figmaNodeId: "10:443", ready: true, to: "/capture/voix", scenario: "nouveau" },
      { code: "E1.6", title: "Autorisation · Localisation", path: "/e1-onboarding/e1-6-autorisation-localisation", figmaNodeId: "10:491", ready: true, to: "/accueil?vue=detecter", scenario: "nouveau" },
    ],
  },
  {
    code: "E2",
    title: "Mini-bilan",
    screens: [
      { code: "E2.1", title: "Gestes", path: "/e2-mini-bilan/e2-1-gestes", figmaNodeId: "11:358", ready: true, to: "/mini-bilan", scenario: "nouveau" },
      { code: "E2.2", title: "Retour positif", path: "/e2-mini-bilan/e2-2-retour-positif", figmaNodeId: "11:429", ready: true, to: "/mini-bilan/bravo", scenario: "habitue" },
    ],
  },
  {
    code: "E3",
    title: "Accueil",
    screens: [
      { code: "E3.1", title: "Accueil", path: "/e3-accueil/e3-1-accueil", figmaNodeId: "11:477", ready: true, to: "/accueil", scenario: "habitue" },
      { code: "E3.2", title: "Lieu détecté", path: "/e3-accueil/e3-2-lieu-detecte", figmaNodeId: "11:608", ready: true, to: "/accueil?vue=lieu", scenario: "habitue" },
      { code: "E3.3", title: "Hors domaines", path: "/e3-accueil/e3-3-hors-domaines", figmaNodeId: "11:698", ready: true, to: "/accueil?q=Un%20billet%20de%20train%20pas%20cher", scenario: "habitue" },
      { code: "E3.4", title: "Autres domaines", path: "/e3-accueil/e3-4-autres-domaines", figmaNodeId: "11:768", ready: true, to: "/accueil?vue=domaines", scenario: "habitue" },
    ],
  },
  {
    code: "E4",
    title: "Capture",
    screens: [
      { code: "E4.1", title: "Scan produit", path: "/e4-capture/e4-1-scan-produit", figmaNodeId: "12:687", ready: true, to: "/capture/scan", scenario: "habitue" },
      { code: "E4.2", title: "Produit reconnu", path: "/e4-capture/e4-2-produit-reconnu", figmaNodeId: "12:717", ready: true, to: "/capture/produit/prod-yaourt-marque", scenario: "habitue" },
      { code: "E4.3", title: "Produit non reconnu", path: "/e4-capture/e4-3-produit-non-reconnu", figmaNodeId: "12:758", ready: true, to: "/capture/texte?inconnu=1&q=Yaourt%20nature", scenario: "habitue" },
      { code: "E4.4", title: "Demande voix", path: "/e4-capture/e4-4-demande-voix", figmaNodeId: "12:793", ready: true, to: "/capture/voix", scenario: "habitue" },
      { code: "E4.5", title: "Énergie choix", path: "/e4-capture/e4-5-energie-choix", figmaNodeId: "12:833", ready: true, to: "/capture/energie", scenario: "habitue" },
      { code: "E4.6", title: "Facture non lisible", path: "/e4-capture/e4-6-facture-non-lisible", figmaNodeId: "12:877", ready: true, to: "/capture/facture", scenario: "habitue" },
      { code: "E4.7", title: "Chargement", path: "/e4-capture/e4-7-chargement", figmaNodeId: "12:956", ready: true, to: "/carte?produit=prod-yaourt-marque&attente=1", scenario: "habitue" },
    ],
  },
  {
    code: "E5",
    title: "Carte",
    screens: [
      { code: "E5.1", title: "Carte · Alimentation", path: "/e5-carte/e5-1-carte-alimentation", figmaNodeId: "15:828", ready: true, to: "/carte?produit=prod-yaourt-marque", scenario: "habitue" },
      { code: "E5.2", title: "Carte · Seconde main", path: "/e5-carte/e5-2-carte-seconde-main", figmaNodeId: "15:960", ready: true, to: "/carte?produit=prod-perceuse-neuve", scenario: "habitue" },
      { code: "E5.3", title: "Carte · Énergie", path: "/e5-carte/e5-3-carte-energie", figmaNodeId: "15:1039", ready: true, to: "/carte?produit=prod-facture-energie", scenario: "habitue" },
      { code: "E5.4", title: "Carte · À revérifier", path: "/e5-carte/e5-4-carte-a-reverifier", figmaNodeId: "15:1118", ready: true, to: "/carte?produit=prod-veste-neuve", scenario: "habitue" },
      { code: "E5.5", title: "Aucune alternative", path: "/e5-carte/e5-5-aucune-alternative", figmaNodeId: "15:1206", ready: true, to: "/carte?produit=prod-chips", scenario: "habitue" },
      { code: "E5.6", title: "Pas aujourd’hui", path: "/e5-carte/e5-6-pas-aujourdhui", figmaNodeId: "15:1237", ready: true, to: "/carte?produit=prod-yaourt-marque&vue=passer", scenario: "habitue" },
      { code: "E5.7", title: "Source indisponible", path: "/e5-carte/e5-7-source-indisponible", figmaNodeId: "15:1365", ready: true, to: "/carte?produit=prod-cafe-capsules", scenario: "habitue" },
    ],
  },
  {
    code: "E6",
    title: "Pourquoi",
    screens: [
      { code: "E6.1", title: "Détail des sources", path: "/e6-pourquoi/e6-1-detail-des-sources", figmaNodeId: "16:1204", ready: true, to: "/carte?produit=prod-perceuse-neuve&vue=pourquoi", scenario: "habitue" },
      { code: "E6.2", title: "Signaler", path: "/e6-pourquoi/e6-2-signaler", figmaNodeId: "16:1264", ready: true, to: "/carte?produit=prod-perceuse-neuve&vue=signaler", scenario: "habitue" },
      { code: "E6.3", title: "Signalement envoyé", path: "/e6-pourquoi/e6-3-signalement-envoye", figmaNodeId: "16:1308", ready: true, to: "/carte?produit=prod-perceuse-neuve&vue=signale", scenario: "habitue" },
    ],
  },
  {
    code: "E7",
    title: "Action",
    screens: [
      { code: "E7.1", title: "Action · Lieu", path: "/e7-action/e7-1-action-lieu", figmaNodeId: "16:1361", ready: true, to: "/action/r-perceuse-reconditionnee", scenario: "habitue" },
      { code: "E7.2", title: "Action · Énergie", path: "/e7-action/e7-2-action-energie", figmaNodeId: "16:1417", ready: true, to: "/action/r-chauffage-17-nuit", scenario: "habitue" },
      { code: "E7.3", title: "Mis de côté", path: "/e7-action/e7-3-mis-de-cote", figmaNodeId: "16:1472", ready: true, to: "/action/r-perceuse-reconditionnee?vue=garde", scenario: "habitue" },
    ],
  },
  {
    code: "E8",
    title: "Confirmation",
    screens: [
      { code: "E8.1", title: "Confirmation", path: "/e8-confirmation/e8-1-confirmation", figmaNodeId: "16:1528", ready: true, to: "/confirmation/dec-perceuse", scenario: "habitue" },
      { code: "E8.2", title: "Premier gain", path: "/e8-confirmation/e8-2-premier-gain", figmaNodeId: "16:1572", ready: true, to: "/confirmation/dec-premier", scenario: "premier" },
    ],
  },
  {
    code: "E9",
    title: "Foyer",
    screens: [
      { code: "E9.1", title: "Mon foyer", path: "/e9-foyer/e9-1-mon-foyer", figmaNodeId: "17:1607", ready: true, to: "/foyer", scenario: "habitue" },
      { code: "E9.2", title: "Gestes déjà faits", path: "/e9-foyer/e9-2-gestes-deja-faits", figmaNodeId: "17:1741", ready: true, to: "/foyer/gestes", scenario: "habitue" },
      { code: "E9.3", title: "Réglages", path: "/e9-foyer/e9-3-reglages", figmaNodeId: "17:1812", ready: true, to: "/foyer/reglages", scenario: "habitue" },
      { code: "E9.4", title: "Autorisations", path: "/e9-foyer/e9-4-autorisations", figmaNodeId: "17:1896", ready: true, to: "/foyer/autorisations", scenario: "habitue" },
      { code: "E9.5", title: "Sources et méthode", path: "/e9-foyer/e9-5-sources-et-methode", figmaNodeId: "17:1969", ready: true, to: "/foyer/sources", scenario: "habitue" },
      { code: "E9.6", title: "Hors ligne", path: "/e9-foyer/e9-6-hors-ligne", figmaNodeId: "17:2034", ready: true, to: "/foyer?horsligne=1", scenario: "habitue" },
    ],
  },
];

export const allScreens: ScreenEntry[] = screenSections.flatMap((s) => s.screens);

export function figmaUrl(nodeId: string): string {
  return `https://www.figma.com/design/${FIGMA_FILE_KEY}/Hooka?node-id=${nodeId.replace(":", "-")}`;
}
