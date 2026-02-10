import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Collaborator_video = sequelize.define("Collaborator_video", {
    id_collaborator: {
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

export default Collaborator_video;