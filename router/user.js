import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/multer.js";

const userRouter = Router();

userRouter.get("/", verifyToken, getUsers);
userRouter.get("/:id", verifyToken, getUserById);
userRouter.put("/:id", verifyToken, upload.single("profile_pic"), updateUser);
userRouter.delete("/:id", verifyToken, deleteUser);
userRouter.post("/", createUser);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

export default userRouter;
