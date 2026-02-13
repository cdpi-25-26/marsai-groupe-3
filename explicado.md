# Explication des pages et de la Navbar

## Methodes CSS utilisees

- **background / background-color**: met une couleur ou une image en fond.
- **linear-gradient**: fait un fond en degrade (transition de couleurs).
- **border / border-radius**: ajoute une bordure et arrondit les coins.
- **box-shadow**: ajoute une ombre autour des blocs.
- **display: flex / grid**: sert a aligner les elements facilement (en ligne ou en grille).
- **gap / padding / margin**: gere les espaces entre et autour des elements.
- **transition / animation / keyframes**: fait des effets doux quand on survole ou quand la page charge.
- **transform (translate, scale, rotate)**: bouge, agrandit ou tourne un element.
- **hover / focus**: change le style quand on passe la souris ou quand un champ est clique.
- **max-width / min-height / width**: controle la taille des blocs.
- **position / z-index**: place un element par dessus ou a un endroit precis.
- **backdrop-filter**: ajoute un flou derriere un bloc transparent.
- **@media**: adapte le design aux ecrans plus petits.

## Exemples de classes et composants (CSS utilitaire - Tailwind CSS)

- **`<div className="grid grid-cols-1 md:grid-cols-2 gap-6">`(dans Videosubmission.jsx ligne 175)**
	- `grid`: active la grille CSS.
	- `grid-cols-1`: 1 colonne par defaut.
	- `md:grid-cols-2`: 2 colonnes a partir des ecrans moyens.
	- `gap-6`: espace entre les elements de la grille.

- **`<FormTextarea ... maxLength={500} rows={6} />`(dans Videosubmission.jsx ligne 176)**
	- `FormTextarea`: petit composant React qui affiche un label + un textarea.
	- `required`: rend le champ obligatoire.
	- `value` + `onChange`: permet de lier le champ a l'etat du formulaire.
	- `placeholder`: texte d'exemple affiche quand le champ est vide.
	- `maxLength`: limite le nombre de caracteres.
	- `rows`: hauteur du champ (nombre de lignes visibles).

- **`{totalPages > 1 && ( ... )}` (pagination - GALLERY.jsx ligne 220)**
	- `totalPages > 1`: affiche la pagination seulement s'il y a plus d'une page.
	- `Array.from({ length: totalPages }, ...)`: cree une liste de pages (1, 2, 3...).
	- `map((page) => ...)`: genere un bouton pour chaque page.
	- `onClick={() => handlePageChange(page)}`: change la page quand on clique.
	- `disabled={currentPage === 1}`: desactive le bouton precedent si on est a la page 1.
	- `className={...}`: change la couleur du bouton actif (degrade rose/violet) et les autres en gris.

## NAVBAR (Navbar.jsx et Navbar.css)

### CSS (Navbar.css):
- **Le fond**: La navbar a un fond blanc semi-transparent avec du flou (blur). Elle a une forme arrondie (border-radius: 50px).
- **Les boutons**: Les trois boutons (GALERIE, PARTICIPER, DÉPOSER UN FILM) ont un dégradé de couleur (gradient) qui va du bleu au violet et au rose (GALERIE et DÉPOSER UN FILM sont des boutons temporaires).
- **Effets au survol**: Quand on passes la souris sur les boutons, le hover s'active de 2px et ils deviennent plus brillants avec une ombre.
- **Le logo**: Le logo "MARS" est blanc et "AI" a un dégradé de couleur bleu-violet-rose. Le logo se grandit légèrement avec un hover.
- **Le menu burger**: Sur les petits écrans (téléphones), le menu devient un menu burger. Quand on cliques dessus, les 3 lignes se transforment en un X qui prend un rotate.
- **Responsive**: Le design s'adapte à tous les tailles d'écrans (ordinateur, tablette, téléphone).

### JavaScript (Navbar.jsx):
- Le menu burger peut s'ouvrir et se fermer
- Les boutons redirigent vers les différentes pages
- Quand tu cliques sur un lien, le menu se referme automatiquement


## PAGE GALERIE (Gallery.jsx et Gallery.css)

### Ce que ça fait en général:
La Galerie affiche une collection de films avec la possibilité de les filtrer et possède une pagination.

### CSS (Gallery.css):
- **Le fond**: C'est un dégradé gris-noir qui va du haut vers le bas, avec du noir au centre.
- **Les cartes de films**: Chaque film est montré dans une petite carte avec une image du film, le titre, et des infos. Quand on survoles une carte, l'image se zoome de 10%, créant un effet de profondeur. (normalement, c'est encore en test vu que je n'ai pas de back)
- **Les filtres**: Il y a 3 menus déroulants (Select) avec des gradient rose: un pour le type d'IA, un pour le pays, un pour le statut. Ils deviennent plus brillants avec le hover.
- **La pagination**: En bas, il y a des boutons pour passer d'une page à l'autre. Le bouton de la page actuelle a un dégradé rose-violet, les autres sont gris.(normalement (encore) n'ayant pas plusieurs vidéo, impossible de savoir si ce que j'ai fait marche réelement)
- **Animations**: Tout s'affiche progressivement quand la page charge (fade in - apparition progressive). Les cartes ont aussi des animations qui les font apparaître avec un délai. (normalement (again))

### JavaScript (Gallery.jsx):
- Charge les vidéos depuis une API (subjective)
- Permet de filtrer par type d'IA, pays ou statut
- Affiche 6 films par page
- Crée dynamiquement les options de filtre à partir des données réelles (subjectivement)


## PAGE PARTICIPATION (Participation.jsx et Participation.css)

### Ce que ça fait en général:
Cette page demande aux utilisateurs d'accepter le règlement avant de s'inscrire. C'est une étape importante avant de participer. (d'après Samy en tout cas ?..)

### CSS (Participation.css):
- **Le fond**: C'est un dégradé noir-gris avec une image de fond (background.png) fixe qui reste en place quand on scrolles.
- **La carte principale**: Il y a une grande box noire avec une bordure blanche au centre. Elle contient le titre "Participez dès maintenant" et un sous-titre.
- **La carte du règlement**: La page affiche une petite carte avec du texte gris clair. Pendant le Hover, elle monte de 5px et a une ombre bleue.
- **La case à cocher**: Il y a une checkbox avec le texte "J'accepte le règlement général". Si on la coches, le bouton "S'inscrire" devient actif (avant c'est gris et désactivé).
- **Le bouton S'inscrire**: Il a un dégradé bleu-violet-rose. Il est grisé si on n'as pas coché la case.
- **La deuxième carte**: En bas, il y a une autre box noire avec un lien pour se connecter si on es déjà inscrit.
- **Responsive**: Sur petits écrans, les éléments se redimensionnent et s'adaptent à la largeur de l'écran.

### JavaScript (Participation.jsx):
- Gère une variable qui suit si on as coché la case
- Rend le bouton "S'inscrire" activé ou désactivé selon la case
- Redirection vers l'inscription seulement si on as accepté


## PAGE SOUMISSION VIDEO (VideoSubmission.jsx et VideoSubmission.css)

### Ce que ça fait en général:
Cette page est un grand formulaire pour soumettre un film à l'événement.

### CSS (VideoSubmission.css):
- **Le fond**: Fond très foncé (bleu très sombre presque noir). 
- **Les sections**: Le formulaire est divisé en 4 grandes sections : Identité du film, Déclaration IA, Livrables, Équipe. Chaque section a un fond gris-bleu foncé avec une bordure grise.
- **Les icônes**: Chaque section a un emoji (🎞️) pour l'identifier facilement.
- **Les inputs**: Les champs de texte et autres inputs ont du texte blanc sur fond sombre. Ils ont des coins arrondis.
- **Les textareas**: Les zones de texte plus grandes pour le synopsis. Il y a un compteur qui montre combien de caractères on as écrit (ex: 150 / 300).
- **Les radios et checkboxes**: Les choix style "génération intégrale" ou "production hybride" sont présentés comme des boutons radio. Les checkboxes sont là pour les accords.
- **L'upload d'image**: Il y a des zones pour uploader une vignette (image du film) et une galerie media. Ils ont des icônes (🖼️) et du texte explicatif.
- **La section équipe**: Il y a des champs pour ajouter les membres de l'équipe un par un. On peux en ajouter plusieurs avec le bouton "+ AJOUTER COLLABORATEUR".
- **Le bouton submit**: En bas, le bouton "FINALISER MA SOUMISSION →" est un dégradé rose-violet. Il est grisé si on n'as pas accepté le certificat.
- **Animation de succès**: Si la soumission réussit, une page s'affiche avec un emoji 🎉.

### JavaScript (VideoSubmission.jsx):
- **Composants réutilisables**: Des composants petits comme FormInput et FormTextarea pour pas répéter le code
- **Gestion du formulaire**: Stocke toutes les infos du formulaire dans une variable (state)
- **Ajout d'équipe dynamique**: On peux ajouter autant de collaborateurs que on veux
- **Galerie média**: 3 champs pour ajouter des images
- **Validation**: Le formulaire ne peut pas être envoyé si la checkbox "Je certifie" n'est pas cochée
- **Envoi**: Quand on envoies, ça va chercher à la base de données et affiche un message de succès (pas encore implémenter)
- **Compteur de caractères**: Pour le synopsis, montre combien on as écrit sur le max autorisé

