import { Router } from "express";
import { getFriends } from "../controllers/friendsController";

const router = Router();

// Route to fetch friends for a given userId
router.get("/friends", getFriends);

export default router;
