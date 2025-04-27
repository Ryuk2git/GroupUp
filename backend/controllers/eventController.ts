import { Request, Response } from "express";
import { sequelize } from "../config/db";
import { QueryTypes } from "sequelize";
import Events from "../models/Events";
import { Server } from "socket.io";
import http from "http";
import cron from "node-cron";

const server = http.createServer(); // Create an HTTP server
const io = new Server(server, {
    transports: ["websocket", "polling"], // Ensure compatibility with different transport methods
    path: "/socket.io", // Explicitly specify the path to match the server configuration
});

// Helper to format MySQL insert
const moveEventToHistory = async (event: any) => {
    const {
      eventId,
      title,
      event_description,
      startTime,
      endTime,
      location,
      createdBy,
      projectId,
      createdAt,
      updatedAt,
    } = event;
  
    const sql = `
      INSERT INTO events (
        eventId, title, event_description, startTime, endTime, location, createdBy, projectId, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    try {
      await sequelize.query(sql, {
        replacements: [
          eventId,
          title,
          event_description,
          new Date(startTime),
          new Date(endTime),
          location,
          createdBy,
          projectId,
          new Date(createdAt),
          new Date(updatedAt),
        ],
      });
    } catch (err) {
      console.error("Sequelize Insert Error:", err);
      throw err;
    }
  };

// CREATE
export const createEvent = async (req: Request, res: Response) => {
    console.log("Event Data: ", req.body);
  
    try {
      const {
        title,
        description,
        location,
        start,
        end,
        category,
        members,
        userId,
      } = req.body;
  
      const prefixedId = `EVT_${Date.now()}`;
  
      const newEvent = await Events.create({

        title,
        description,
        location,
        startDate: start,     
        endDate: end,       
        category,
        members,
        createdBy: userId,  
        eventId: prefixedId,
      });
  
      io.emit("new_event", newEvent);
      res.status(201).json(newEvent);
    } catch (err) {
      console.error("Create Event Error:", err);
      res.status(500).json({ error: "Failed to create event" });
    }
  };
  

// READ
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    let events;
    if (userId) {
      events = await Events.find({
        $or: [
          { createdBy: userId },
          { members: userId }
        ]
      });
    } else {
      events = await Events.find({});
    }

    // 1. Collect all unique userIds from createdBy and members
    const userIdSet = new Set<string>();
    events.forEach((event: any) => {
      if (event.createdBy) userIdSet.add(event.createdBy);
      if (Array.isArray(event.members)) {
        event.members.forEach((id: string) => userIdSet.add(id));
      }
    });
    const userIds = Array.from(userIdSet);

    // 2. Query MySQL for userNames
    let userMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const users = await sequelize.query(
        `SELECT userId, userName FROM users WHERE userId IN (:userIds)`,
        {
          replacements: { userIds },
          type: QueryTypes.SELECT,
        }
      );
      users.forEach((user: any) => {
        userMap[user.userId] = user.userName;
      });
    }

    // 3. Attach userNames to events
    const eventsWithNames = events.map((event: any) => ({
      ...event._doc,
      createdByUserName: userMap[event.createdBy] || event.createdBy,
      memberUserNames: Array.isArray(event.members)
        ? event.members.map((id: string) => userMap[id] || id)
        : [],
    }));
    io.emit("new_event", eventsWithNames);
    res.status(200).json(eventsWithNames);
  } catch (err) {
    console.error("Get Events Error:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// UPDATE
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;

    const updatedEvent = await Events.findOneAndUpdate({ eventId }, updates, { new: true });

    if (!updatedEvent) {
        res.status(404).json({ error: "Event not found" });
        return;
    }

    io.emit("event_updated", updatedEvent);
    res.status(200).json(updatedEvent);
    return;
  } catch (err) {
    console.error("Update Event Error:", err);
    res.status(500).json({ error: "Failed to update event" });
    return;
  }
};

// DELETE
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const deletedEvent = await Events.findOneAndDelete({ eventId });

    if (!deletedEvent) {
        res.status(404).json({ error: "Event not found" });
        return;
    }
    io.emit("event_deleted", deletedEvent.eventId);
    res.status(200).json({ message: "Event deleted", eventId: deletedEvent.eventId });
    return;
  } catch (err) {
    console.error("Delete Event Error:", err);
    res.status(500).json({ error: "Failed to delete event" });
    return;
  }
};

// MOVE EXPIRED EVENTS TO MYSQL
export const archiveExpiredEvents = async () => {
  try {
    const now = new Date();
    const expiredEvents = await Events.find({ endTime: { $lt: now } });

    for (const event of expiredEvents) {
      await moveEventToHistory(event);
      await Events.deleteOne({ _id: event._id });

      io.emit("event_archive", event.eventId);
    }
  } catch (err) {
    console.error("Archive Event Error:", err);
  }
};

cron.schedule("* 1 * * *", async () => {
    console.log("Running scheduled task: archiveExpiredEvents");
    await archiveExpiredEvents();
  });