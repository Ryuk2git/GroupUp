import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../Context/GlobalProvider"; // Using the Global Context
import { useAuth } from "../Context/AuthContext";
import { fetchUserDriveData } from "../Context/api";


const DriveArea: React.FC = () => {
    const { driveSection } = useGlobalContext();

    return (
        <div className="drive-content">
            {driveSection === "drive-home" && <DriveHome />}
            {driveSection === "drive-my-drive" && <MyDrive />}
            {driveSection === "drive-shared" && <Shared />}
            {driveSection === "drive-starred" && <Starred />}
            {driveSection === "drive-trash" && <Trash />}
        </div>
    );
};

/* Drive Section Components */
const DriveHome: React.FC = () => {
    return (
        <div className="drive-container">
        <div className="drive-main">
          <div className="drive-filters">
            <button className="drive-filter">People</button>
            <button className="drive-filter">Modified</button>
            <button className="drive-filter">Type</button>
          </div>
  
          <h2 className="drive-title">Categories</h2>
          <div className="drive-categories">
            <div className="drive-category">Documents</div>
            <div className="drive-category">Images</div>
            <div className="drive-category">Videos</div>
            <div className="drive-category">Audio</div>
          </div>
  
          <h3 className="drive-subtitle">Recent Files</h3>
          <div className="drive-recent-files">
            <Tile type="file" name="Report.pdf" owner="John Doe" modified="Mar 25" size="2MB" />
            <Tile type="file" name="Presentation.pptx" owner="Jane Smith" modified="Mar 26" size="5MB" />
          </div>
  
          <h3 className="drive-subtitle">Recent Folders</h3>
          <div className="drive-recent-folders">
            <Tile type="folder" name="Project Docs" owner="-" modified="Mar 24" size="-" />
            <Tile type="folder" name="Design Assets" owner="-" modified="Mar 23" size="-" />
            <Tile type="folder" name="Design Assets" owner="-" modified="Mar 23" size="-" />
            <Tile type="folder" name="Design Assets" owner="-" modified="Mar 23" size="-" />

          </div>
        </div>
  
        <div className="drive-sidebar">
          <div className="drive-shared">
            <h3>Your Shared Files</h3>
            <div className="drive-shared-file">
              <span>File Name 1</span>
              <div className="drive-shared-icons"></div>
            </div>
            <div className="drive-shared-file">
              <span>File Name 2</span>
              <div className="drive-shared-icons"></div>
            </div>
          </div>
        </div>
      </div>
    );
};


const MyDrive: React.FC = () => {
    const { user } = useAuth();
    const currentUserId = user?.userID;
    const [files, setFiles] = useState<{ name: string; size: string | null; createdAt: string }[]>([]);
    const [folders, setFolders] = useState<{ name: string; size: string | null; createdAt: string }[]>([]);

    useEffect(() => {
        const loadDriveData = async () => {
            if (!currentUserId) return;

            try {
                const response = await fetchUserDriveData(currentUserId);

                // Separate files and folders based on `isFolder` property
                const fetchedFolders = response.filter((item: any) => item.isFolder);
                const fetchedFiles = response.filter((item: any) => !item.isFolder);

                setFolders(fetchedFolders || []);
                setFiles(fetchedFiles || []);
                console.log("Files:", fetchedFiles);
                
            } catch (error) {
                console.error("Error loading drive data:", error);
            }
        };

        loadDriveData();
    }, [currentUserId]);

    return (
        <div className="drive-container">
            <div className="drive-main">
                {/* Filters */}
                <div className="drive-filters">
                    <button className="drive-filter">People</button>
                    <button className="drive-filter">Modified</button>
                    <button className="drive-filter">Type</button>
                </div>

                {/* Folders Section */}
                <h3 className="drive-subtitle">Folders</h3>
                <div className="drive-recent-folders">
                    {folders.length > 0 ? (
                        folders.map((folder, index) => (
                            <Tile
                                key={index}
                                type="folder"
                                name={folder.name}
                                owner="-" // Replace with actual owner if available
                                modified={new Date(folder.createdAt).toLocaleDateString()} // Format createdAt date
                                size={folder.size || "-"} // Folders typically don't have a size
                            />
                        ))
                    ) : (
                        <p>No folders found</p>
                    )}
                </div>

                {/* Files Section */}
                <h3 className="drive-subtitle">Files</h3>
                <div className="drive-recent-files">
                    {files.length > 0 ? (
                        files.map((file, index) => (
                            <Tile
                                key={index}
                                type="file"
                                name={file.name}
                                owner="Me" // Replace with actual owner if available
                                modified={new Date(file.createdAt).toLocaleDateString()} // Format createdAt date
                                size={file.size || "Unknown"} // Replace with actual size if available
                            />
                        ))
                    ) : (
                        <p>No files found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const Shared: React.FC = () => {
    return (
        <div className="shared">
            <h2>Shared with Me</h2>
            <FileList files={[{ name: "Team Presentation.pptx", owner: "John Doe" }]} />
        </div>
    );
};

const Starred: React.FC = () => {
    return (
        <div className="starred">
            <h2>Starred Files</h2>
            <FileList files={[{ name: "Important Report.pdf", owner: "Me" }]} />
        </div>
    );
};

const Trash: React.FC = () => {
    return (
        <div className="trash">
            <h2>Trash</h2>
            <FileList files={[{ name: "Old Project.zip", owner: "Me" }]} />
        </div>
    );
};

/* Reusable Components */
const FileCard: React.FC<{ fileName: string; fileType: string }> = ({ fileName, fileType }) => {
    return (
        <div className="file-card">
            <span className={`file-icon ${fileType}`}></span>
            <p>{fileName}</p>
        </div>
    );
};

const FileGrid: React.FC<{ files: { name: string; type: string }[] }> = ({ files }) => {
    return (
        <div className="file-grid">
            {files.length > 0 ? (
                files.map((file, index) => <FileCard key={index} fileName={file.name} fileType={file.type} />)
            ) : (
                <p>No files found</p>
            )}
        </div>
    );
};

const FileList: React.FC<{ files: { name: string; owner: string }[] }> = ({ files }) => {
    return (
        <ul className="file-list">
            {files.map((file, index) => (
                <li key={index}>
                    📄 {file.name} <span className="owner">({file.owner})</span>
                </li>
            ))}
        </ul>
    );
};

const Tile: React.FC<{ type: string; name: string; owner: string; modified: string; size: string }> = ({ type, name, owner, modified, size }) => {
    return (
      <div className={`drive-tile ${type === "folder" ? "drive-folder-tile" : "drive-file-tile"}`}>
        <div className="drive-tile-left">
          <span className={`drive-tile-icon ${type}`}></span>
          <span className="drive-tile-name">{name}</span>
        </div>
        {type === "file" && (
          <div className="drive-tile-center">
            <span className="drive-tile-owner">{owner}</span>
            <span className="drive-tile-modified">{modified}</span>
          </div>
        )}
        <div className="drive-tile-right">
          {type === "file" ? <span className="drive-tile-size">{size}</span> : null}
          <span className="drive-tile-options">⋮</span>
        </div>
      </div>
    );
  };
  


export default DriveArea;
