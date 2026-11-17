import { Navigate, type RouteObject } from "react-router";
import { ComponentGallery } from "./screens/ComponentGallery/ComponentGallery";
import { Placeholder } from "./screens/Placeholder/Placeholder";
import { ScreenIndex } from "./screens/ScreenIndex/ScreenIndex";
import { allScreens } from "./screens/registry";

/**
 * Une route par écran Figma. Quand un écran est développé :
 *   1. crée-le dans screens/E<n>-<Section>/ (fichier .tsx + .module.css)
 *   2. ajoute son chemin dans `implemented` ci-dessous
 *   3. passe `ready: true` dans screens/registry.ts
 */
const implemented: Record<string, RouteObject["element"]> = {
  // "/e5-carte/e5-1-carte-alimentation": <CardScreen />,
};

export const routes: RouteObject[] = [
  { path: "/", element: <Navigate to="/ecrans" replace /> },
  { path: "/ecrans", element: <ScreenIndex /> },
  { path: "/composants", element: <ComponentGallery /> },
  ...allScreens.map((screen) => ({
    path: screen.path,
    element: implemented[screen.path] ?? <Placeholder screen={screen} />,
  })),
  { path: "*", element: <Navigate to="/ecrans" replace /> },
];
