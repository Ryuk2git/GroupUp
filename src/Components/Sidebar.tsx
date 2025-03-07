import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Styles/mainPageStyles.css";

interface SidebarProps {
  setActiveSection: (section: string) => void;
}

interface NavItem {
  label: string;
  icon: string;
  section: string;
}

const navItems: NavItem[] = [
  { label: "Chats", icon: "💬", section: "direct-message" },
  { label: "Projects", icon: "🛠️", section: "projects" },
  { label: "Files", icon: "📁", section: "files" },
  { label: "Mail", icon: "📧", section: "emails" },
  { label: "Tasks", icon: "📌", section: "tasks" },
  { label: "Calendar", icon: "📅", section: "calendar" },
];

const SidebarButton: React.FC<{ item: NavItem; isActive: boolean; onClick: () => void }> = ({ item, isActive, onClick }) => (
  <button
    className={`main-nav-item ${isActive ? "active" : ""}`}
    onClick={onClick}
    title={item.label}
  >
    {item.icon}
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ setActiveSection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSectionState] = useState<string>("");

  useEffect(() => {
    const storedSection = localStorage.getItem("activeSection");
    if (storedSection) {
      setActiveSection(storedSection);
      setActiveSectionState(storedSection);
    } else {
      const pathSection = location.pathname.split("/")[2];
      if (pathSection) {
        setActiveSection(pathSection);
        setActiveSectionState(pathSection);
      }
    }
  }, [location.pathname]);

  const handleNavItemClick = (section: string) => {
    setActiveSection(section);
    setActiveSectionState(section);
    localStorage.setItem("activeSection", section);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = user.userName || "";
    navigate(`/${userName}/${section}`);
  };

  const createNewProject = () => {
    console.log("New Project created");
  };

  return (
    <div className="main-sidebar">
      <div className="main-sidebar-logo" onClick={() => handleNavItemClick("home")}>
        🏠 {/* Placeholder for Logo */}
      </div>
      <div className="main-nav-list">
        {navItems.map((item) => (
          <SidebarButton
            key={item.section}
            item={item}
            isActive={activeSection === item.section}
            onClick={() => handleNavItemClick(item.section)}
          />
        ))}
      </div>
      <div>
        <button className="main-sidebar-logo" onClick={createNewProject} title="Create New Project">
          ➕
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
