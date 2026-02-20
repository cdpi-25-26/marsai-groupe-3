import { Users } from "../models/index.js";
import { hashPassword } from "../utils/password.js";
console.log("JE SUIS DANS LE BON CONTROLLER");
console.log("USER CONTROLLER LOADED");


// Liste
function getUsers(req, res) {
  Users.findAll().then((users) => {
    res.json(users);
  });
}

// Création
function createUser(req, res) {
  const { email, password, role, name, surname, birthdate } = req.body;

  if (!email || !password || !role || !name || !surname || !birthdate) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  Users.findOne({ where: { email } }).then(async (user) => {
    if (user) {
      return res.json({ message: "Utilisateur déjà existant", user });
    }

    const hash = await hashPassword(password);

    Users.create({
      email,
      password: hash,
      role,
      name,
      surname,
      birthdate
    })
      .then((newUser) => {
        res.status(201).json({ message: "Utilisateur créé", newUser });
      })
      .catch((error) => {
        console.log("ERREUR CREATE :", error);
        res.status(500).json({ error: error.message });
      });
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
  const { email, password, role } = req.body;

  Users.findOne({ where: { id } }).then((user) => {
    if (user) {
      user.email = email || user.email;
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

function updateRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  Users.findByPk(id).then((user) => {
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    user.role = role;
    user.save().then((updatedUser) => {
      res.json({ message: "Rôle mis à jour", updatedUser });
    });
  });
}


// Récupérer un utilisateur par ID
function getUserById(req, res) {
  const { id } = req.params;
  Users.findOne({ where: { id } }).then((user) => {
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé" });
    }
  });
}

function findUserByEmail(email) {
  return Users.findOne({ where: { email } });
}

export default {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserById,
  findUserByEmail,
  updateRole
};