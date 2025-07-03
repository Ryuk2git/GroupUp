import React from "react";

const RightSidebar: React.FC = () => {
  return (
    <aside className="main-rightbar">
      <div className="main-rightbar-panel">
        <h3>Active Now</h3>
        <div className="active-user">👤 User 1</div>
        <div className="active-user">👤 User 2</div>
      </div>
    </aside>
  );
};

export default RightSidebar;
