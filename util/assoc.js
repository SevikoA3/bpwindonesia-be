import db from "./db.js";
import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Event from "../models/Event.js";
import RSVP from "../models/RSVP.js";

const association = async () => {
  try {
    // User - Blog
    User.hasMany(Blog, { foreignKey: "authorId", as: "userBlogs" });
    Blog.belongsTo(User, { foreignKey: "authorId", as: "blogAuthor" });

    // User - Event
    User.hasMany(Event, { foreignKey: "creatorId", as: "userEvents" });
    Event.belongsTo(User, { foreignKey: "creatorId", as: "eventCreator" });

    // User <-> Event (RSVP)
    User.belongsToMany(Event, {
      through: RSVP,
      foreignKey: "userId",
      otherKey: "eventId",
      as: "userRSVPs",
    });
    Event.belongsToMany(User, {
      through: RSVP,
      foreignKey: "eventId",
      otherKey: "userId",
      as: "eventAttendees",
    });

    // await db.sync({ force: true });
    await db.sync();
  } catch (error) {
    console.log(error.message);
  }
};

export default association;
