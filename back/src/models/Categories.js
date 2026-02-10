import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";


const Categories = sequelize.define("Categories", {
    id_categorie: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
});

export default Categories;