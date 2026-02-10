import { DataTypes, JSONB } from "sequelize";
import sequelize from "../db/connection.js";

const Collaborator = sequelize.define("Collaborator", {
    id_collaborator: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    civility: {
        type: DataTypes.ENUM("M.", "Mme",),
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 100],
        },
    },
    name: {
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
    job: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [2, 100],
        },
    }
});

export default Collaborator;