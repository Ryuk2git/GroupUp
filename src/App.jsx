import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Loginpage';
import MainPage from './components/MainPage';
import ProjectPage from './components/ProjectPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/main/:username" element={<MainPage />} /> 
                <Route path="/main/:username/projects" element={<ProjectPage />} /> {/* Updated Project Page route */}
            </Routes>
        </Router>
    );
};

export default App;
