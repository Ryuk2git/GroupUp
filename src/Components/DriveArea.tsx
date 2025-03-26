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
            {/* Top Section Container */}
            <div className="drive-top-section">
                {/* Categories & Storage */}
                <section className="drive-categories-section">
                    <h1 className="drive-main-heading">Categories</h1>
                    <button className="drive-add-files-btn">
                        Add new files
                    </button>
                    
                    <div className="drive-storage-info">
                        <div className="drive-storage-header">
                            <span className="drive-storage-label">Your storage</span>
                            <span className="drive-storage-left">25% left</span>
                        </div>
                        <div className="drive-progress-bar">
                            <div className="drive-progress-fill" style={{ width: '75%' }}></div>
                        </div>
                        <div className="drive-storage-details">
                            75 GB of 100 GB are used
                        </div>
                    </div>
                </section>

                {/* Recent Files */}
                <section className="drive-recent-section">
                    <h2 className="drive-section-heading">Recent files</h2>
                    <div className="drive-files-table">
                        <div className="drive-table-header">
                            <div className="drive-col-type">File Type</div>
                            <div className="drive-col-size">Size</div>
                            <div className="drive-col-shared">Shared Folders</div>
                        </div>
                        <div className="drive-table-row">
                            <div className="drive-col-type">PNG file</div>
                            <div className="drive-col-size">5 MB</div>
                            <div className="drive-col-shared">Your shared folders</div>
                        </div>
                        <div className="drive-table-row">
                            <div className="drive-col-type">AVI file</div>
                            <div className="drive-col-size">105 MB</div>
                            <div className="drive-col-shared">Design files</div>
                        </div>
                        <div className="drive-table-row">
                            <div className="drive-col-type">MP3 file</div>
                            <div className="drive-col-size">21 MB</div>
                            <div className="drive-col-shared">Sumer photos</div>
                        </div>
                        <div className="drive-table-row">
                            <div className="drive-col-type">DOCx file</div>
                            <div className="drive-col-size">500 kb</div>
                            <div className="drive-col-shared">Project report</div>
                        </div>
                    </div>
                    <button className="drive-add-more-btn">Add more</button>
                </section>
            </div>
        </div>
    );
};


const MyDrive: React.FC = () => {
    const { user } = useAuth();
    const currentUserId = user?.userID;
    const [files, setFiles] = useState<{ name: string; type: string }[]>([]);
    
    useEffect(() => {
        const loadDriveData = async () => {
            if (!currentUserId) return;
            const content = await fetchUserDriveData(currentUserId);
            setFiles(content || []);
        };

        loadDriveData();
    }, [currentUserId]);

    return (
        <div className="my-drive">
            <h2>My Drive</h2>
            <FileGrid files={files}/>
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


export default DriveArea;
