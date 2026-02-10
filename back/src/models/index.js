import Users from "./Users.js";
import Videos from "./Videos.js";
import Evaluations from "./Evaluations.js";
import Reservations from "./Reservations.js";
import Evenements from "./Evenements.js";
import Collaborateurs from "./Collaborateurs.js";
import Categories from "./Categories.js";



//Associations
Users.hasMany(Evaluations, { foreignKey: "id_user", onDelete: "CASCADE" });
Evaluations.belongsTo(Users, { foreignKey: "id_user" });

Videos.hasMany(Evaluations, { foreignKey: "id_video", onDelete: "CASCADE" });
Evaluations.belongsTo(Videos, { foreignKey: "id_video" });  
Users.hasMany(Reservations, { foreignKey: "id_user", onDelete: "CASCADE" });
Reservations.belongsTo(Users, { foreignKey: "id_user" });

Evenements.hasMany(Reservations, { foreignKey: "id_evenement", onDelete: "CASCADE" });
Reservations.belongsTo(Evenements, { foreignKey: "id_evenement" });

Videos.belongsToMany(Categories, { through: "FilmCategories", foreignKey: "id_video" });
Categories.belongsToMany(Videos, { through: "FilmCategories", foreignKey: "id_categorie" });

Videos.belongsToMany(Collaborateurs, { through: "Collaborateur_video", foreignKey: "id_video" });
Collaborateurs.belongsToMany(Videos, { through: "Collaborateur_video", foreignKey: "id_collaborateur" });

export { Users, Videos, Evaluations, Reservations, Evenements, Collaborateurs, Categories};