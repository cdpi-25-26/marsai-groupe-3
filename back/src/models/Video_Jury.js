import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Video_Jury = sequelize.define("Video_Jury", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  id_video: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  id_user: { // jury user
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Video_Jury;
