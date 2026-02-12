import { Reservation } from "../models/index.js";

function getReservations(req, res) {
  Reservation.findAll().then((reservations) => {
    res.json(reservations);
  });
}

function createReservation(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  Reservation.findOne({ where: { name } }).then((reservation) => {
    if (reservation) {
      res.json(reservation);
    } else {
      Reservation.create({ name: name }).then((newReservation) => {
        res.status(201).json(newReservation);
      });
    }
  });
}
function deleteReservation(req, res) {  
   const { id } = req.params;
   Reservation.destroy({ where: { id } }).then(() => {
     res.status(204).json({ message: "Réservation supprimée" });
    });
  }
function updateReservation(req, res) {
    const { id } = req.params; const { name } = req.body; 
    if (!name) { return res.status(400).json({ error: "Tous les champs sont requis" });
        } Reservation.findByPk(id).then((reservation) => { if (reservation) { reservation.update({ name }).then((updatedReservation) => { res.json(updatedReservation); }); } 
    else { res.status(404).json({ error: "Réservation non trouvée" }); } }); }


export default { getReservations, createReservation, deleteReservation, updateReservation };