import { DataTypes } from "sequelize";
import sequelize from "../util/db.js";

const RSVP = sequelize.define("RSVP", {
  status: {
    type: DataTypes.ENUM("going", "not_going", "maybe"),
    defaultValue: "going",
  },
});

export default RSVP;
