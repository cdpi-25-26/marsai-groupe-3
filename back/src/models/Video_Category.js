import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Video_Category = sequelize.define("Video_Category", {
    id_video: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        foreignKey: true,
    },
    id_categorie: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        foreignKey: true,
    }
});

export default Video_Category;