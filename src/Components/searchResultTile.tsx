import React from "react";
import "../Styles/searchResultTile.css";

// Define the types of search results
interface SearchResultItem {
  id: string;
  type: "Chat" | "Project" | "File" | "Mail" | "Task" | "Event";
  name: string;
  description?: string;
  profilePic?: string; // For chat user avatars
  isFriend?:  boolean; // Only applicable for chat results
}

// Define props for the component
interface SearchResultTileProps {
  item: SearchResultItem;
  onSelect: (item: SearchResultItem) => void;
}

const SearchResultTile: React.FC<SearchResultTileProps> = ({ item, onSelect }) => {
  // Function to get an appropriate icon/avatar
  const getIcon = () => {
    if (item.type === "Chat") {
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

  return (
    <li className="search-result-tile" onClick={() => onSelect(item)}>
      {/* Column 1: Avatar/Icon */}
      <div className="search-left">{getIcon()}</div>

      {/* Column 2: Name & Description */}
      <div className="search-center">
        {item.type === "Chat" ? (
          <>
            <p className="search-username">{item.name}</p>
            {item.description && <p className="search-fullname">{item.description}</p>}
          </>
        ) : (
          <p className="search-title">{item.name}</p>
        )}
      </div>

      {/* Column 3: Action Buttons */}
      <div className="search-right">
        {item.type === "Chat" ? (
          item.isFriend ? (
            <>
              <button className="search-action-button chat">Chat</button>
              <button className="search-action-button block">Block</button>
              <button className="search-action-button unfriend">Unfriend</button>
            </>
          ) : (
            <>
                <button className="search-action-button add-friend">Add Friend</button>
                <button className="search-action-button open">Open</button>
            </>
          )
        ) : (
          <button className="search-action-button open">Open</button>
        )}
      </div>
    </li>
  );
};

export default SearchResultTile;
