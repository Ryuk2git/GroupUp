// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [friends, setFriends] = useState([]);
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token'); // Fetch token from localStorage
                if (!token) throw new Error('No token found');
                
                const response = await axios.get('http://localhost:3000/api/user', {
                    headers: {
                        'x-auth-token': token,
                    },
                });
                setUserProfile(response.data.user);
                await fetchFriends(token); // Fetch friends after user profile is fetched
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Handle error (e.g., redirect to login)
            }
        };

        fetchUserProfile();
    }, []);

    const fetchFriends = async (token) => {
        try {
            const response = await axios.get('http://localhost:3000/api/friends', {
                headers: { Authorization: `Bearer ${token}` }, // Use Bearer token for friends
            });
            setFriends(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ userProfile, friends }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
