import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Video = sequelize.define("Video", {
  // 01. IDENTITÉ DU FILM
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  titleEnglish: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER, // durée en secondes
    allowNull: false,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  synopsisOriginal: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  synopsisEnglish: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  // 02. DÉCLARATION USAGE DE L'IA
  classification: {
    type: DataTypes.ENUM('generation_integrale', 'production_hybride'),
    allowNull: false,
  },
  techStack: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  methodology: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  // 03. LIVRABLES & ACCESSIBILITÉ
  youtubeLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hasSubtitles: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  thumbnail: {
    type: DataTypes.STRING, // URL de la vignette
    allowNull: true,
  },
  mediaGallery: {
    type: DataTypes.JSON, // Array d'URLs
    allowNull: true,
  },
  
  // 04. COMPOSITION DE L'ÉQUIPE (stocké en JSON)
  team: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  
  // STATUT
  status: {
    type: DataTypes.ENUM('draft', 'submitted', 'approved', 'rejected'),
    defaultValue: 'draft',
  },
});

export default Video;
