import { Navigate, type RouteObject } from "react-router";
import { profileApi } from "./data/api";
import { useAsync } from "./hooks/useAsync";
import { ComponentGallery } from "./screens/ComponentGallery/ComponentGallery";
import { ScreenIndex } from "./screens/ScreenIndex/ScreenIndex";
import { allScreens } from "./screens/registry";
import { Welcome } from "./screens/E1-Onboarding/Welcome";
import { Domains } from "./screens/E1-Onboarding/Domains";
import { Budget } from "./screens/E1-Onboarding/Budget";
import { Location } from "./screens/E1-Onboarding/Location";
import { Time } from "./screens/E1-Onboarding/Time";
import { MiniBilan } from "./screens/E2-MiniBilan/MiniBilan";
import { Bravo } from "./screens/E2-MiniBilan/Bravo";
import { Home } from "./screens/E3-Accueil/Home";
import { Scan } from "./screens/E4-Capture/Scan";
import { TextSearch } from "./screens/E4-Capture/TextSearch";
import { Voice } from "./screens/E4-Capture/Voice";
import { Energy } from "./screens/E4-Capture/Energy";
import { Bill } from "./screens/E4-Capture/Bill";
import { CardScreen } from "./screens/E5-Carte/CardScreen";
import { ActionScreen } from "./screens/E7-Action/ActionScreen";
import { ConfirmationScreen } from "./screens/E8-Confirmation/ConfirmationScreen";
import { Household } from "./screens/E9-Foyer/Household";
import { Gestures } from "./screens/E9-Foyer/Gestures";
import { Settings } from "./screens/E9-Foyer/Settings";
import { Permissions } from "./screens/E9-Foyer/Permissions";
import { Sources } from "./screens/E9-Foyer/Sources";

/** `/` : onboarding si la personne arrive pour la première fois, sinon l'accueil. */
function RootRedirect() {
  const user = useAsync(() => profileApi.getUser(), []);
  if (user.status === "loading") return null;
  return <Navigate to={user.data?.onboardingDone ? "/accueil" : "/onboarding/bienvenue"} replace />;
}

/**
 * Routes du parcours. Un écran Figma « état » (E5.6, E6.1…) est une de ces routes
 * avec un paramètre (`?vue=…`) : voir `to` dans screens/registry.ts.
 */
export const routes: RouteObject[] = [
  { path: "/", element: <RootRedirect /> },
  { path: "/ecrans", element: <ScreenIndex /> },
  { path: "/composants", element: <ComponentGallery /> },

  // E1 · Onboarding (E1.6 : feuilles de permission dans E3 et E4)
  { path: "/onboarding", element: <Navigate to="/onboarding/bienvenue" replace /> },
  { path: "/onboarding/bienvenue", element: <Welcome /> },
  { path: "/onboarding/domaines", element: <Domains /> },
  { path: "/onboarding/budget", element: <Budget /> },
  { path: "/onboarding/lieu", element: <Location /> },
  { path: "/onboarding/temps", element: <Time /> },
  // E2 · Mini-bilan
  { path: "/mini-bilan", element: <MiniBilan /> },
  { path: "/mini-bilan/bravo", element: <Bravo /> },
  // E3 · Accueil
  { path: "/accueil", element: <Home /> },
  // E4 · Capture
  { path: "/capture/scan", element: <Scan /> },
  { path: "/capture/produit/:productId", element: <Scan /> },
  { path: "/capture/texte", element: <TextSearch /> },
  { path: "/capture/voix", element: <Voice /> },
  { path: "/capture/energie", element: <Energy /> },
  { path: "/capture/facture", element: <Bill /> },
  // E5 · Carte (+ E4.7 chargement, E6 feuilles)
  { path: "/carte", element: <CardScreen /> },
  // E7 · Action
  { path: "/action/:recId", element: <ActionScreen /> },
  // E8 · Confirmation
  { path: "/confirmation/:decisionId", element: <ConfirmationScreen /> },
  // E9 · Mon foyer
  { path: "/foyer", element: <Household /> },
  { path: "/foyer/gestes", element: <Gestures /> },
  { path: "/foyer/reglages", element: <Settings /> },
  { path: "/foyer/autorisations", element: <Permissions /> },
  { path: "/foyer/sources", element: <Sources /> },

  // Anciens chemins de revue (un par nœud Figma) → état du parcours
  ...allScreens.map((screen) => ({
    path: screen.path,
    element: <Navigate to={screen.to ?? "/ecrans"} replace />,
  })),
  { path: "*", element: <Navigate to="/ecrans" replace /> },
];
