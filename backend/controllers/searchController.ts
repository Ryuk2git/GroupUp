import { Request, Response } from "express";
import { sequelize } from "../config/db"; // MySQL connection
import { QueryTypes } from "sequelize";
import mongoose from "mongoose"; // MongoDB connection
import Event from "../models/Events"; // Import the MongoDB Event model
import _ from "lodash"; // Lodash for debouncing
// import Fuse from "fuse.js"; // (Commented out, can be used for fuzzy search if needed)

// Debounce Function for Optimized Search Execution
const debounceSearch = _.debounce(async (
  searchFunction: (query: string, ...args: any[]) => Promise<any>, // Returns data, not uses `res`
  query: string,
  res: Response,
  ...args: any[] // Additional arguments (e.g., `currentUserId`, `limit`)
) => {
  try {
    const data = await searchFunction(query, ...args);
    res.json(data); // Send the response here
  } catch (error: any) {
    console.error("Debounce search error: ", error);
    res.status(500).json({ message: "Search Failed" });
  }
}, 300); // 300ms debounce to prevent frequent calls

// Search Handler
export const searchItems = async (req: Request, res: Response) => {
  const { query, category, currentUserId } = req.query as { query: string; category: string; currentUserId: string };
  console.log(`Query: ${query} / Category: ${category} / CurrentUserId: ${currentUserId}`);

  if (!query) {
    res.status(400).json({ message: "Search query is required" });
    return;
  }

  try {
    switch (category?.toLowerCase()) {
      case "all":
        debounceSearch(searchAll, query, res, currentUserId);
        return;
      case "chats":
        debounceSearch(searchChats, query, res, currentUserId);
        return;
      case "projects":
        debounceSearch(searchProjects, query, res, 10);
        return;
      case "files":
        debounceSearch(searchFiles, query, res, 10);
        return;
      case "tasks":
        debounceSearch(searchTasks, query, res, 10);
        return;
      case "events":
        debounceSearch(searchEvents, query, res, 10);
        return;
      default:
        res.status(400).json({ message: "Invalid search category" });
        return;
    }
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

/**  
 * 1. SEARCH ALL: Get top 5 results from each category  
 */
const searchAll = async (query: string, currentUserId: string) => {
  try {
    const [users, projects, files, tasks, events] = await Promise.all([
      searchUsers(query, currentUserId, 5),
      searchProjects(query, 5),
      searchFiles(query, 5),
      searchTasks(query, 5),
      searchEvents(query, 5),
    ]);

    return{ users, projects, files, tasks, events };
  } catch (error) {
    console.error("Error searching all:", error);
    throw error;
  }
};

/**  
 * 2. SEARCH USERS (Chats)  
 * - Searches for users whose username or name starts with the query  
 */
const searchChats = async (query: string, currentUserId: string, res: Response) => {
  try {
    return await searchUsers(query, currentUserId, 10); 
  } catch (error) {
    console.error("Error searching chats:", error);
    return res.status(500).json({ message: "Chat search failed" });
  }
};

/**  
 * 3. SEARCH PROJECTS  
 * - Searches for project names, related file names, and project instances  
 */
const searchProjects = async (query: string, limit: number = 10) => {
  return sequelize.query(
    `
      SELECT * FROM projects 
      WHERE projectName LIKE :searchQuery 
      OR projectID IN (SELECT projectID FROM files WHERE file_name LIKE :searchQuery)
      LIMIT :limit
    `,
    {
      replacements: { searchQuery: `${query}%`, limit },
      type: QueryTypes.SELECT,
    }
  );
};

/**  
 * 4. SEARCH FILES: Searches for files by filename only  
 */
const searchFiles = async (query: string, limit: number = 10) => {
  return sequelize.query(
    `SELECT * FROM files WHERE file_name LIKE :searchQuery LIMIT :limit`,
    {
      replacements: { searchQuery: `${query}%`, limit },
      type: QueryTypes.SELECT,
    }
  );
};

/**  
 * 5. SEARCH TASKS  
 */
const searchTasks = async (query: string, limit: number = 10) => {
  return sequelize.query(
    `SELECT * FROM tasks WHERE title LIKE :searchQuery LIMIT :limit`,
    {
      replacements: { searchQuery: `${query}%`, limit },
      type: QueryTypes.SELECT,
    }
  );
};

/**  
 * 6. SEARCH EVENTS  
 */
const searchEvents = async (query: string, limit: number = 10) => {
  // 1. Search MySQL events table
  const mysqlEvents = await sequelize.query(
    `SELECT * FROM events WHERE title LIKE :searchQuery LIMIT :limit`,
    {
      replacements: { searchQuery: `${query}%`, limit },
      type: QueryTypes.SELECT,
    }
  );

  // 2. Search MongoDB Events collection using your Event model
  const mongoEvents = await Event.find(
    { title: { $regex: `^${query}`, $options: "i" } }
  )
    .limit(limit)
    .lean();

  // 3. Add a source property for clarity (optional)
  const mysqlResults = mysqlEvents.map((e: any) => ({ ...e, source: "mysql" }));
  const mongoResults = mongoEvents.map((e: any) => ({ ...e, source: "mongo" }));

  // 4. Combine and return (optionally, you can sort or deduplicate)
  return [...mysqlResults, ...mongoResults].slice(0, limit);
};

/**  
 * Helper function to search users  
 */
const searchUsers = async (query: string, currentUserId: string, limit: number = 10) => {
  return sequelize.query(
    `SELECT 
        u.userID, 
        u.userName, 
        u.name, 
        u.emailID, 
        f.status AS friendshipStatus
    FROM users u
    LEFT JOIN friends f 
        ON (f.userId = u.userID AND f.friendId = :currentUserId) 
        OR (f.userId = :currentUserId AND f.friendId = u.userID)
    WHERE (u.userName LIKE :searchQuery OR u.name LIKE :searchQuery)
    LIMIT :limit`,
    {
        replacements: { searchQuery: `${query}%`, currentUserId, limit },
        type: QueryTypes.SELECT,
    }
);
};


