import express from "express";
import JuryMembersController from "../controllers/JuryMembersController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const juryMembersRouter = express.Router();

juryMembersRouter.get("/", JuryMembersController.getJuryMembers);
juryMembersRouter.put(
  "/",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  JuryMembersController.updateJuryMembers,
);

export default juryMembersRouter;
