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
function deleteCollaborator(req, res) {
   const { id } = req.params;
   Collaborator.destroy({ where: { id } }).then(() => {
     res.status(204).json({ message: "Collaborateur supprimé" });
    });
  }

function updateCollaborator(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }
    Collaborator.findByPk(id).then((collaborator) => {
        if (collaborator) {
            collaborator.update({ name }).then((updatedCollaborator) => {
                res.json(updatedCollaborator);
            });
        } else {
            res.status(404).json({ error: "Collaborateur non trouvé" });
        }
    });
}


export default { getCollaborators, createCollaborator, deleteCollaborator}; 