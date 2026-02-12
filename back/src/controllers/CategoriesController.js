import { Categories } from "../models/index.js";

function getCategories(req, res) {
  Categories.findAll().then((categories) => {
    res.json(categories);
  });
}

function createCategory(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  Categories.findOne({ where: { name } }).then((category) => {
    if (category) {
      res.json(category);
    } else {
      Categories.create({ name: name }).then((newCategory) => {
        res.status(201).json(newCategory);
      });
    }
  });
}

function deleteCategory(req, res) {
  const { id } = req.params;
  Categories.destroy({ where: { id } }).then(() => {
    res.status(204).json({ message: "Catégorie supprimée" });
  });
}

export default { getCategories, createCategory, deleteCategory };