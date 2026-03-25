import express from "express";
import multer from "multer";
import VideoController from "../controllers/VideoController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const videoRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype?.startsWith("video/")) {
      callback(null, true);
      return;
    }

    callback(new Error("Seuls les fichiers vidéo sont autorisés"));
  },
});

videoRouter.get("/", VideoController.getPublicVideos);
videoRouter.get("/public-status", VideoController.getPublicGalleryStatus);
videoRouter.patch(
  "/public-status",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  VideoController.setPublicGalleryStatus,
);
videoRouter.get("/awarded-status", VideoController.getAwardedGalleryStatus);
videoRouter.patch(
  "/awarded-status",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  VideoController.setAwardedGalleryStatus,
);
videoRouter.get("/awarded", VideoController.getAwardedVideos);
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
  "/youtube/resolve",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN", "JURY", "PRODUCER"]),
  VideoController.resolveYoutube,
);

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