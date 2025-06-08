import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import {
  getRSVPs,
  getRSVPById,
  createRSVP,
  updateRSVP,
  deleteRSVP,
} from "../controllers/rsvpController.js";

const router = Router();

// User CRUD
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Blog CRUD
router.get("/blogs", getBlogs);
router.get("/blogs/:id", getBlogById);
router.post("/blogs", createBlog);
router.put("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);

// Event CRUD
router.get("/events", getEvents);
router.get("/events/:id", getEventById);
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

// RSVP CRUD
router.get("/rsvps", getRSVPs);
router.get("/rsvps/:id", getRSVPById);
router.post("/rsvps", createRSVP);
router.put("/rsvps/:id", updateRSVP);
router.delete("/rsvps/:id", deleteRSVP);

export default router;
