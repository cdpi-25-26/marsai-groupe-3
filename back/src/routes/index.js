import express from "express";
import userRouter from "./User.route.js";
import videoRouter from "./Video.route.js";
import authRouter from "./Auth.route.js";
import healthRouter from "./Health.route.js";
import reservationRouter from "./Reservation.route.js";
import juryMembersRouter from "./JuryMembers.route.js";

const router = express.Router();


router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/videos", videoRouter);
router.use("/jury-members", juryMembersRouter);
router.use("/health", healthRouter);
router.use("/reservations", reservationRouter);

export default router;
