import express from "express";
import * as admin from "../controllers/AdminController.js";

const router = express.Router();

router.get("/users", admin.getAllUsers);
router.put("/users/:id/role", admin.updateUserRole);

router.get("/videos", admin.getAllVideos);
router.get("/videos/:id", admin.getVideoById);
router.delete("/videos/:id", admin.deleteVideo);

router.post("/assign", admin.assignVideoToJury);
router.delete("/assign", admin.removeVideoFromJury);

router.get("/jury/:id_user/videos", admin.getJuryVideos);
router.get("/video/:id_video/jurys", admin.getVideoJurys);


export default router;
