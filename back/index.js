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

async function syncDatabase() {
  const useAlter = process.env.SEQUELIZE_SYNC_ALTER === "true";

  try {
    await sequelize.sync(useAlter ? { alter: true } : undefined);
    console.log(`La base de données est synchronisée${useAlter ? " (alter actif)" : ""}.`);
  } catch (error) {
    console.error("Erreur de synchronisation Sequelize:", error?.message || error);
  }
}

syncDatabase();

console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME);

app.get("/", (req, res) => {
  res.send("API Marsai OK ✅");
});


app.get("/", (req, res) => {
res.json({ message: "✅ API Email opérationnelle" });
});
if (process.env.BREVO_API_KEY) {
  console.log("Clé API Brevo chargée avec succès.");
} else {
  console.warn("⚠️ Clé API Brevo manquante. Les fonctionnalités d'email ne fonctionneront pas.");
}