import { Users } from "../models/index.js";
import { hashPassword } from "../utils/password.js";

function getRoleValues() {
  const roleValues = Users.getAttributes?.().role?.values;
  if (Array.isArray(roleValues) && roleValues.length > 0) {
    return roleValues;
  }
  return ["ADMIN", "JURY", "PRODUCER"];
}

async function buildUniqueSurnameFromEmail(email) {
  const localPart = (email?.split("@")[0] || "user").trim();
  const baseSurnameRaw = localPart.length < 2 ? `${localPart}x` : localPart;
  const baseSurname = baseSurnameRaw.slice(0, 90);

  let candidate = baseSurname;
  let index = 1;

  while (true) {
    const existingUser = await Users.findOne({ where: { surname: candidate } });

    if (!existingUser) {
      return candidate;
    }

    index += 1;
    const suffix = `-${index}`;
    const trimmedBase = baseSurname.slice(0, Math.max(2, 100 - suffix.length));
    candidate = `${trimmedBase}${suffix}`;
  }
}

// Liste
function getUsers(req, res) {
  Users.findAll({
    attributes: { exclude: ["password"] },
    order: [["createdAt", "DESC"]],
  }).then((users) => {
    res.json(users);
  });
}

function getAvailableRoles(req, res) {
  res.json(getRoleValues());
}

// Création
async function createUser(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { username, password, role } = req.body;
  const email = username;

  if (!email || !password) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    const user = await Users.findOne({ where: { email } });

    if (user) {
      return res.status(409).json({ error: "Utilisateur déjà existant" });
    }

    const hash = await hashPassword(password);
    const surname = await buildUniqueSurnameFromEmail(email);
    const identifierRaw = (email.split("@")[0] || "user").trim();
    const safeName = (identifierRaw.length < 2 ? `${identifierRaw}x` : identifierRaw).slice(0, 100);

    const newUser = await Users.create({
      surname,
      name: safeName,
      email,
      password: hash,
      birthdate: "2000-01-01",
      role: role || "PRODUCER",
    });

    return res.status(201).json({ message: "Utilisateur créé", newUser });
  } catch (error) {
    if (error?.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Données utilisateur invalides",
        details: error.errors?.map((item) => item.message) || [],
      });
    }

    if (error?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Utilisateur déjà existant" });
    }

    return res.status(500).json({ error: "Erreur lors de la création utilisateur" });
  }
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

  Users.findOne({ where: { id } }).then(async (user) => {
    if (user) {
      user.email = username || user.email;
      user.surname = username || user.surname;
      user.password = password ? await hashPassword(password) : user.password;
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
  Users.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
  }).then((user) => {
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé" });
    }
  });
}

function findUserByUsername(username) {
  return Users.findOne({ where: { email: username } });
}

export default {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserById,
  getAvailableRoles,
  findUserByUsername,
};
