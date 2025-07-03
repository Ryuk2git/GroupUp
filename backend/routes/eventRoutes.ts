import express from "express";
import { createEvent, getAllEvents, updateEvent, deleteEvent } from "../controllers/eventController"; 

const router = express.Router();

router.get("/", getAllEvents);
router.post("/", createEvent);
router.put("/:eventId", updateEvent);
router.delete("/:eventId", deleteEvent);

export default router;
