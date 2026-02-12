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

export default { getEvaluations, createEvaluation };