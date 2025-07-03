import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import ChatVoiceList from "./ChatVoiceList";
import DriveContextPanel from "./DriveContextPanel";
import EventContextPanel from "./EventContextPanel";
import TaskContextPanel from "./taskCOntextPanel";

const ContextSection: React.FC = () => {
  const { logout } = useAuth();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [animationClass, setAnimationClass] = useState<string>("");

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userName = user.userName || "";
  const activeSection = sessionStorage.getItem("activeSection") || "home";

  const sectionTitles: Record<string, string> = {
    home: "Recent Activity & Quick Access",
    "direct-message": "Text & Audio Channels",
    projects: selectedProject ? "File Explorer" : "Projects",
    tasks: "Task Manager",
    events: "Events & Schedule",
    emails: "Email Options",
    files: "Drive",
  };

  const handleProjectClick = (project: string) => {
    setAnimationClass("slide-in");
    setTimeout(() => {
      setSelectedProject(project);
      setAnimationClass("");
    }, 500);
  };

  const handleBackClick = () => {
    setAnimationClass("slide-out");
    setTimeout(() => {
      setSelectedProject(null);
      setAnimationClass("");
    }, 500);
  };

  const handleLogout = async () => {
    try {
      logout();
      console.log("Logged out successfully!");
      window.location.href = "/login";
    } catch (error: any) {
      console.error("Logout failed", error);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <>
            <h4>Recent Chats</h4>
            <div className="main-recent-item">💬 Chat with Alice</div>
            <div className="main-recent-item">💬 Team Meeting</div>

            <h4>Recently Accessed Files</h4>
            <div className="main-recent-item">📄 Project_Doc.pdf</div>
            <div className="main-recent-item">📄 Notes.txt</div>

            <h4>Quick Access</h4>
            <div className="main-recent-item">📂 My Dashboard</div>
            <div className="main-recent-item">📧 Check Emails</div>
          </>
        );

      case "direct-message":
        return (
          <ChatVoiceList /> 
        );

        case "projects":
          return selectedProject ? (
            <div className={animationClass}>
              <h4>File Explorer - {selectedProject}</h4>
              <div className="main-recent-item">📄 index.js</div>
              <div className="main-recent-item">📂 src/</div>
              <div className="main-recent-item">📂 components/</div>
              <button onClick={handleBackClick}>← Back to Projects</button>
            </div>
          ) : (
            <div className={animationClass}>
              <h4>Projects</h4>
              <div className="main-recent-item" onClick={() => handleProjectClick("Project A")}>
                📂 Project A
              </div>
              <div className="main-recent-item" onClick={() => handleProjectClick("Project B")}>
                📂 Project B
              </div>
            </div>
          );

      case "tasks":
        return (
          <>
            <TaskContextPanel/>
          </>
        );

      case "events":
        return (
          <EventContextPanel />
        );

      case "emails":
        return (
          <>
            <h4>Email Sections</h4>
            <div className="main-recent-item">📥 Inbox</div>
            <div className="main-recent-item">📤 Sent</div>
            <div className="main-recent-item">📨 Drafts</div>
            <div className="main-recent-item">🗑️ Trash</div>
          </>
        );

      case "files":
        return (
          <DriveContextPanel />
        );

      default:
        return <p>No content available</p>;
    }
  };

  return (
    <aside className="main-recent-section">
      <h3 className="main-recent-title">{sectionTitles[activeSection]}</h3>
      <div className="main-recent-list">{renderContent()}</div>

      {/* Fixed User Info Section */}
      <div className="user-info">
        <div className="user-avatar">🧑</div>
        <div className="user-details">
          <p className="username">{userName}</p>
          <div className="user-controls">
            <button onClick={handleLogout}>🔒</button>
            <button>⚙️</button>
            <button onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? "🔇" : "🎤"}
            </button>
            <button onClick={() => setIsDeafened(!isDeafened)}>
              {isDeafened ? "🔊" : "🎧"}
            </button>
            
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ContextSection;
