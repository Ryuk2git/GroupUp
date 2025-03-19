import { Request, Response } from "express";
import { sequelize } from "../config/db"; // MySQL connection
import { QueryTypes } from "sequelize";
import mongoose from "mongoose"; // MongoDB connection
import _ from "lodash"; // Lodash for debouncing
// import Fuse from "fuse.js"; // (Commented out, can be used for fuzzy search if needed)

// Debounce Function for Optimized Search Execution
const debounceSearch = _.debounce(async (searchFunction: Function, query: string, res: Response) => {
  await searchFunction(query, res);
}, 300); // 300ms debounce to prevent frequent calls

// Search Handler
export const searchItems = async (req: Request, res: Response) => {
  const { query, category } = req.query as { query: string; category: string };
  console.log(`Query: ${query} /n category: ${category}`);

  if(!query){
        res.status(400).json({ message: "Search query is required" });
        return;
    }

  try {
    switch (category?.toLowerCase()) {
      case "all":
        debounceSearch(searchAll, query, res);
        return;
      case "chats":
        debounceSearch(searchChats, query, res);
        return;
      case "projects":
        debounceSearch(searchProjects, query, res);
        return;
      case "files":
        debounceSearch(searchFiles, query, res);
        return;
      case "tasks":
        debounceSearch(searchTasks, query, res);
        return;
      case "events":
        debounceSearch(searchEvents, query, res);
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
const searchAll = async (query: string, res: Response) => {
  try {
    const [users, projects, files, tasks, events] = await Promise.all([
      searchUsers(query, 5),
      searchProjects(query, 5),
      searchFiles(query, 5),
      searchTasks(query, 5),
      searchEvents(query, 5),
    ]);

    return res.json({
      users,
      projects,
      files,
      tasks,
      events,
    });
  } catch (error) {
    console.error("Error searching all:", error);
    return res.status(500).json({ message: "Search failed" });
    
  }
};

/**  
 * 2. SEARCH USERS (Chats)  
 * - Searches for users whose username or name starts with the query  
 */
const searchChats = async (query: string, res: Response) => {
  try {
    const users = await searchUsers(query, 10);
    console.log("Users: ", users);
    return res.json(users);
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
    return sequelize.query(
    `SELECT * FROM events WHERE title LIKE :searchQuery LIMIT :limit`,
    {
      replacements: { searchQuery: `${query}%`, limit },
      type: QueryTypes.SELECT,
    }
  );
  
};

/**  
 * Helper function to search users  
 */

const searchUsers = async (query: string, limit: number = 10) => {
    return sequelize.query(
    `SELECT userID, userName, name FROM users WHERE userName LIKE :searchQuery OR name LIKE :searchQuery LIMIT :limit`,
    {
      replacements: { searchQuery: `${query}%`, limit },
      type: QueryTypes.SELECT,
    }
  );
  
};


