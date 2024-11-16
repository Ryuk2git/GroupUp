// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user info
    const [token, setToken] = useState(null); // Store JWT token

    // Load user data and token from local storage on app startup
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('userID'));
        const storedToken = localStorage.getItem('x-auth-token');

        if (storedUser && storedToken) {
            setUser(storedUser);
            setToken(storedToken);
        }
    }, []);

    // Login function
    const login = (userData, token) => {
        setUser(userData);
        setToken(token);

        // Save to local storage
        localStorage.setItem('userID', JSON.stringify(userData));
        localStorage.setItem('x-auth-token', token);
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);

        // Clear local storage
        localStorage.removeItem('userID');
        localStorage.removeItem('x-auth-token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook for easy access to AuthContext
export const useAuth = () => useContext(AuthContext);
