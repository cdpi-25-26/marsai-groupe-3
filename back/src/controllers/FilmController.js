import { Film } from "../models/index.js";

// Liste
function getFilms(req, res) {
  Film.findAll().then((films) => {
    res.json(films);
  });
}

// Création
function createFilm(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  Film.findOne({ where: { title } }).then((film) => {
    if (film) {
      res.json(film);
    } else {
      Film.create({ title: title, description: description }).then(
        (newFilm) => {
          res.status(201).json(newFilm);
        },
      );
    }
  });
}

export default { getFilms, createFilm };