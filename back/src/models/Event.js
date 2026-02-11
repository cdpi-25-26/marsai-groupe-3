import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Event = sequelize.define("Event", {
    id_event: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
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
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM("Projection", "Workshop", "Conférence"),
        allowNull: true,
    },
});

export default Event;