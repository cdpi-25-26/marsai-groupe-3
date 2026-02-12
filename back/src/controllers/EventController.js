import { Event } from "../models/index.js";

function getEvents(req, res) {
  Event.findAll().then((events) => {
    res.json(events);
  });
}

function createEvent(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  Event.findOne({ where: { name } }).then((event) => {
    if (event) {
      res.json(event);
    } else {
      Event.create({ name: name }).then((newEvent) => {
        res.status(201).json(newEvent);
      });
    }
  });
}
function deleteEvent(req, res) {
   const { id } = req.params;
   Event.destroy({ where: { id } }).then(() => {
     res.status(204).json({ message: "Événement supprimé" });
    });
  }

function updateEvent(req, res) {const { id } = req.params; const { name } = req.body; if (!name) { return res.status(400).json({ error: "Tous les champs sont requis" }); } Event.findByPk(id).then((event) => { if (!event) { return res.status(404).json({ error: "Événement non trouvé" }); } event.update({ name }).then((updatedEvent) => { res.json(updatedEvent); }); }); }

export default { getEvents, createEvent, deleteEvent, updateEvent}; 