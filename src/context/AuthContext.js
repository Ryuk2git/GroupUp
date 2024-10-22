// frontend/src/context/AuthContext.js
import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null,
        token: localStorage.getItem('token')
    });

    const login = (user, token) => {
        setAuthState({ isAuthenticated: true, user, token });
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setAuthState({ isAuthenticated: false, user: null, token: null });
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
