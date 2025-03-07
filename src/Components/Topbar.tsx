import React from "react";

const Topbar: React.FC = () => {
  return (
    <header className="main-topbar">
      <div className="main-topbar-search">
        <input type="text" placeholder="Search..." className="main-search-input" />
      </div>
      <div className="main-topbar-icons">
        <button className="main-icon-button">🔔</button>
        <button className="main-icon-button">⚙️</button>
      </div>
    </header>
  );
};

export default Topbar;
