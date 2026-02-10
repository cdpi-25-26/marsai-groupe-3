import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Reservations = sequelize.define("Reservations", {
    id_reservation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    id_event: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

export default Reservations;