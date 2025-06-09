import { DataTypes } from "sequelize";
import sequelize from "../util/db.js";

const Event = sequelize.define("Event", {
  title: { type: DataTypes.STRING, allowNull: false },
  subTitle: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  coverImage: { type: DataTypes.STRING },
  registrationStart: { type: DataTypes.DATE, allowNull: false },
  registrationEnd: { type: DataTypes.DATE, allowNull: false },
}, {
  timestamps: true // ensure createdAt and updatedAt are managed automatically
});

export default Event;
