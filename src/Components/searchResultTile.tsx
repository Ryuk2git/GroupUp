import React, { useState } from "react";
import "../Styles/searchResultTile.css";
import { addFriend } from "../Context/api";
import { useAuth } from "../Context/AuthContext";

// Define the types of search results
interface SearchResultItem {
  title: string;
  userID: string;
  type: "Chats" | "Project" | "File" | "Mail" | "Task" | "Event";
  name: string;
  friendshipStatus?: string | null; // Only applicable for chat results
  description?: string;
  profilePic?: string; // For chat user avatars
  projectName?: string; // For projects
  fileName?: string; // For files
  mailSubject?: string; // For mail
  taskDetails?: string; // For tasks
  eventDate?: string; // For events
}

// Define props for the component
interface SearchResultTileProps {
  item: SearchResultItem;
  onSelect: (item: SearchResultItem) => void;
}

const SearchResultTile: React.FC<SearchResultTileProps> = ({ item, onSelect }) => {
  const [friendshipStatus, setFriendshipStatus] = useState(item.friendshipStatus);
  const { user } = useAuth();
  const currentUserId = user?.userID;
  const friendId = item.userID;
  console.log("friend id is: " , friendId);
  console.log("friendship status is: " , item.friendshipStatus);

  const handleAddFreind = async(event: React.MouseEvent) => {
    event.stopPropagation();
    try{
      if (currentUserId) {
        await addFriend(item.userID, currentUserId);
      } else {
        console.error("Current user ID is undefined");
      }
      setFriendshipStatus("pending");
    }catch(error: any){
      console.error("Failed to send friend Request");
    }
  };

  // Function to get an appropriate icon/avatar
  const getIcon = () => {
    if (item.type === "Chats") {
      return <img src={item.profilePic || "/default-avatar.png"} alt="Profile" className="search-avatar" />;
    }
    const icons: Record<string, string> = {
      Project: "📁",
      File: "📄",
      Mail: "📧",
      Task: "✅",
      Event: "📅",
    };
    return <span className="search-icon">{icons[item.type] || "🔍"}</span>;
  };

  // Function to render details based on the type
  const renderDetails = () => {
    switch (item.type) {
      case "Chats":
        return (
          <>
            <p className="search-username">{item.name}</p>
            {item.description && <p className="search-fullname">{item.description}</p>}
          </>
        );
      case "Project":
        return (
          <>
            <p className="search-title">{item.projectName || item.name}</p>
            {item.description && <p className="search-description">{item.description}</p>}
          </>
        );
      case "File":
        return (
          <>
            <p className="search-title">{item.fileName || item.name}</p>
            {item.description && <p className="search-description">{item.description}</p>}
          </>
        );
      case "Mail":
        return (
          <>
            <p className="search-title">{item.mailSubject || item.name}</p>
            {item.description && <p className="search-description">{item.description}</p>}
          </>
        );
      case "Task":
        return (
          <>
            <p className="search-title">{item.name}</p>
            {item.taskDetails && <p className="search-description">{item.taskDetails}</p>}
          </>
        );
      case "Event":
        return (
          <>
            <p className="search-title">{item.name || item.title}</p>
            {item.eventDate && <p className="search-description">Date: {item.eventDate}</p>}
          </>
        );
      default:
        return <p className="search-title">{item.name}</p>;
    }
  };

  const renderChatButtons = () => {
    if (friendshipStatus === "accepted") {
      return (
        <>
          <button className="search-action-button chat">Chat</button>
          <button className="search-action-button block">Block</button>
          <button className="search-action-button unfriend">Unfriend</button>
        </>
      );
    } else if (friendshipStatus === "pending") {
      return <button className="search-action-button pending">Request Sent</button>;
    } else {
      return <button className="search-action-button add-friend" onClick={handleAddFreind}>Add Friend</button>;
    }
  };

  return (
    <li className="search-result-tile" onClick={() => onSelect(item)}>
      {/* Column 1: Avatar/Icon */}
      <div className="search-left">{getIcon()}</div>

      {/* Column 2: Name & Description */}
      <div className="search-center">
        {renderDetails()}
      </div>

      {/* Column 3: Action Buttons */}
      <div className="search-right">
        {item.type === "Chats" ? renderChatButtons() : <button className="search-action-button open">Open</button>}
      </div>
    </li>
  );
};

export default SearchResultTile;