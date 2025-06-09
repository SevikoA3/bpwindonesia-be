import { Router } from "express";
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../controllers/eventController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const eventRouter = Router();

eventRouter.get("/", verifyToken, getEvents);
eventRouter.get("/:id", verifyToken, getEventById);
eventRouter.post("/", verifyToken, createEvent);
eventRouter.put("/:id", verifyToken, updateEvent);
eventRouter.delete("/:id", verifyToken, deleteEvent);

export default eventRouter;
