import React, { useState } from "react";
import { Plus, Home, Folder, Users, Star, Trash2, HardDrive } from "lucide-react";
import { createFolder, uploadFile, uploadFolder } from "../Context/api";
import { useGlobalContext } from "../Context/GlobalProvider";
import "../Styles/driveStyles.css";
import { useAuth } from "../Context/AuthContext";

const DriveContextPanel: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.userID;
    
  const { setDriveSection } = useGlobalContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const totalStorage = 5 * 1024; // 5GB in MB
  const usedStorage = 2048; // Example: 1GB used

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      try {
        if (currentUserId) await createFolder(currentUserId, folderName);
        console.log("Folder Created Successfully.");
      } catch (error) {
        console.error("Error creating folder:", error);
        alert("Failed to create folder.");
      }
    }
  };

  const handleUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      try {
        if (currentUserId) await uploadFile(currentUserId, event.target.files[0]);
        alert("File uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file.");
      }
    }
  };

  const handleUploadFolder = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      try {
        if (currentUserId) await uploadFolder(currentUserId, Array.from(event.target.files));
        alert("Folder uploaded successfully!");
      } catch (error) {
        console.error("Error uploading folder:", error);
        alert("Failed to upload folder.");
      }
    }
  };
  
  return (
    <div className="drive-context-panel">
      {/* + New Button with Dropdown */}
      <div className="new-drive-button-container">
        <button className="new-drive-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <Plus size={16} /> New
        </button>
        {dropdownOpen && (
          <div className="drive-dropdown-menu">
            <button className="drive-dropdown-item" onClick={handleCreateFolder}>📁 Create Folder</button>
            <label className="drive-dropdown-item">
              📄 Upload File
              <input type="file" hidden onChange={handleUploadFile} />
            </label>
            <label className="drive-dropdown-item">
              📂 Upload Folder
              <input type="file" hidden multiple onChange={handleUploadFolder} {...{ directory: "", webkitdirectory: "" }} />
            </label>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="drive-menu">
  <button className="drive-btn" onClick={() => { setDriveSection("drive-home") }}>
    <Home size={16} /> Home
  </button>
  <button className="drive-btn" onClick={() => { setDriveSection("drive-my-drive") }}>
    <Folder size={16} /> My Drive
  </button>
  <button className="drive-btn" onClick={() => { setDriveSection("drive-shared") }}>
    <Users size={16} /> Shared With Me
  </button>
  <button className="drive-btn" onClick={() => { setDriveSection("drive-starred") }}>
    <Star size={16} /> Starred
  </button>
  <button className="drive-btn" onClick={() => { setDriveSection("drive-trash") }}>
    <Trash2 size={16} /> Trash
  </button>
</div>

      {/* Storage Section */}
      <div className="storage-section">
        <div className="storage-text">
          <span><HardDrive size={16} /> Storage</span>
          <span>{(usedStorage / 1024).toFixed(1)}GB / 5GB</span>
        </div>
        <ProgressBar value={(usedStorage / totalStorage) * 100} />
      </div>
    </div>
  );
};

/* Progress Bar Component */
const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${value}%` }}></div>
    </div>
  );
};

export default DriveContextPanel;
