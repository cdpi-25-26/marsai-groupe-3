# Explicado - Recapitulatif des ajouts et realisations

## 1. Vue d'ensemble
Le projet est maintenant organise autour de 3 parcours principaux:
- parcours public (pages vitrines, galerie, detail film, programme, participation)
- parcours utilisateur connecte (auth + soumission video)
- parcours staff (jury + administration)

Le front est en React/Vite et le back en Express + Sequelize.

## 2. Parcours public (front)

### Home
- Landing page en sections (hero, objectifs, conferences, soiree, lieu, chiffres, partenaires).
- Ajout d'une carte Google Maps integree (iframe) pour localiser La Plateforme.
- Mise en forme responsive (desktop/tablette/mobile).

### Navbar
- Navigation principale responsive.
- Menu burger mobile.
- Gestion de la fermeture automatique du menu apres clic.

### Gallery publique
- Affichage des videos exposees au public.
- Cartes video avec statut, vignette, et lien vers le detail.
- Page conditionnee par l'etat "galerie publique ouverte" (controle admin).

### FilmDetail
- Page detail d'un film via `/films/:id`.
- Lecture media (YouTube embed ou video locale), infos techniques, synopsis FR/EN, votes jury, equipe, commentaires.
- Gestion des etats de chargement/erreur et bouton retour intelligent.

### Programme
- Affichage du planning de conference + ateliers.
- Modal de reservation avec participants multiples.
- Envoi des reservations vers l'API.
- Carte Google Maps et bloc acces (transports, voiture, adresse).

### Jury (page publique)
- Section president du jury + presentation narrative.
- Carousel auto des membres du jury (avec pause au hover).
- Fallback local si l'API jury ne renvoie rien.
- Texte bilingue via contexte langue (`useLanguage`).

## 3. Authentification et roles

### Auth
- Connexion/inscription connectees au back.
- Stockage local des informations de session (`token`, `role`, etc.).
- Correction de la deconnexion avec purge complete de session locale.

### Protection des routes
- `RoleGuard` cote front pour restreindre l'acces selon le role.
- Roles utilises: `ADMIN`, `JURY`, `PRODUCER`.

## 4. Soumission video (front + back)

### Front - VideoSubmission
- Formulaire complet en 4 sections:
  - identite du film
  - declaration d'usage IA
  - livrables/accessibilite
  - composition de l'equipe
- Verification: utilisateur connecte obligatoire.
- Verification: au moins un media principal requis (lien YouTube ou fichier video).
- Upload video via `multipart/form-data` si fichier fourni.
- Soumission finale du payload normalise vers l'API.
- Ecran de succes apres envoi.

### Back - Upload et submit
- Route upload protegee: `POST /videos/upload`.
- Stockage local des videos dans `uploads/videos` via `multer`.
- Route soumission protegee: `POST /videos/submit`.
- Mapping des champs front vers le modele `Videos` (titre, duree, langue, synopsis, classification, media, equipe, etc.).

## 5. Workflow de moderation video (admin + jury)

Le workflow est maintenant structure en phases:
- `soumis` -> video envoyee par un utilisateur.
- `retenue` -> validee par l'admin pour passage jury (phase 1).
- `a discuter` -> au moins un vote jury recu (phase 2).
- `finaliste` -> selection Top 50 par l'admin (phase 3).
- `refuse` -> rejet admin.

## 6. Espace jury

### JuryGallery
- Endpoint dedie: `GET /videos/jury`.
- Affiche les videos `retenue`.
- Un compte `JURY` peut voter `OUI` ou `NON` avec commentaire optionnel.
- Endpoint vote: `POST /videos/:id/jury-vote`.
- Apres premier vote jury, la video passe automatiquement en `a discuter`.
- Les comptes non-jury sont en lecture seule.

## 7. Espace administration

### AdminLayout
- Sidebar de navigation admin.
- Conservation de la navbar principale pour coherence de navigation.

### Users admin
- Liste utilisateurs (ID, email, nom, prenom, role).
- Recherche, filtre par role, tri.
- Creation/modification/suppression utilisateur.
- Recuperation dynamique des roles disponibles depuis l'API.
- Gestion des erreurs d'acces (ex: compte non admin).

### Videos admin
- Liste de toutes les videos avec apercu et lien detail.

### AdminGallery
- Pilotage complet des phases 1/2/3.
- Decisions admin phase 1: valider (`eligible`) ou refuser (`rejected`).
- Phase 2: ajouter/retenir du Top 50.
- Phase 3: marquer/demarquer une video primee.
- Suppression video cote admin.
- Toggle ouverture/fermeture galerie publique (`videos/public-status`).
- Section dediee des videos refusees avec contexte de refus.

## 8. API videos principales
- `GET /videos` -> videos publiques selon etat de la galerie.
- `GET /videos/public-status` -> etat d'ouverture galerie publique.
- `PATCH /videos/public-status` -> admin ouvre/ferme la galerie publique.
- `GET /videos/admin` -> liste complete pour administration.
- `GET /videos/jury` -> liste pour vote jury.
- `GET /videos/:id` -> detail d'une video.
- `POST /videos/upload` -> upload fichier video.
- `POST /videos/submit` -> soumission complete.
- `PATCH /videos/:id/admin-eligibility` -> decision admin en phase 1.
- `PATCH /videos/:id/phase2-selection` -> passage phase 2 <-> phase 3.
- `PATCH /videos/:id/phase3-award` -> marquage prime.
- `DELETE /videos/:id` -> suppression admin.
- `POST /videos/:id/jury-vote` -> vote jury.

## 9. Normalisation des donnees video
Le controller video renvoie maintenant un format front unique et coherent:
- identifiants et metadonnees (titre, statut, duree, langue)
- infos IA (classification, tech stack, methodologie)
- medias (youtube, thumbnail, galerie)
- vote summary (`yesVotes`, `noVotes`, `comments`)
- equipe (`team`) parsee depuis les donnees stockees

## 10. Internationalisation
- Utilisation du contexte langue (`useLanguage`) sur les pages majeures.
- Textes FR/EN sur pages publiques, jury, admin et formulaires principaux.

## 11. Comptes de test
- test: `authtest@gmail.com` / `Password123!`
- admin: `admin@gmail.com` / `Admin123!`
- jury: `Jury@gmaiL.com` / `Jury123!`
- producer: `Prod@gmail.com` / `Prod123!`

## 12. Etat actuel
- Flux principal en place de bout en bout:
  - utilisateur connecte -> soumission video -> moderation admin -> vote jury -> selection finale -> publication publique
- Base technique prete pour les evolutions (assignation fine jury, scoring avance, analytics, etc.).
