
import { Sequelize } from "sequelize";

import { configDotenv } from "dotenv";

configDotenv(); // Charger les variables d'environnement depuis le fichier .env

const sequelize = new Sequelize(
 process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  },
);


export default sequelize;
