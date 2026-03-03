import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";
import { configDotenv } from "dotenv";
import sequelize from "./src/db/connection.js";
import path from "path";

configDotenv(); // Charger les variables d'environnement depuis le fichier .env

const app = express(); // Créer une application Express

app.use(cors({ origin: "*" })); // Autoriser les requêtes CORS de toutes origines
app.use(express.json());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

const PORT = process.env.PORT || 3000; // Définir le port du serveur

app.use("/", router);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log("-----------------------------");
  console.log("--        L'ARBITRE        --");
  console.log("-----------------------------");

  console.log(`Le serveur est lancé sur http://localhost:${PORT}`);
});

sequelize.sync({ alter: true }).then(() => {
  console.log("La base de données est synchronisée.");
});

console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME);

app.get("/", (req, res) => {
  res.send("API Marsai OK ✅");
});