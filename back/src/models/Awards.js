import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";


const Awards = sequelize.define("Awards", {
    name_Award: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
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

export default Awards;