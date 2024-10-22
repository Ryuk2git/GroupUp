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
                <Route path="/main" element={<MainPage />} /> 
                {/* <Route path="/main/projects" element={<ProjectPage />} /> Updated Project Page route1 */}
            </Routes>
        </Router>
    );
};

export default App;
