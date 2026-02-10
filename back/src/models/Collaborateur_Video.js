import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Collaborateur_video = sequelize.define("Collaborateur_video", {
    id_collaborateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
    },
    id_video: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
    }
});

export default Collaborateur_video;