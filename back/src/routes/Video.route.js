import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import VideoController from "../controllers/VideoController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const videoRouter = express.Router();

const uploadDirectory = path.resolve(process.cwd(), "uploads", "videos");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    fs.mkdirSync(uploadDirectory, { recursive: true });
    callback(null, uploadDirectory);
  },
  filename: (req, file, callback) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    callback(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
});

videoRouter.get("/", VideoController.getPublicVideos);
videoRouter.get("/public-status", VideoController.getPublicGalleryStatus);
videoRouter.patch(
  "/public-status",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  VideoController.setPublicGalleryStatus,
);
videoRouter.get("/admin", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), VideoController.getAdminVideos);
videoRouter.get("/jury", (req, res, next) => AuthMiddleware(req, res, next, ["JURY", "ADMIN"]), VideoController.getJuryVideos);
videoRouter.get("/:id", VideoController.getVideoById);

videoRouter.post("/", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), VideoController.createVideo);

videoRouter.post(
  "/upload",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN", "JURY", "PRODUCER"]),
  upload.single("video"),
  VideoController.uploadVideo,
); // User

videoRouter.post(
  "/submit",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN", "JURY", "PRODUCER"]),
  VideoController.submitVideo,
); // User - Soumission complète

videoRouter.patch(
  "/:id/admin-eligibility",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  VideoController.setAdminEligibility,
);

videoRouter.patch(
  "/:id/phase3-award",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  VideoController.setPhase3Award,
);

videoRouter.patch(
  "/:id/phase2-selection",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  VideoController.setPhase2Selection,
);

videoRouter.patch(
  "/:id/phase3-priority",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  VideoController.setPhase3Award,
);

videoRouter.delete(
  "/:id",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  VideoController.deleteAdminVideo,
);

videoRouter.post(
  "/:id/jury-vote",
  (req, res, next) => AuthMiddleware(req, res, next, ["JURY"]),
  VideoController.juryVote,
);

export default videoRouter;