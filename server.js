import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./util/db.js";
import router from "./router/index.js";
import association from "./util/assoc.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);

const PORT = process.env.PORT || 3000;

association().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
