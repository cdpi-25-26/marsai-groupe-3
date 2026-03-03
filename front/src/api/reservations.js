import api from "./config";

export const createReservation = async ({ surname, name, email, id_event = null }) => {
  return api.post("/reservations", { surname, name, email, id_event });
};
