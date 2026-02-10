import express from "express";
import VideoController from "../controllers/VideoController.js";

const videoRouter = express.Router();

videoRouter.get("/", VideoController.getVideos); // Admin
videoRouter.post("/", VideoController.createVideo); // Admin

videoRouter.post("/upload", (req, res) => {
  // Code à faire
  res.send("Upload de video en cours...");
}); // User

export default videoRouter;