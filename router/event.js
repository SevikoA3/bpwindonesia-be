import { Router } from "express";
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../controllers/eventController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/multer.js";

const eventRouter = Router();

eventRouter.get("/", verifyToken, getEvents);
eventRouter.get("/:id", verifyToken, getEventById);
eventRouter.post("/", verifyToken, upload.single("coverImage"), createEvent);
eventRouter.put("/:id", verifyToken, upload.single("coverImage"), updateEvent);
eventRouter.delete("/:id", verifyToken, deleteEvent);

export default eventRouter;
