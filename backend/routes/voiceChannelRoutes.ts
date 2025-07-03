import { Router } from "express";
import { getVoiceChannel } from "../controllers/voiceChannelController";

const router = Router();

// Route to fetch friends for a given userId
router.get("/", getVoiceChannel);

export default router;
