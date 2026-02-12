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

export default { getAwards, createAward };

