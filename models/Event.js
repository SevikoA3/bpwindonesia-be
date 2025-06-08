import { DataTypes } from "sequelize";
import sequelize from "../util/db.js";
import User from "./User.js";

const Event = sequelize.define("Event", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  eventDate: { type: DataTypes.DATE, allowNull: false },
  registrationStart: { type: DataTypes.DATE, allowNull: false },
  registrationEnd: { type: DataTypes.DATE, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  coverImage: { type: DataTypes.STRING },
});

export default Event;
