import { Collaborator } from "../models/index.js";

function getCollaborators(req, res) {
  Collaborator.findAll().then((collaborators) => {
    res.json(collaborators);
  });
}

function createCollaborator(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  Collaborator.findOne({ where: { name } }).then((collaborator) => {
    if (collaborator) {
      res.json(collaborator);
    } else {
      Collaborator.create({ name: name }).then((newCollaborator) => {
        res.status(201).json(newCollaborator);
      });
    }
  });
}

export default { getCollaborators, createCollaborator };