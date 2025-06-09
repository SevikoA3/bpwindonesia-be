import { DataTypes } from "sequelize";
import sequelize from "../util/db.js";
import MembershipType from "./MembershipType.js";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  refreshToken: { type: DataTypes.TEXT, allowNull: true },
  role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
  profile_pic_url: { type: DataTypes.STRING, allowNull: true },
  fullName: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  birthDate: { type: DataTypes.DATEONLY, allowNull: true },
  domicile: { type: DataTypes.STRING, allowNull: true },
  position: { type: DataTypes.STRING, allowNull: true },
  institution: { type: DataTypes.STRING, allowNull: true },
  industry: { type: DataTypes.STRING, allowNull: true },
});

export default User;
