// ProjectPage.jsx
import React from 'react';
import FileList from './FileList'; 
import CodeEditor from './CodeEditor';  // Updated import
import '../styles/ProjectPage.css'; 

const ProjectPage = () => {
    return (
        <div className="project-container">
            <div className="sidebar">
                <h3>File Explorer</h3>
                <FileList /> 
            </div>
            <div className="main-content">
                <div className="file-display">
                    <CodeEditor />
                </div>
            </div>
        </div>
    );
};

export default ProjectPage;
