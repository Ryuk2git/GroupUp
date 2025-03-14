import { Request, Response } from "express";
import { VoiceChannel } from "../models/voiceChannel";

export const getVoiceChannel = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;
  console.log(userId);

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }
  try {
    const channels = await VoiceChannel.findAll();
    
    if (channels.length === 0) {
        res.status(200).json({ message: "No Voice Channels found" });
        return;
      }
    
    res.status(200).json(channels);
    return;
  } catch (error) {
    console.error("Error fetching Voice Channel:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
