import { Router } from "express";
import { getFriends } from "../controllers/friendsController";

const router = Router();

// Route to fetch friends for a given userId
router.get("/friends", getFriends); // returns fried: userName, emailId, userId, pfpRoute

// addFriend
// getPendingRequests
// acceptRequest
// rejectrequest
// Unfreind friend
// search Friends
// getStatus?

export default router;
