import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Evaluation = sequelize.define("Evaluation", {
    id_evaluation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    note: {
        type: DataTypes.ENUM("OUI", "NON"),
        allowNull: false,
    },
    commentary: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_video: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "id_film",
    },
}, {
    indexes: [
        {
            unique: true,
            fields: ["id_user", "id_film"],
        },
    ],
});

export default Evaluation;
