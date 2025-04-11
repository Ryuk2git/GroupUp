import { Router } from "express";
import { sendMessage, getMessages, getChatDetails, addReaction, editMessage, deleteMessage } from "../controllers/messageController";

const router = Router();

// Send a new message
router.post("/:chatId", sendMessage);

// Fetch messages for a specific chat
router.get("/:chatId", getMessages); 

// Get chat details (e.g., last message)
router.get("/chat-details", getChatDetails); 

// Add a reaction to a message
router.post("/reaction", addReaction);

// Edit a message
router.put("/edit", editMessage);

// Soft delete a message (for a specific user)
router.put("/delete", deleteMessage);

// TODO: Implement message status update routes
// - Mark as delivered
// - Mark as read

export default router;
