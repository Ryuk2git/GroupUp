import React from "react";

interface ContentAreaProps {
  activeSection: string;
}

const ContentArea: React.FC<ContentAreaProps> = () => {
  const renderContent = () => {
    const activeSection = localStorage.getItem("activeSection") || "home";
    
    switch (activeSection) {
      case "home":
        return (
          <div className="main-widgets-area">
            <div className="main-widget">📊 Stats Overview</div>
            <div className="main-widget">📝 Quick Notes</div>
            <div className="main-widget">🗓️ Upcoming Events</div>
          </div>
        );
      case "chats":
        return <p>💬 Chat Messages Here</p>;
      case "projects":
        return <p>📂 Project Files</p>;
      case "tasks":
        return <p>📌 Task List</p>;
      default:
        return <p>Welcome to GroupUp!</p>;
    }
  };

  return <main className="main-dynamic-content">{renderContent()}</main>;
};

export default ContentArea;
