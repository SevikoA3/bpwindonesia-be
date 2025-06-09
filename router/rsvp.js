import { Router } from "express";
import { getRSVPs, getRSVPById, createRSVP, updateRSVP, deleteRSVP } from "../controllers/rsvpController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const rsvpRouter = Router();

rsvpRouter.get("/", verifyToken, getRSVPs);
rsvpRouter.get("/:id", verifyToken, getRSVPById);
rsvpRouter.post("/", verifyToken, createRSVP);
rsvpRouter.put("/:id", verifyToken, updateRSVP);
rsvpRouter.delete("/:id", verifyToken, deleteRSVP);

export default rsvpRouter;
