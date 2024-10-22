import React, { useState } from 'react';
import '../styles/MainPage.css';

// Define the Box component
function Box({ title, onClick }) {
  return (
    <div className="box" onClick={onClick}>
      {title}
    </div>
  );
}

// Define the HomeBar component
function HomeBar({ onDMClick, onProjectClick, onLogoClick, onProfileClick, userProfile }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleProfileClick = () => {
    setIsExpanded(!isExpanded); // Toggle the profile section
    onProfileClick(); // If there's any extra logic from parent component
  };

  return (
    <div className="column">
      <Box title="App Logo" onClick={onLogoClick} />
      <Box title="DM" onClick={onDMClick} />
      <Box title="Project" onClick={onProjectClick} />
      
      {/* Profile Box */}
      <div className={`profile-box ${isExpanded ? 'expanded' : ''}`} onClick={handleProfileClick}>
        <img src={userProfile.pfpUrl} alt="Profile" className="profile-pic" />
        {isExpanded && (
          <div className="profile-details">
            <h3>{userProfile.name}</h3>
            <p>{userProfile.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeBar;
