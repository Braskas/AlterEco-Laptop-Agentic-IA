Le bouton Hooka est une pilule nette, sans ombre au repos, qui se soulève d'un pixel au survol.

**Ce que tu fournis** : un libellé de 1 à 3 mots, avec un verbe d'action en premier (« Je fonce », « Voir autre chose »).

- `hk-btn hk-btn--primary` : l'action principale de l'écran, un seul par écran, fond `rose`, texte `on-rose`.
- `hk-btn` : les actions secondaires, fond transparent et contour `line` de 1,5 px.
- `hk-btn hk-btn--impact` : les actions qui parlent d'impact planète, fond `violet`, texte `on-violet`.
- `hk-link` : un lien discret en `violet` souligné (« Pourquoi ce choix ? »).
- `hk-btn--lg` : l'action de l'écran d'accueil ou d'une campagne.

États : au survol, le bouton se soulève de 1 px avec l'ombre `lift-sm` ; à l'appui, il se repose et fonce légèrement. Le focus clavier affiche l'anneau `focus` de 3 px. Désactivé, le contour passe en pointillés et le texte en `ink-soft` : explique la raison à côté.

À ne pas faire : deux boutons `rose` dans le même écran, un libellé négatif (« Non, je préfère polluer »), un bouton de moins de 48 px de haut.
