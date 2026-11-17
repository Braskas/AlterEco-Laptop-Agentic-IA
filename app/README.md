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
