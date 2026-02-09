import express from "express";
import userRouter from "./User.route.js";
import videoRouter from "./Film.route.js";
import authRouter from "./Auth.route.js";
import healthRouter from "./Health.route.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/videos", videoRouter);
router.use("/health", healthRouter);

export default router;
