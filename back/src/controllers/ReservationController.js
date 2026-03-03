import { Reservations } from "../models/index.js";

const ReservationController = {
  create: async (req, res) => {
    try {
      const { surname, name, email, id_event = null } = req.body;

      if (!surname || !name || !email) {
        return res.status(400).json({ message: "surname, name et email sont requis" });
      }

      const reservation = await Reservations.create({
        surname,
        name,
        email,
        id_event,
      });

      return res.status(201).json(reservation);
    } catch (error) {
      console.error("Erreur création réservation:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  },
};

export default ReservationController;
