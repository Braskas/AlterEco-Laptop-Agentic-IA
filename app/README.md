# Hooka — app React

Version développée des écrans Figma (fichier Hooka, pages « 02 Composants » et « 03 Écrans »).
React + TypeScript + CSS Modules, sur une base de données fictive.

## Lancer

```bash
cd app
npm install
npm run dev        # http://localhost:5173 → /ecrans
npm run test       # moteur de recommandation + base fictive
npm run typecheck
npm run build
```

- `/ecrans` : sommaire des 43 écrans, bascule Jour/Nuit, remise à zéro de la base.
- `/composants` : chaque composant dans toutes ses variantes Figma.

## Où mettre quoi

| Dossier | Contenu | Règle |
| --- | --- | --- |
| `src/components/<Nom>/` | Un composant Figma : `Nom.tsx`, `Nom.module.css`, `index.ts` | Les props reprennent les variantes Figma. Le CSS n'utilise que des tokens (`var(--rose)`, `var(--space-4)`…). |
| `src/screens/E<n>-<Section>/` | Un écran Figma : `.tsx` + `.module.css` | Compose des composants, lit les données via `data/api`. |
| `src/screens/registry.ts` | Liste des 43 écrans, route et nœud Figma | Passe `ready: true` quand l'écran est fait. |
| `src/routes.tsx` | Route → écran | Ajoute l'écran dans `implemented`. |
| `src/data/types.ts` | Les 12 entités de la spec (§6) | — |
| `src/data/seed/*.json` | Données fictives (Lyon 7e) | Modifie-les pour tester un cas. |
| `src/data/db.ts` | Base en mémoire + localStorage | Les écrans ne l'importent jamais. |
| `src/data/api/` | Seule porte d'accès aux données | À réécrire, mêmes signatures, pour brancher une vraie API. |
| `src/engine/recommend.ts` | Moteur (§7) : une carte ou un refus | Fonction pure, testée. |

## Composants Figma → code

| Figma (02 Composants) | Code | Figma | Code |
| --- | --- | --- | --- |
| Hooka/Button | `Button` | Hooka/HookCard | `HookCard` (reçoit la `Card` du moteur) |
| Hooka/Chip | `Chip` | Hooka/DoubleBonus | `DoubleBonus` |
| Hooka/Icône/* | `Icon` + lucide-react | Hooka/PastilleSource | `SourceBadge` |
| Hooka/Logo | `Logo` | Hooka/TrustSheet | `TrustSheet` |
| Hooka/Champ | `Field` | Hooka/FeuillePermission | `PermissionSheet` |
| Hooka/Option | `Option` | Hooka/Poignée | `Handle` (dans `Sheet`) |
| Hooka/Toggle | `Toggle` | Hooka/Bandeau | `Banner` |
| Hooka/Progression | `Progress` | Hooka/Toast | `Toast` |
| Hooka/EnTête | `Header` | Hooka/Chargement | `Loader` |
| Hooka/StatusBar | `StatusBar` (desktop) | Hooka/ÉtatVide | `EmptyState` |
| Hooka/HomeIndicator | `HomeIndicator` (desktop) | Hooka/LigneListe | `ListRow` |
| Hooka/Notification | `Notification` | Hooka/LigneHistorique | `HistoryRow` |

`Sheet` n'existe pas dans Figma : c'est la base commune des deux feuilles (voile, Échap, poignée).

## Tokens

`src/styles/global.css` importe `../design-system/tokens.css`. On ne recopie jamais une couleur ou une
taille en dur. Le thème Nuit = `data-theme="dark"` sur `<html>`, géré par `ThemeContext`.

## Écrans : routes du parcours

Un état Figma (E5.6, E6.1…) n'est pas une copie d'écran : c'est une route avec un paramètre `?vue=`.
`src/screens/registry.ts` donne, pour chacun des 43 nœuds Figma, sa route (`to`) et son scénario de démo.

| Route | Écrans Figma |
| --- | --- |
| `/onboarding/bienvenue` → `domaines` → `budget` → `lieu` → `temps` | E1.1–E1.5 (E1.2b : `?vue=prevenu`) |
| `/mini-bilan`, `/mini-bilan/bravo` | E2.1, E2.2 |
| `/accueil` | E3.1 · `?vue=lieu` E3.2 · demande hors domaine E3.3 · `?vue=domaines` E3.4 |
| `/capture/scan`, `/capture/produit/:id`, `/capture/texte`, `/capture/voix`, `/capture/energie`, `/capture/facture` | E4.1–E4.6, et E1.6 (feuilles de permission) |
| `/carte?produit=…` ou `?q=…` | E4.7, E5.1–E5.7 selon le moteur · `?vue=passer` E5.6 · `pourquoi` E6.1 · `signaler` E6.2 · `signale` E6.3 |
| `/action/:recId` | E7.1, E7.2 · `?vue=garde` E7.3 |
| `/confirmation/:decisionId` | E8.1, E8.2 (premier gain) |
| `/foyer`, `/foyer/gestes`, `/foyer/reglages`, `/foyer/autorisations`, `/foyer/sources` | E9.1–E9.5 · `?horsligne=1` E9.6 |

Mes réglages (E9.3) rouvre les écrans d'onboarding en mode édition (`?retour=/foyer/reglages`).

**Scénarios** (`resetDb(...)`, appliqués par `/ecrans`) : `nouveau` (défaut, onboarding à faire),
`habitue` (7 décisions ce mois-ci, une veste gardée), `premier` (une seule décision → E8.2).
Le bouton « Parcours complet » de `/ecrans` repart de zéro sur E1.1.

## Cas de démo dans la base fictive

| Besoin | Résultat | Écran |
| --- | --- | --- |
| Scan `prod-yaourt-marque` | Yaourt vrac, certitude solide | E5.1 |
| Scan `prod-perceuse-neuve` | Perceuse reconditionnée, probable | E5.2 |
| Scan `prod-facture-energie` | Baisser à 17 °C la nuit, probable | E5.3 |
| Scan `prod-veste-neuve` | Veste d'occasion, source d'avril : à revérifier | E5.4 |
| Scan `prod-chips` | Source non datée : aucune alternative | E5.5 |
| Scan `prod-cafe-capsules` | Source indisponible | E5.7 |
| Code-barres inconnu | Produit non reconnu | E4.3 |
