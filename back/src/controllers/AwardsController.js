import {Awards} from "../models/index.js";

function getAwards(req, res) {
  Awards.findAll().then((awards) => {
    res.json(awards);
  });
}

function createAward(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  Awards.findOne({ where: { name } }).then((award) => {
    if (award) {
      res.json(award);
    } else {
      Awards.create({ name: name }).then((newAward) => {
        res.status(201).json(newAward);
      });
    }
  });
}
function deleteAward(req, res) {
   const { id } = req.params;
   Awards.destroy({ where: { id } }).then(() => {
     res.status(204).json({ message: "Prix supprimé" });
    });
  }
function updateAward(req, res) {
const { id } = req.params; const { name } = req.body; if (!name) { return res.status(400).json({ error: "Tous les champs sont requis" }); } Awards.findByPk(id).then((award) => { if (award) { award.update({ name }).then((updatedAward) => { res.json(updatedAward); }); } else { res.status(404).json({ error: "Prix non trouvé" }); } }); }

function asignAwardToVideo(req, res) {const { awardId, videoId } = req.params; Awards.findByPk(awardId).then((award) => { if (!award) { return res.status(404).json({ error: "Prix non trouvé" }); } award.setVideo(videoId).then(() => { res.json({ message: "Prix attribué à la vidéo avec succès" }); }); }); }  

export default { getAwards, createAward, deleteAward, updateAward, asignAwardToVideo };
