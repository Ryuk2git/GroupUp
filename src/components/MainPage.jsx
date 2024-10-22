import React, { useEffect, useState } from 'react';
import HomeBar from './Homebar';
import MessagePage from './MessagePage';
import ProjectPage from './ProjectPage';
import '../styles/MainPage.css';

function MainPage() {
  const [activeComponent, setActiveComponent] = useState('MessagePage');
  const [userProfile, setUserProfile] = useState(null); // Initialize as null to fetch dynamically
  

  useEffect(() => {
    // Simulate fetching user data from an API or local storage
    const fetchUserProfile = async () => {
      // Replace this with actual fetching logic
      const userData = {
        name: 'John Doe', // This would be fetched from your backend or auth context
        email: 'john@example.com',
        pfpUrl: 'https://example.com/profile-pic.jpg', // Replace with actual profile pic URL
      };
      setUserProfile(userData);
    };

    fetchUserProfile();
  }, []); // Empty dependency array to run only once when component mounts

  const handleLogoClick = () => { /* Logic for App Logo click */ };
  const handleDMClick = () => setActiveComponent('MessagePage');
  const handleProjectClick = () => setActiveComponent('ProjectPage');
  const handleProfileClick = () => { /* Handle profile click if needed */ };

  if (!userProfile) {
    return <div>Loading...</div>; // Optional: Show a loading state while fetching data
  }

  return (
    <div className="m-container">
      <HomeBar 
        onLogoClick={handleLogoClick} 
        onDMClick={handleDMClick} 
        onProjectClick={handleProjectClick} 
        onProfileClick={handleProfileClick}
        userProfile={userProfile} // Pass user profile to HomeBar
      />
      <div className="column">
        {activeComponent === 'MessagePage' ? <MessagePage /> : <ProjectPage />}
      </div>
    </div>
  );
}

export default MainPage;
