import instance from "./config.js";

async function createReservation(payload) {
  return await instance.post("reservations", payload);
}

export { createReservation };
