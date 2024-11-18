import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeBar from './Homebar';
import MessagePage from './MessagePage';
import ProjectPage from './ProjectPage';
import { fetchUserData, fetchProjects } from '../utils/api'; // Adjust according to your project structure
import '../styles/MainPage.css';
import { set } from 'mongoose';

function MainPage({ initialComponent }) {
    const navigate = useNavigate();

    const [activeComponent, setActiveComponent] = useState(initialComponent);
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
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchUserProfile(); 
    }, []); 

    useEffect(() => {
        console.log("attempting to fetch Projects");
        const fetchProject = async () => {
            const userID = localStorage.getItem('userID');
          try {
                const response = await fetchProjects(userID);
                setProjects(response.data); // Store the fetched projects in state
                console.log("Projects: ", response.data);
                setLoading(false); // Stop the loading spinner
          } catch (error) {
                setError("Failed to fetch projects!"); // Set error state if the request fails
                setLoading(false); // Stop the loading spinner
          }
        };
    
        fetchProject();
      }, []); // Depend on userId to refetch projects if it changes
    

    const handleLogoClick = () => { 
        navigate('/main'); 
        setActiveComponent('MessagePage');
    };
    const handleDMClick = () => {
        setActiveComponent('MessagePage')
        navigate('/main');
    };
    const handleProjectClick = () => {
        setActiveComponent('ProjectPage')
        navigate('/main/projects');
    };
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
                projects={projects}
            />
            <div className="column">
                {activeComponent === 'MessagePage' ? <MessagePage userProfile={userProfile} friends={friends} /> : <ProjectPage projects={projects} />}
            </div>
        </div>
    );
}

export default MainPage;
