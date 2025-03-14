import { Request, Response } from "express";
import { sequelize } from "../config/db"; // Import the sequelize instance

export const getFriends = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;
  console.log(userId);

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  try {
    const result = await sequelize.query(
      `SELECT f.friendId, u.userName, u.emailID, u.pfpRoute 
      FROM friends f
      LEFT JOIN users u ON f.friendId = u.userID
      WHERE f.userId = :userId AND f.status = 'accepted'`,
      {
        replacements: { userId },
        type: "SELECT",
      }
    );

    const friends = result?.[0] || []; // Ensure friends is always an array

    if (friends.length === 0) {
      res.status(200).json({ message: "No friends found" });
      return;
    }

    const formattedFriends = friends.map((friend: any) => ({
      userId: friend.friendId,
      username: friend.userName ?? "Unknown",
      email: friend.emailID ?? "Unknown",
      pfp: friend.pfpRoute ?? "",
    }));

    res.status(200).json(formattedFriends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
