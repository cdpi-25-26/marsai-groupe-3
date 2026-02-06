import User from "./User.js";
import Video from "./Video.js";


//Exemples d'associations : 
/**
 * Associations
 * */
/*User.hasMany(Video, { foreignKey: "userId", as: "videos" });
Video.belongsTo(User, { foreignKey: "userId", as: "user" });
Vote.belongsTo(User, { foreignKey: "userId", as: "user" });
Vote.belongsTo(Video, { foreignKey: "videoId", as: "video" });
User.hasMany(Vote, { foreignKey: "userId", as: "votes" });
Video.hasMany(Vote, { foreignKey: "videoId", as: "votes" });

// Relations N–N
Video.belongsToMany(Category, {
  through: VideoCategory,
  foreignKey: "videoId",
  as: "categories",
});

Category.belongsToMany(Video, {
  through: VideoCategory,
  foreignKey: "categoryId",
  as: "videos",
});

Video.hasMany(Award, { foreignKey: "videoId", as: "awards" });
Award.belongsTo(Video, { foreignKey: "videoId", as: "video" });*/

export { User, Video };
