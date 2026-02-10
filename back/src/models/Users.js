import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Users = sequelize.define("Users", {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [2, 100],
    },
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      len: [5, 255],
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 255],
    },
  },
  tel : {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^[0-9+\-\s]+$/, // Valide les numéros de téléphone avec chiffres, espaces, + et -
      len: [10, 20], // Longueur minimale et maximale pour un numéro de téléphone
    },
  },
  birthdate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  rue : {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [5, 50],
    },
  },
  codePostal : {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [5, 10],
    },
  },
  ville : {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 50],
    },
  },
  pays : {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 50],
    },
  },
  biographie: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 255],
    },
  },
  metier: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 50],
    },
  },
  portfolio: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 50],
    },
  },
  youtube: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 50],
    },
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 50],
    },
  },
  linkedin: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 50],
    },
  },
  facebook: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 50],
    },
  },
  tiktok: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 50],
    },
  },
  role: {
    type: DataTypes.ENUM("ADMIN", "JURY", "PRODUCER"),
    defaultValue: "PRODUCER",
    allowNull: false,
  },
});

export default Users;
