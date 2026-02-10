import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Videos = sequelize.define("Videos", {
  id_video: {
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
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  FirstLanguage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  synopsis: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  synopsisEnglish: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  YoutubeLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subTitles: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  toolsAI: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
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

export default Videos;
