import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Evenement = sequelize.define("Evenement", {
    id_evenement: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 100],
        },
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    lieu: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM("Projection", "Workshop", "Conférence"),
        allowNull: true,
    },
});

export default Evenement;