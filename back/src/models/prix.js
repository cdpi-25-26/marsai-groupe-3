import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Prix = sequelize.define("Prix", {
    name_prize: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,   
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    year_edition: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    id_video: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
    }
});

export default Prix;