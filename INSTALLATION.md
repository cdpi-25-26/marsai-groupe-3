# Installation et lancement

## Ce dont tu as besoin

- Node.js installé
- MySQL qui tourne (via WAMP ou autre)
- Deux terminaux ouverts

## Démarrage rapide

### Backend

Ouvre un terminal et lance :

```bash
cd back
npm install
npm start
```

Le backend va tourner en local, probablement sur le port 3000 ou celui défini dans ton .env.

### Frontend

Ouvre un deuxième terminal :

```bash
cd front
npm install
npm start
```

Le site s'ouvre automatiquement sur http://localhost:5173

## En cas de problème

- Vérifie que WAMP est bien démarré
- Regarde que le fichier .env est configuré dans le dossier back
- Si un port est déjà utilisé, change-le dans la config

C'est tout.
