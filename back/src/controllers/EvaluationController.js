import { Evaluation } from "../models/index.js";

function getEvaluations(req, res) {
  Evaluation.findAll().then((evaluations) => {
    res.json(evaluations);
  });
}

function createEvaluation(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  Evaluation.findOne({ where: { name } }).then((evaluation) => {
    if (evaluation) {
      res.json(evaluation);
    } else {
      Evaluation.create({ name: name }).then((newEvaluation) => {
        res.status(201).json(newEvaluation);
      });
    }
  });
}

function deleteEvaluation(req, res) {
   const { id } = req.params;
   Evaluation.destroy({ where: { id } }).then(() => {
     res.status(204).json({ message: "Évaluation supprimée" });
    });
  }

function updateEvaluation(req, res) {const { id } = req.params; const { name } = req.body; if (!name) { return res.status(400).json({ error: "Tous les champs sont requis" }); } Evaluation.findByPk(id).then((evaluation) => { if (evaluation) { evaluation.update({ name }).then((updatedEvaluation) => { res.json(updatedEvaluation); }); } else { res.status(404).json({ error: "Évaluation non trouvée" }); } }); }

export default { getEvaluations, createEvaluation, deleteEvaluation, updateEvaluation };