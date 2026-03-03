import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const SystemSettings = sequelize.define("SystemSettings", {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  isEnabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

export default SystemSettings;