import React, { useState } from 'react';
import { createProject } from '../utils/api';
import '../styles/MainPage.css';

// Define the Box component
function Box({ title, onClick }) {
  return (
    <div className="box" onClick={onClick}>
      {title}
    </div>
  );
}

// Define the HomeBar component
function HomeBar({ onDMClick, onProjectClick, onLogoClick, onProfileClick, userProfile, projects, onAddProject }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProjectBoxExpanded, setIsProjectBoxExpanded] = useState(false); // New state for "Add New Project" box
  const [newProjectName, setNewProjectName] = useState(''); // State to manage new project input
  const [projectDescription, setProjectDescription] = useState(''); // State for project description
  const [isSolo, setIsSolo] = useState(false); // State for "solo" boolean

  // Toggle profile expansion
  const handleProfileClick = () => {
    setIsExpanded(!isExpanded); // Toggle the profile section
    onProfileClick(); // If there's any extra logic from parent component
  };

  // Toggle project box expansion (new project form)
  const handleAddProjectClick = (e) => {
    e.stopPropagation(); // Prevent the click event from propagating to the parent
    setIsProjectBoxExpanded(!isProjectBoxExpanded); // Toggle the expanded state for "Add New Project" box
  };

  // Handle submitting the new project
  const handleSubmitNewProject = async () => {
    const token = localStorage.getItem('x-auth-token');
    const userID = localStorage.getItem('userID')
    if (!token) {
        console.error("No auth token found");
        return;
      }
    if (newProjectName.trim()) {
        try {
            const response = await createProject(userID, newProjectName.trim(), projectDescription.trim());
        } catch (error) {
            console.error('Error creating project:', error.message);
        }
    }
};

  return (
    <div className="column">
      <Box title="App Logo" onClick={onLogoClick} />
      <Box title="DM" onClick={onDMClick} />
      <Box title="Project" onClick={onProjectClick} />

      {/* Render existing projects */}
      {projects && projects.length > 0 && (
        <div className="projects-section">
          {projects.map((project) => (
            <Box
              key={project.projectId} // Assuming each project has a unique projectId
              title={project.projectName.charAt(0).toUpperCase()} // First letter of project name
              onClick={() => console.log(`Project clicked: ${project.projectName}`)}
            />
          ))}
        </div>
      )}

      {/* Add New Project Box */}
      <div
        className={`add-project-box ${isProjectBoxExpanded ? 'expanded' : ''}`}
        onClick={handleAddProjectClick}
      >
        <span className="add-project-title">Add New Project</span>
        
        {/* Expanded form for adding new project */}
        {isProjectBoxExpanded && (
          <div className="new-project-form">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter new project name"
            />
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Enter project description"
            />
            <label>
              <input
                type="checkbox"
                checked={isSolo}
                onChange={() => setIsSolo(!isSolo)}
              />
              Solo Project
            </label>
            <button onClick={handleSubmitNewProject}>Add Project</button>
          </div>
        )}
      </div>

      {/* Profile Box */}
      <div className={`profile-box ${isExpanded ? 'expanded' : ''}`} onClick={handleProfileClick}>
        <img src={userProfile.pfpUrl} alt="Profile" className="profile-pic" />
        {isExpanded && (
          <div className="profile-details">
            <h3>{userProfile.name}</h3>
            <p>{userProfile.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeBar;
