import { Router } from "express";
import { sendMessage, getMessages, getChatDetails, addReaction, editMessage, deleteMessage, replyToMessage, forwardMessage, getGroups, createGroup } from "../controllers/messageController";

const router = Router();


router.post("/:chatId", sendMessage);
router.get("/groups", getGroups);
router.post("/groups/create", createGroup);

router.get("/:chatId", getMessages); 

router.get("/chat-details", getChatDetails); 

router.patch("/reaction/:messageId", addReaction);

router.patch("/edit/:messageId", editMessage);

router.delete("/delete/:messageId", deleteMessage);

router.post("/reply/:chatId/:messageId", replyToMessage);

router.post("/forward/:fromMessageId/:toChatId", forwardMessage); 

export default router;
