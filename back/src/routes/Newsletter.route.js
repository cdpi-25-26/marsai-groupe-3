import express from "express";
import contactController from "../controllers/ContactController.js";

const router = express.Router();

router.post("/newsletter", contactController.addContact);

export default router;