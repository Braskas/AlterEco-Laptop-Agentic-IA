/**
 * Registre des écrans de la page Figma « 03 Écrans » (version Jour).
 * Généré depuis les nœuds Figma : chaque écran a une route et un lien vers son nœud.
 * Passe `ready: true` quand l'écran est développé et branche-le dans routes.tsx.
 */

export const FIGMA_FILE_KEY = "dqwyZajOYnHHguWm7vteuW";

export type ScreenEntry = {
  /** « E5.1 » */
  code: string;
  title: string;
  path: string;
  figmaNodeId: string;
  ready: boolean;
};

export type ScreenSection = { code: string; title: string; screens: ScreenEntry[] };

export const screenSections: ScreenSection[] = [
  {
    code: "E1",
    title: "Onboarding",
    screens: [
      { code: "E1.1", title: "Bienvenue", path: "/e1-onboarding/e1-1-bienvenue", figmaNodeId: "10:3", ready: false },
      { code: "E1.2", title: "Domaines", path: "/e1-onboarding/e1-2-domaines", figmaNodeId: "10:48", ready: false },
      { code: "E1.2b", title: "Domaines · Me prévenir", path: "/e1-onboarding/e1-2b-domaines-me-prevenir", figmaNodeId: "10:139", ready: false },
      { code: "E1.3", title: "Budget", path: "/e1-onboarding/e1-3-budget", figmaNodeId: "10:224", ready: false },
      { code: "E1.4", title: "Lieu", path: "/e1-onboarding/e1-4-lieu", figmaNodeId: "10:273", ready: false },
      { code: "E1.5", title: "Temps", path: "/e1-onboarding/e1-5-temps", figmaNodeId: "10:347", ready: false },
      { code: "E1.6", title: "Autorisation · Caméra", path: "/e1-onboarding/e1-6-autorisation-camera", figmaNodeId: "10:395", ready: false },
      { code: "E1.6", title: "Autorisation · Micro", path: "/e1-onboarding/e1-6-autorisation-micro", figmaNodeId: "10:443", ready: false },
      { code: "E1.6", title: "Autorisation · Localisation", path: "/e1-onboarding/e1-6-autorisation-localisation", figmaNodeId: "10:491", ready: false },
    ],
  },
  {
    code: "E2",
    title: "Mini-bilan",
    screens: [
      { code: "E2.1", title: "Gestes", path: "/e2-mini-bilan/e2-1-gestes", figmaNodeId: "11:358", ready: false },
      { code: "E2.2", title: "Retour positif", path: "/e2-mini-bilan/e2-2-retour-positif", figmaNodeId: "11:429", ready: false },
    ],
  },
  {
    code: "E3",
    title: "Accueil",
    screens: [
      { code: "E3.1", title: "Accueil", path: "/e3-accueil/e3-1-accueil", figmaNodeId: "11:477", ready: false },
      { code: "E3.2", title: "Lieu détecté", path: "/e3-accueil/e3-2-lieu-detecte", figmaNodeId: "11:608", ready: false },
      { code: "E3.3", title: "Hors domaines", path: "/e3-accueil/e3-3-hors-domaines", figmaNodeId: "11:698", ready: false },
      { code: "E3.4", title: "Autres domaines", path: "/e3-accueil/e3-4-autres-domaines", figmaNodeId: "11:768", ready: false },
    ],
  },
  {
    code: "E4",
    title: "Capture",
    screens: [
      { code: "E4.1", title: "Scan produit", path: "/e4-capture/e4-1-scan-produit", figmaNodeId: "12:687", ready: false },
      { code: "E4.2", title: "Produit reconnu", path: "/e4-capture/e4-2-produit-reconnu", figmaNodeId: "12:717", ready: false },
      { code: "E4.3", title: "Produit non reconnu", path: "/e4-capture/e4-3-produit-non-reconnu", figmaNodeId: "12:758", ready: false },
      { code: "E4.4", title: "Demande voix", path: "/e4-capture/e4-4-demande-voix", figmaNodeId: "12:793", ready: false },
      { code: "E4.5", title: "Énergie choix", path: "/e4-capture/e4-5-energie-choix", figmaNodeId: "12:833", ready: false },
      { code: "E4.6", title: "Facture non lisible", path: "/e4-capture/e4-6-facture-non-lisible", figmaNodeId: "12:877", ready: false },
      { code: "E4.7", title: "Chargement", path: "/e4-capture/e4-7-chargement", figmaNodeId: "12:956", ready: false },
    ],
  },
  {
    code: "E5",
    title: "Carte",
    screens: [
      { code: "E5.1", title: "Carte · Alimentation", path: "/e5-carte/e5-1-carte-alimentation", figmaNodeId: "15:828", ready: false },
      { code: "E5.2", title: "Carte · Seconde main", path: "/e5-carte/e5-2-carte-seconde-main", figmaNodeId: "15:960", ready: false },
      { code: "E5.3", title: "Carte · Énergie", path: "/e5-carte/e5-3-carte-energie", figmaNodeId: "15:1039", ready: false },
      { code: "E5.4", title: "Carte · À revérifier", path: "/e5-carte/e5-4-carte-a-reverifier", figmaNodeId: "15:1118", ready: false },
      { code: "E5.5", title: "Aucune alternative", path: "/e5-carte/e5-5-aucune-alternative", figmaNodeId: "15:1206", ready: false },
      { code: "E5.6", title: "Pas aujourd’hui", path: "/e5-carte/e5-6-pas-aujourdhui", figmaNodeId: "15:1237", ready: false },
      { code: "E5.7", title: "Source indisponible", path: "/e5-carte/e5-7-source-indisponible", figmaNodeId: "15:1365", ready: false },
    ],
  },
  {
    code: "E6",
    title: "Pourquoi",
    screens: [
      { code: "E6.1", title: "Détail des sources", path: "/e6-pourquoi/e6-1-detail-des-sources", figmaNodeId: "16:1204", ready: false },
      { code: "E6.2", title: "Signaler", path: "/e6-pourquoi/e6-2-signaler", figmaNodeId: "16:1264", ready: false },
      { code: "E6.3", title: "Signalement envoyé", path: "/e6-pourquoi/e6-3-signalement-envoye", figmaNodeId: "16:1308", ready: false },
    ],
  },
  {
    code: "E7",
    title: "Action",
    screens: [
      { code: "E7.1", title: "Action · Lieu", path: "/e7-action/e7-1-action-lieu", figmaNodeId: "16:1361", ready: false },
      { code: "E7.2", title: "Action · Énergie", path: "/e7-action/e7-2-action-energie", figmaNodeId: "16:1417", ready: false },
      { code: "E7.3", title: "Mis de côté", path: "/e7-action/e7-3-mis-de-cote", figmaNodeId: "16:1472", ready: false },
    ],
  },
  {
    code: "E8",
    title: "Confirmation",
    screens: [
      { code: "E8.1", title: "Confirmation", path: "/e8-confirmation/e8-1-confirmation", figmaNodeId: "16:1528", ready: false },
      { code: "E8.2", title: "Premier gain", path: "/e8-confirmation/e8-2-premier-gain", figmaNodeId: "16:1572", ready: false },
    ],
  },
  {
    code: "E9",
    title: "Foyer",
    screens: [
      { code: "E9.1", title: "Mon foyer", path: "/e9-foyer/e9-1-mon-foyer", figmaNodeId: "17:1607", ready: false },
      { code: "E9.2", title: "Gestes déjà faits", path: "/e9-foyer/e9-2-gestes-deja-faits", figmaNodeId: "17:1741", ready: false },
      { code: "E9.3", title: "Réglages", path: "/e9-foyer/e9-3-reglages", figmaNodeId: "17:1812", ready: false },
      { code: "E9.4", title: "Autorisations", path: "/e9-foyer/e9-4-autorisations", figmaNodeId: "17:1896", ready: false },
      { code: "E9.5", title: "Sources et méthode", path: "/e9-foyer/e9-5-sources-et-methode", figmaNodeId: "17:1969", ready: false },
      { code: "E9.6", title: "Hors ligne", path: "/e9-foyer/e9-6-hors-ligne", figmaNodeId: "17:2034", ready: false },
    ],
  },
];

export const allScreens: ScreenEntry[] = screenSections.flatMap((s) => s.screens);

export function figmaUrl(nodeId: string): string {
  return `https://www.figma.com/design/${FIGMA_FILE_KEY}/Hooka?node-id=${nodeId.replace(":", "-")}`;
}
