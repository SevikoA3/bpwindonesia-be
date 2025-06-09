import { DataTypes } from "sequelize";
import sequelize from "../util/db.js";

const MembershipType = sequelize.define("MembershipType", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

export default MembershipType;
