import { Router } from "express";
import userRouter from "./user.js";
import blogRouter from "./blog.js";
import eventRouter from "./event.js";
import rsvpRouter from "./rsvp.js";

const router = Router();

router.use("/users", userRouter);
router.use("/blogs", blogRouter);
router.use("/events", eventRouter);
router.use("/rsvps", rsvpRouter);

export default router;
