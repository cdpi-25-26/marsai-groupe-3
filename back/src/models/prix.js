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
        type: DataTypes.YEAR,
        allowNull: false,
    },
    id_film: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

export default Prix;