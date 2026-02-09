import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const video_category = sequelize.define("Video_Category", {
    id_video: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
        foreignKey: true,
    },
    id_category: {  
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
        foreignKey: true,
    },
});

export default video_category;

