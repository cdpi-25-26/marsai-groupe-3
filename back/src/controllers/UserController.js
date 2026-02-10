import { Users } from "../models/index.js";
import { hashPassword } from "../utils/password.js";

// Liste
function getUsers(req, res) {
  Users.findAll().then((users) => {
    res.json(users);
  });
}

// Création
function createUser(req, res) {
  console.log(req);

  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  Users.findOne({ where: { username } }).then(async (user) => {
    if (user) {
      res.json({ message: "Utilisateur déjà existant", user });
    } else {
      const hash = await hashPassword(password);
      Users.create({ username: username, password: hash, role: role }).then(
        (newUser) => {
          res.status(201).json({ message: "Utilisateur créé", newUser });
        },
      );
    }
  });
}

// Suppression
function deleteUser(req, res) {
  const { id } = req.params;
  Users.destroy({ where: { id } }).then(() => {
    res.status(204).json({ message: "Utilisateur supprimé" });
  });
}

// Modification
function updateUser(req, res) {
  const { id } = req.params;
  const { username, password, role } = req.body;

  Users.findOne({ where: { id } }).then((user) => {
    if (user) {
      user.username = username || user.username;
      user.password = password || user.password;
      user.role = role || user.role;

      user.save().then((updatedUser) => {
        res.json(updatedUser);
      });
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé" });
    }
  });
}

// Récupérer un utilisateur par ID
function getUserById(req, res) {
  const { id } = req.params;
  User.findOne({ where: { id } }).then((user) => {
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé" });
    }
  });
}

function findUserByUsername(username) {
  return Users.findOne({ where: { username } });
}

export default {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserById,
  findUserByUsername,
};
