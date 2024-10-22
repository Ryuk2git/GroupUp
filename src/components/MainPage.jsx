import React, { useEffect, useState } from 'react';
import HomeBar from './Homebar';
import MessagePage from './MessagePage';
import ProjectPage from './ProjectPage';
import { fetchUserData } from '../utils/api'; // Adjust according to your project structure
import '../styles/MainPage.css';

function MainPage() {
    const [activeComponent, setActiveComponent] = useState('MessagePage');
    const [userProfile, setUserProfile] = useState(null); // Initialize as null to fetch dynamically

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token'); // Get the token from local storage
            if (!token) {
                console.error('No token found. User is not authenticated.');
                return; // Exit if no token
            }

            try {
                const userData = await fetchUserData(); // Fetch user data
                setUserProfile(userData.user); // Update userProfile with fetched data
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserProfile(); // Call function to fetch user profile
    }, []); // Empty dependency array to run only once when component mounts

    const handleLogoClick = () => { /* Logic for App Logo click */ };
    const handleDMClick = () => setActiveComponent('MessagePage');
    const handleProjectClick = () => setActiveComponent('ProjectPage');
    const handleProfileClick = () => { /* Handle profile click if needed */ };

    if (!userProfile) {
        return <div>Loading...</div>; // Show a loading state while fetching data
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
