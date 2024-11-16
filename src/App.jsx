// App.jsx
import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Loginpage';
import MainPage from './components/MainPage';
import ProjectPage from './components/ProjectPage';
import axios from 'axios'; // Import axios for API calls

const App = () => {
    const [userProfile, setUserProfile] = useState(null); // State to store user profile

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Replace with your token fetching mechanism
                const token = localStorage.getItem('x-auth-token'); // Assuming token is stored in local storage
                const response = await axios.get('http://localhost:3000/api/user', {
                    headers: {
                        'x-auth-token': token,
                    },
                });
                setUserProfile(response.data.user); // Set the fetched user profile
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Handle error (e.g., redirect to login)
            }
        };

        fetchUserProfile();
    }, []); // Run once on component mount

    return (
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/main" element={<MainPage userProfile={userProfile} setUserProfile={setUserProfile} />} />
                    {/* <Route path="/main/projects" element={<ProjectPage />} /> Updated Project Page route */ }
                </Routes>
            </Router>
    );
};

export default App;
