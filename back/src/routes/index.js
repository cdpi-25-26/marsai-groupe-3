import express from "express";
import userRouter from "./User.route.js";
import videoRouter from "./Video.route.js";
import authRouter from "./Auth.route.js";
import healthRouter from "./Health.route.js";
import adminRouter from "./Admin.route.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/videos", videoRouter);
router.use("/health", healthRouter);
router.use("/admin", adminRouter);

export default router;
