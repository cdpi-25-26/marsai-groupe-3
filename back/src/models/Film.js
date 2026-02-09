import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Film = sequelize.define("Film", {
  id_film: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  traduction: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duree: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  languePrincipale: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  synopsis: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  synopsisAnglais: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lienYoutube: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sousTitres: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  outilIA: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vignette: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image3: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  statusSelection: {
    type: DataTypes.ENUM("soumis", "refusé", "à discuter", "retenue", "finaliste",),
    allowNull: false,
    defaultValue: "soumis",
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Film;
