import User from "../models/Users.js";
import { comparePassword } from "../utils/password.js";
import UserController from "./UserController.js";
import jwt from "jsonwebtoken";

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const user = await User.findOne({ where: { email: username } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ username: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    return res.status(200).json({
      message: "Login successful",
      username: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

function register(req, res) {
  UserController.createUser(req, res);
  // Envoi d'email
}

export default { login, register };
