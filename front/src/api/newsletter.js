import instance from "./config.js";

async function subscribeToNewsletter(email) {
  return await instance.post("api/newsletter", { email });
}

export { subscribeToNewsletter };