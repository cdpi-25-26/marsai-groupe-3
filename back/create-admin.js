import { hashPassword } from "./src/utils/password.js";
import Users from "./src/models/Users.js";
import sequelize from "./src/db/connection.js";

async function createAdmin() {
  await sequelize.sync();
  const email = "admin@marsai.local";
  const password = "Admin12345!";
  const hash = await hashPassword(password);

  const [user, created] = await Users.findOrCreate({
    where: { email },
    defaults: {
      surname: "admin",
      name: "admin",
      email,
      password: hash,
      birthdate: "2000-01-01",
      role: "ADMIN",
    },
  });

  if (created) {
    console.log("Admin créé :", email);
  } else {
    console.log("Admin déjà existant :", email);
  }
  process.exit(0);
}

createAdmin();
