import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Evaluation = sequelize.define("Evaluation", {
    id_evaluation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    note: {
        type: DataTypes.ENUM("OUI", "à discuter", "NON"),
        allowNull: false,
    },
    commentary: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_film: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default Evaluation;
