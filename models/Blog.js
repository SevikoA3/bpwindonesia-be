import { DataTypes } from "sequelize";
import sequelize from "../util/db.js";

const Blog = sequelize.define("Blog", {
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  coverImage: { type: DataTypes.STRING },
  uploadDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export default Blog;
