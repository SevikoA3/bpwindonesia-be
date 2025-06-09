import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./router/index.js";
import association from "./util/assoc.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

const PORT = process.env.PORT || 3000;

association().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
