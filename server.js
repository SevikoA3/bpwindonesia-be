import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./router/index.js";
import association from "./util/assoc.js";
import cookieParser from "cookie-parser";
import seedMembershipTypes from "./util/seedMembershipTypes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://bpwindonesia-fe-938071808488.europe-west1.run.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

const PORT = process.env.PORT || 3000;

association().then(async () => {
  await seedMembershipTypes();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
