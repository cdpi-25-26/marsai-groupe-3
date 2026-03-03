import express from "express";
import ReservationController from "../controllers/ReservationController.js";

const reservationRouter = express.Router();

reservationRouter.post("/", ReservationController.create);

export default reservationRouter;
