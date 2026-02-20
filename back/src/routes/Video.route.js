import express from "express";
import VideoController from "../controllers/VideoController.js";

const videoRouter = express.Router();

videoRouter.get("/", VideoController.getVideos);
videoRouter.post("/", VideoController.createVideo);
videoRouter.put("/:id/assign", VideoController.assignVideoToUser);

videoRouter.post("/upload", (req, res) => {
  res.send("Upload de video en cours...");
});

export default videoRouter;
