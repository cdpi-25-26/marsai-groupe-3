import { Reservations, Event } from "../models/index.js";

// Controller handling workshop reservations coming from the public site
const ReservationController = {
  async create(req, res) {
    const { surname, name, email, id_event } = req.body;

    // Basic validation before hitting the database
    if (!surname || !name || !email) {
      return res.status(400).json({ error: "surname, name and email are required" });
    }

    try {
      // fallback: attach to an existing event or create a placeholder to satisfy FK/NOT NULL
      let targetEventId = id_event ?? null;
      if (!targetEventId) {
        const [event] = await Event.findOrCreate({
          where: { title: "Programme 2026 - Workshops" },
          defaults: {
            description: "Placeholder event for workshop reservations",
            date: new Date("2026-06-13T12:00:00Z"),
            location: "Marseille",
            type: "Workshop",
          },
        });
        targetEventId = event.id_event;
      }

      const reservation = await Reservations.create({
        surname,
        name,
        email,
        id_event: targetEventId,
      });

      return res.status(201).json(reservation);
    } catch (error) {
      console.error("Error while creating reservation:", error?.message || error);
      return res.status(500).json({
        error: "Unable to save reservation",
        detail: error?.message || "unknown error",
      });
    }
  },
};

export default ReservationController;
