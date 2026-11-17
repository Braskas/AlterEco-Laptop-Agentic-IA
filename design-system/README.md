Hooka trouve en 30 secondes l'alternative la moins chère, la plus proche et la plus légère pour la planète, juste avant qu'on mange, achète ou se déplace. Ce n'est pas une app verte, c'est une app maligne : vive, directe, contemporaine, jamais moralisatrice. Chaque écran doit permettre de décider d'un coup d'œil.

## L'idée de marque

**Pas vert, malin.** Hooka n'utilise ni vert, ni feuille, ni globe, et évite le jaune, le bleu et l'orange. Le rose donne l'élan (`rose`), le violet dit l'impact planète (`violet`), le rose pâle montre le gain (`blush`) et le lilas la communauté (`lilac`), sur un blanc cassé neutre et un noir violacé. Le nom vient de *hook* (l'accroche, le bon plan) et de *look* : les deux « o » sont deux yeux qui regardent avant d'acheter.

Signature : **Hooka. Le bon réflexe, en 30 secondes.**

## Contenu et ton (résumé)

Le détail et les exemples sont dans la section « Voix et ton ».

- Tutoie. Phrases de 12 mots maximum, verbe d'action en premier : « Trouve », « Gagne », « Fonce ».
- Un seul message par écran et par notification, avec un chiffre concret et une équivalence parlante (km évités, douches d'eau).
- Ne culpabilise jamais : ni « tu dois », ni « erreur », ni score qui baisse, ni message rouge.
- Écris « Hooka » avec une majuscule dans les textes ; le « hooka » en minuscules n'existe que dans le logo.
- Aucun emoji dans l'interface.

## Logo

- Utilise le wordmark `assets/Logos/hooka-wordmark-ink.svg` sur `bg`, `surface`, `brume`, `blush`, `lilac` et `rose`. Utilise `hooka-wordmark-cream.svg` sur `ink` le jour, sur `bg` la nuit et sur `violet` le jour.
- Utilise le symbole `assets/Logos/hooka-symbol.svg` (carré `rose` aux coins arrondis, deux yeux en anneaux `ink`) pour l'icône d'app, l'avatar et le favicon. Ne le pose pas sur un fond `rose`.
- Le lettrage est droit, géométrique, aux terminaisons coupées net. Ne l'incline pas, ne l'arrondis pas, ne le redessine pas dans une autre police.
- Réserve autour du logo l'équivalent d'un « o » (son diamètre), jamais moins que `space-5`. Taille minimale : 72 px de large pour le wordmark, 24 px pour le symbole.
- Ne change pas les couleurs des yeux, n'étire pas, n'ajoute ni ombre ni contour, ne remplace aucun « o » par un globe ou une feuille.
- Les yeux vivent dans le logo et son symbole : ne les dessine pas sur des objets, des personnages ou une mascotte.

## Couleurs

Répartition par écran : `bg` et `surface` environ 65 %, `ink` 15 %, `rose` 10 %, `violet` 5 %, `blush`, `lilac` et `brume` 5 %.

| Token | Rôle | Règle |
|---|---|---|
| `rose` + `on-rose` | Agir : bouton principal, icône d'app | Un seul fond `rose` par écran. Jamais en texte sur `bg` le jour. |
| `violet` + `on-violet` | Impact planète : chiffres, liens, équivalences | Texte autorisé sur `bg`, `surface`, `brume`. |
| `blush` + `on-blush` | Gain en euros | Toujours `on-blush` dessus, jamais `ink` ni `violet` la nuit. |
| `lilac` + `on-lilac` | La Bande (entraide locale), accents doux | Réservé à la communauté et aux illustrations. |
| `brume` | Fond des blocs d'impact | Texte `ink`, `ink-soft` ou `violet`. |
| `ink`, `ink-soft` | Texte et contours | `ink` pour le texte principal, `ink-soft` pour la méta. |

Interdits : le vert, le jaune, le bleu, l'orange, le rouge, les dégradés, les photos de stock, le texte sur transparence. Un message d'attention s'écrit en `ink` sur `blush` avec un mot clair et une icône. Un blocage rare (paiement refusé, par exemple) s'écrit en `on-rose` sur `rose`, avec un mot et une icône, jamais en rouge.

### Contrastes vérifiés

| Paire | Jour | Nuit |
|---|---|---|
| `ink` sur `bg` | 16,7:1 | 17,2:1 |
| `ink-soft` sur `surface` | 7,2:1 | 8,7:1 |
| `violet` sur `bg` | 6,9:1 | 8,6:1 |
| `violet` sur `brume` | 6,3:1 | 6,7:1 |
| `on-rose` sur `rose` | 5,5:1 | 5,5:1 |
| `on-violet` sur `violet` | 7,6:1 | 8,4:1 |
| `on-blush` sur `blush` | 13,9:1 | 13,9:1 |
| `on-lilac` sur `lilac` | 12,2:1 | 12,2:1 |
| `focus` sur `bg` | 6,9:1 | 14,4:1 |

## Typographie

- Titres en Sora (famille `display`), géométrique et contemporaine comme le logo : `display-xl`, `display-l`, `title`, `heading`, et `figure` pour les gros chiffres. Poids 600 à 700.
- Texte en Figtree (famille `sans`) : `body` (16 px minimum), `body-strong`, `caption`, `label`, `micro`.
- Écris les titres en minuscules avec majuscule initiale, sur deux lignes au plus. Jamais de bloc en capitales.
- Un seul `figure` par bloc. `micro` ne porte jamais une action.
- Les deux familles sont chargées depuis Google Fonts ; garde les replis du token (`Arial`, `system-ui`).

## Forme et matière

- Reste net et sobre : des aplats de couleur, des cartes claires, jamais d'effet cartoon, de mascotte ni de personnage dessiné.
- Pose les cartes en `surface` avec un filet `hairline` de 1 px et l'ombre douce `lift` ; `lift-sm` pour un bouton survolé ou une notification. Aucune ombre dure, aucun contour épais.
- Réserve le contour `line` de `stroke-1` (1,5 px) aux boutons secondaires et aux champs de saisie. Les boutons principaux et d'impact sont des aplats sans contour.
- Arrondis mesurés : `radius-lg` (20 px) pour cartes et blocs de couleur, `radius-md` (12 px) pour images, notifications et tuiles internes, `radius-sm` (8 px) pour les champs, `radius-pill` pour boutons et pastilles.
- Espace sur une grille de 4 : `space-4` de marge d'écran, `space-5` de padding de carte, `space-6` entre blocs. Toute cible tactile mesure 48 px au moins.
- Compose avec de grandes zones de couleur et beaucoup d'air, en alignant le texte à gauche.
- Illustre avec des photos nettes de produits et de lieux, cadrées de près, en lumière naturelle, ou avec des aplats géométriques (disques, pilules) aux couleurs de la marque. Pas de feuilles, pas de globes.

## Iconographie

- Dessine les icônes au trait de 2 px sur une grille de 24 px, bouts coupés net ou légèrement arrondis, en `ink` ; `violet` pour tout ce qui parle d'impact.
- Une icône pleine se remplit de `rose` ou `blush` avec son contour `ink`.
- Aucun emoji, ni dans l'interface ni dans les notifications. Aucune bibliothèque d'icônes n'est livrée avec ce système : choisis-en une au trait régulier de 2 px et recolore-la avec les tokens.
- Ajoute toujours un mot à une icône qui porte un statut.

## Mouvement

- Anime en 120 à 220 ms, en `ease-out`. Le bouton se soulève de 1 px au survol (ombre `lift-sm`) et se repose à l'appui.
- Fais entrer les éléments de la gauche vers la droite (200 ms maximum) et fais glisser les pupilles du logo vers la droite pendant un chargement.
- Coupe tout mouvement sous `prefers-reduced-motion`.

## États et accessibilité

- Survol : le bouton se soulève de 1 px. Appui : il se repose et fonce légèrement.
- Focus clavier : anneau `focus` de `stroke-2` (3 px), décalé de 3 px, visible sur tous les fonds.
- Désactivé : contour en pointillés, texte `ink-soft`, sans ombre. Dis pourquoi à côté.
- Chaque statut porte un mot et une icône en plus de sa couleur. Teste chaque écran en thème Jour et Nuit.

## Composants

`Logo`, `Button`, `HookCard`, `DoubleBonus`, `TrustSheet`, `Notification`. Les classes (`hk-btn`, `hk-chip`, `hk-card`…) sont dans `components/bundle.css` et ne contiennent que des tokens.
