import { Router } from "express";
import { createNotification, getNotifications, markAsReadNotification, deleteAllNotification, deleteNotification } from '../controllers/notificationController'


const router = Router();

// create a notification
router.post('/create', createNotification)

// fetch users notifications
router.get("/:userId", getNotifications);

// mark read
router.patch("/:userId/:notificationId/read", markAsReadNotification);

// delete notification
router.delete("/:userId/:notificationId", deleteNotification);

// delete all notificaitons
router.delete("/:userId", deleteAllNotification);

export default router;
