// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserData } from './utils/api'; // Adjust the import according to your structure

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await fetchUserData(); // Fetch user data from your API
                setUserProfile(data.user); // Assuming your API returns { user: { ... } }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchProfile();
    }, []);

    return (
        <UserContext.Provider value={{ userProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserProfile = () => {
    return useContext(UserContext);
};
