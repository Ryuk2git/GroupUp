import { Request, Response } from "express";
import Task from "../models/Tasks";

// GET /api/tasks?userId=...&projectId=...
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { userId, projectId } = req.query;
    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }
    const filter: any = {
      $or: [
        { createdBy: userId },
        { assignedTo: userId }
      ]
    };
    if (projectId) filter.projectId = projectId;
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
    return;
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// POST /api/tasks
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate, userId } = req.body;
    if (!title || !userId) {
      res.status(400).json({ error: "title and userId are required" });
      return;
    }
    const task = await Task.create({
      title,
      description,
      projectId, 
      assignedTo: Array.isArray(assignedTo) ? assignedTo : [],
      priority: priority || "medium",
      dueDate,
      createdBy: userId,
      status: "todo"
    });
    req.app.get("io").emit("taskCreated", task);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Task.findByIdAndUpdate(id, req.body, { new: true });
    req.app.get("io").emit("taskUpdated", updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    req.app.get("io").emit("taskDeleted", { id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};