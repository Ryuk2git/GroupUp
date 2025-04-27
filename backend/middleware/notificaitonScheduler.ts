import cron from 'node-cron';
import Events from '../models/Events';
import { NotificationType } from '../models/notification';
import NotificationModel from '../models/notification';
import { Server as SocketIOServer } from 'socket.io';
import express from 'express';
import http from 'http';
import { IncomingMessage, ServerResponse } from 'http';

// CORS + socket setup
const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // update to your frontend origin
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

export const startNotificationScheduler = () => {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const windowStart = new Date(now.getTime() - 1000); // 1s ago
    const windowEnd = new Date(now.getTime() + 16 * 60 * 1000); // +16min

    // Use startDate (not startTime) and event.title (not eventName)
    const events = await Events.find({ startDate: { $gte: windowStart, $lte: windowEnd } }) as Array<{ _id: string; title: string; startDate: Date; members: string[] }>;

    for (const event of events) {
      const diff = Math.floor((new Date(event.startDate).getTime() - now.getTime()) / 60000);
      let message = '';

      if (diff === 15) message = `⏰ "${event.title}" starts in 15 minutes.`;
      else if (diff === 5) message = `⚠️ "${event.title}" starts in 5 minutes.`;
      else if (diff === 0) message = `🚀 "${event.title}" is starting now!`;
      else continue;

      // event.members is likely an array of userIds (strings)
      for (const memberId of event.members) {
        const newNotification = new NotificationModel({
          userId: memberId,
          type: NotificationType.REMINDER,
          content: { taskId: event._id.toString(), message },
        });

        await newNotification.save();

        // Emit to frontend if socket connected
        io.to(memberId).emit("notification:new", newNotification);
      }
    }
  });
};

