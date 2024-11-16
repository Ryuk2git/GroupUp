import React, { useEffect, useState } from 'react';
import HomeBar from './Homebar';
import MessagePage from './MessagePage';
import ProjectPage from './ProjectPage';
import { fetchUserData } from '../utils/api'; // Adjust according to your project structure
import '../styles/MainPage.css';

function MainPage() {
    const [activeComponent, setActiveComponent] = useState('MessagePage');
    const [userProfile, setUserProfile] = useState(null); 
    const [friends, setFriends] = useState([]); // State for friends
    const [projects, setProjects] = useState([]); // State for projects
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true); // Start loading
            const token = localStorage.getItem('x-auth-token'); 
            if (!token) {
                console.error('No token found. User is not authenticated.');
                setLoading(false);
                return; 
            }

            try {
                const userData = await fetchUserData(); 
                setUserProfile(userData.user); 
                setFriends(userData.friends); // Assuming the API returns friends
                setProjects(userData.projects); // Assuming the API returns projects
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchUserProfile(); 
    }, []); 

    const handleLogoClick = () => { /* Logic for App Logo click */ };
    const handleDMClick = () => setActiveComponent('MessagePage');
    const handleProjectClick = () => setActiveComponent('ProjectPage');
    const handleProfileClick = () => { /* Handle profile click if needed */ };

    if (loading) {
        return <div>Loading...</div>; // Show a loading state while fetching data
    }

    if (!userProfile) {
        return <div>No user profile available.</div>; // Handle case when no user profile
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
                {activeComponent === 'MessagePage' ? <MessagePage userProfile={userProfile} friends={friends} /> : <ProjectPage projects={projects} />}
            </div>
        </div>
    );
}

export default MainPage;
