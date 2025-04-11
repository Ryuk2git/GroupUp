import React from "react";
import ChatArea from "../Components/chatArea";
import { useChatVoice } from "../Context/ChatVoiceContext";
import DriveArea from "./DriveArea";
import { useGlobalContext } from "../Context/GlobalProvider";

interface ContentAreaProps {
  activeSection: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({ activeSection }) => {
  const { selectedChat } = useGlobalContext();

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="main-widgets-area">
            <div className="main-widget">📊 Stats Overview</div>
            <div className="main-widget">📝 Quick Notes</div>
            <div className="main-widget">🗓️ Upcoming Events</div>
          </div>
        );

      case "direct-message":
        return selectedChat ? (
          <ChatArea />
        ) : (
          <p>🔍 Select a chat to start messaging</p>
        );

      case "projects":
        return <p>📂 Project Files</p>;

      case "tasks":
        return <p>📌 Task List</p>;

      case "files":
        return <DriveArea />

      default:
        return <p>Welcome to GroupUp!</p>;
    }
  };

  return <main className="main-dynamic-content">{renderContent()}</main>;
};

export default ContentArea;
