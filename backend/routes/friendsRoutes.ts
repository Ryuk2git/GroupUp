import { Router } from "express";
import { approveFriendRequest, getFriends, sendFriendRequest } from "../controllers/friendsController";

const router = Router();

// Route to fetch friends for a given userId
router.get("/", getFriends); // returns fried: userName, emailId, userId, pfpRoute

router.post("/request", sendFriendRequest);

router.put("/accept", approveFriendRequest);

// getPendingRequests
// rejectrequest
// Unfreind friend
// search Friends
// getStatus?

export default router;
