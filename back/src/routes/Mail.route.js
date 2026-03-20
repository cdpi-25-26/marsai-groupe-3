// src/routes/mailRoutes.js
import express from "express";
import mailController from "../controllers/mailController.js";
const router = express.Router();
// POST /mail/video/reject → Email de rejet
router.post("/video/reject", mailController.sendVideoReject);
// POST /mail/video/accept → Email d'acceptation
router.post("/video/accept", mailController.sendVideoAccept);
// POST /mail/welcome → Email de bienvenue
router.post("/welcome", mailController.sendWelcome);
export default router;