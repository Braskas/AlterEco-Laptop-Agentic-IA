# Synthèse de la Recherche Utilisateur : Alternatives Écologiques & Numérique Responsable

Ce document présente la synthèse consolidée des cinq entretiens qualitatifs menés auprès d'utilisateurs aux profils et niveaux de maturité variés. Il vise à fournir à l'équipe produit, design et technique une vision claire et exploitable des attentes terrain, des freins structurels et des leviers d'adoption pour concevoir notre solution.

---

## 1. Cadre de l'Étude & Échantillon

Les entretiens semi-directifs individuels (durée : 40 à 55 minutes) ont été conduits entre le 15 et le 24 janvier 2025. L'échantillon couvre une diversité d'âges, de contextes géographiques et de modes de vie :

* **Léa (28 ans, Lyon)** : Chargée de communication en startup. Profil urbain sans voiture, sensible à l'alimentation et au vrac, confrontée au manque de temps et au greenwashing.
* **Thomas (32 ans, Nantes)** : Développeur web freelance. Profil analytique et technophile, télétravailleur sans voiture, exigeant sur la rigueur scientifique et intéressé par le numérique responsable.
* **Camille (34 ans, banlieue bordelaise)** : Responsable RH, 2 enfants (4 et 7 ans). Profil familial dépendant de deux voitures, soumis à une forte charge mentale et à un budget contraint.
* **Antoine (26 ans, Toulouse)** : Commercial terrain en startup tech. Profil débutant nomade (15 000 km/an en voiture), motivé par un électrochoc en voyage mais paralysé par la culpabilité et le manque de repères.
* **Sofia (29 ans, Marseille)** : Graphiste freelance. Profil avancé (végétarienne, zéro déchet, seconde main intégrale), souffrant d'éco-anxiété, de dispersion des applications et d'un sentiment d'isolement.

---

## 2. Cartographie Comparative des Personas

Le tableau ci-dessous synthétise les caractéristiques, contraintes majeures et attentes prioritaires des cinq participants.

| Participant | Profil & Cadre de vie | Engagement actuel | Freins majeurs | Attente prioritaire | Facteur de rejet immédiat |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Léa** (28 ans) | Lyon, urbaine, sans voiture | Intermédiaire (bio, vrac, seconde main) | Manque de temps, budget, informations contradictoires | Recommandations contextuelles, équivalences concrètes | Ton moralisateur, saisie chronophage |
| **Thomas** (32 ans) | Nantes, urbain, vélo / télétravail | Analytique (réduction viande, vélo) | Opacité des sources, micro-gestes sans mise en perspective | Rigueur méthodologique, double niveau de lecture | Gamification superficielle, marketing vert |
| **Camille** (34 ans) | Bordeaux banlieue, 2 enfants, 2 voitures | Pragmatique (tri, compost, seconde main enfants) | Manque de temps absolu, budget courses serré, données non fiables | Alternatives à prix équivalent en supermarché habituel | Menus complexes, formulaires longs, leçons de morale |
| **Antoine** (26 ans) | Toulouse, nomade (15 000 km/an voiture) | Débutant (gourde, tri basique) | Ne sait pas par où commencer, contradictions de son métier | Accompagnement pas à pas, ratio impact/effort optimal | Bilans carbone punitifs, classements publics |
| **Sofia** (29 ans) | Marseille, urbaine, vélo / sans permis | Avancé (végétarienne, DIY cosmétiques, troc) | Éco-anxiété, fatigue mentale, fragmentation des outils | Valorisation des impacts évités, communauté de soutien | Rappels anxiogènes, focalisation sur l'échec |

---

## 3. Analyse Transversale des Freins & Frictions

Quatre obstacles majeurs structurent l'expérience quotidienne des participants et expliquent l'abandon des solutions existantes :

### 3.1. Le conflit temporel et la charge mentale
Le manque de temps est le premier motif de décrochage :
* Pour Camille, le quotidien familial impose des créneaux d'attention extrêmement courts (consultation du téléphone par tranches de 30 secondes). Toute interface demandant une configuration longue ou une navigation complexe est exclue.
* Léa et Thomas soulignent que le temps nécessaire pour comparer des produits (ex. gourde inox vs verre, PC reconditionné vs neuf) est disproportionné, conduisant à l'abandon pur et simple de l'achat responsable.

### 3.2. La réalité budgétaire et le refus du surcoût arbitraire
Les utilisateurs sont prêts à des arbitrages raisonnés, mais refusent les surcoûts non justifiés :
* Le consentement à payer plus cher existe principalement dans l'alimentation (Léa et Camille privilégient le bio pour certains produits clés).
* Sur les produits non alimentaires (entretien, habillement), un écart de prix excessif (du simple au triple) bloque le passage à l'acte.
* Pour les familles (Camille), l'attente centrale n'est pas le surcoût militant, mais **l'alternative responsable à budget équivalent** au sein de leur magasin habituel.

### 3.3. Le déficit de confiance et le risque de greenwashing
L'abondance de labels et de discours marketing génère de la méfiance :
* Léa se sent perdue face à la jungle des certifications (AB, Ecocert, B Corp, Origine France) sans grille de décryptage claire.
* Thomas réclame une transparence algorithmique totale : sans accès aux sources (ADEME, GIEC) et aux critères de calcul, les applications sont perçues comme du marketing déguisé.
* L'obsolescence des données est destructrice : Camille a désinstallé une application de vrac après avoir trouvé porte close avec ses enfants, détruisant instantanément son capital confiance.

### 3.4. La toxicité de la culpabilité et le piège de l'éco-anxiété
Le ton accusateur des outils existants produit des effets contraires à l'engagement :
* **Découragement chez les débutants :** Antoine a fermé définitivement son calculateur d'empreinte après avoir vu son score de 12 tonnes sans aucune piste d'action graduelle.
* **Burn-out chez les utilisateurs engagés :** Sofia a vécu un épisode d'éco-anxiété aigu, alimenté par le catastrophisme ambiant et l'impression que les efforts individuels sont vains.

---

## 4. Attentes Clés & Leviers d'Engagement

Pour devenir un véritable allié du quotidien, la solution doit intégrer les principes suivants :

### 4.1. L'action contextuelle et immédiate (Modèle Yuka)
Les utilisateurs plébiscitent l'immédiateté au moment de l'acte (en rayon, lors d'un déplacement). L'outil doit apporter une réponse pratique à l'endroit précis où se trouve la personne, plutôt qu'un cours théorique.

### 4.2. Une architecture de l'information à double niveau
Pour réconcilier les besoins de rapidité et d'exhaustivité :
* **Niveau 1 (Synthétique) :** Une réponse claire, visuelle et actionnable en 5 secondes pour la décision immédiate.
* **Niveau 2 (Approfondi) :** Un volet méthodologique transparent détaillant les sources, calculs et incertitudes scientifiques pour les profils analytiques.

### 4.3. Renverser la métrique : valoriser le positif
Remplacer le décompte des fautes par la valorisation des efforts :
* Mesurer les **émissions évitées** plutôt que le total résiduel culpabilisant.
* Utiliser des **équivalences physiques parlantes** (kilomètres en voiture évités, douches économisées) plutôt que des volumes abstraits de CO2.

### 4.4. Une dimension sociale protectrice et collaborative
Rejet unanime des classements compétitifs et de l'étalage social :
* **Entraide pratique locale :** Achats groupés, échange de vêtements, covoiturage de proximité (Léa, Camille).
* **Base collaborative vérifiée :** Système contributif pair-à-pair type Wikipedia ou Stack Overflow (Thomas).
* **Mentorat bienveillant :** Groupes segmentés par niveau d'engagement pour partager doutes et réussites sans jugement (Sofia).
* **Partage au sein du foyer :** Listes de courses et défis partagés pour répartir la charge mentale (Camille, Antoine).

---

## 5. Ce qu'il ne faut absolument pas faire (Anti-Patterns)

1. **Adopter un ton moralisateur ou anxiogène** : sanctionner l'utilisateur ou lui afficher un constat d'échec sans perspective de progrès.
2. **Imposer un onboarding lourd** : exiger la saisie exhaustive de toutes ses habitudes avant de fournir la première recommandation utile.
3. **Plaquer une gamification infantile** : distribuer des badges, points ou classements compétitifs déconnectés de l'impact réel.
4. **Ignorer les contraintes réelles de vie** : proposer des solutions inadaptées aux zones périurbaines ou aux métiers mobiles.
5. **Négliger la fraîcheur des données** : diffuser des adresses, horaires ou alternatives obsolètes.

---

## 6. Recommandations Produit & Feuille de Route MVP

### Phase 1 : Cœur de valeur (MVP)
* Scanner ou sélecteur contextuel de produits au supermarché (Alimentation & Entretien).
* Proposition d'alternatives écologiques à prix équivalent ou inférieur.
* Visualisation des gains en équivalences physiques concrètes.
* Fiche méthodologique transparente en un clic (données ouvertes et sourcées).

### Phase 2 : Compagnon d'habitudes & Foyer
* Parcours d'accompagnement progressif (« une action simple par semaine »).
* Fonctionnalités partagées pour le foyer (liste de courses écoresponsable commune).
* Module numérique responsable & achats high-tech durables (reconditionné, bonnes pratiques).

### Phase 3 : Dynamique collaborative & Entraide locale
* Répertoire d'initiatives locales vérifiées et maintenues par la communauté.
* Groupes d'échange et de mentorat par affinité et niveau d'engagement.
* Mode nomade pour les professionnels en déplacement.
