import express from "express";
import FilmController from "../controllers/FilmController.js";

const filmRouter = express.Router();

filmRouter.get("/", FilmController.getFilms); // Admin
filmRouter.post("/", FilmController.createFilm); // Admin

filmRouter.post("/upload", (req, res) => {
  // Code à faire
  res.send("Upload de film");
}); // User

export default filmRouter;