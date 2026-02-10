import Users from "./Users.js";
import Videos from "./Videos.js";
import Evaluations from "./Evaluations.js";
import Reservations from "./Reservations.js";
import Event from "./Event.js";
import Collaborators from "./Collaborators.js";
import Categories from "./Categories.js";
import Collaborator_video from "./Collaborator_Video.js";
import Video_Category from "./Video_Category.js";
import Awards from "./Awards.js";



//Associations
Users.hasMany(Evaluations, { foreignKey: "id_user", onDelete: "CASCADE" });
Evaluations.belongsTo(Users, { foreignKey: "id_user" });

Videos.hasMany(Evaluations, { foreignKey: "id_video", onDelete: "CASCADE" });
Evaluations.belongsTo(Videos, { foreignKey: "id_video" });  
Users.hasMany(Reservations, { foreignKey: "id_user", onDelete: "CASCADE" });
Reservations.belongsTo(Users, { foreignKey: "id_user" });

Event.hasMany(Reservations, { foreignKey: "id_event", onDelete: "CASCADE" });
Reservations.belongsTo(Event, { foreignKey: "id_event" });

Videos.belongsToMany(Categories, { through: Video_Category, foreignKey: "id_video" });
Categories.belongsToMany(Videos, { through: Video_Category, foreignKey: "id_category" });

Videos.belongsToMany(Collaborators, { through: Collaborator_video, foreignKey: "id_video" });
Collaborators.belongsToMany(Videos, { through: Collaborator_video, foreignKey: "id_collaborator" });
export { Users, Videos, Evaluations, Reservations, Event, Collaborators, Categories, Awards, Collaborator_video, Video_Category };