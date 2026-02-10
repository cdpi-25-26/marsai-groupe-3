import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Collaborateur = sequelize.define("Collaborateur", {
    id_collaborateur: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    civilite: {
        type: DataTypes.ENUM("M.", "Mme",),
        allowNull: false,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 100],
        },
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 100],
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
            len: [5, 255],
        },
    },
    profession: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [2, 100],
        },
    }
});

export default Collaborateur;