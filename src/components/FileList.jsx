import React, { useState, useRef, useEffect } from 'react';
import '../styles/ProjectPage.css';

const FileList = () => {
    const [files, setFiles] = useState([
        { name: 'index.html', type: 'file' },
        { name: 'App.jsx', type: 'file' },
        { name: 'components/', type: 'folder', children: ['Header.jsx', 'Footer.jsx'] },
        { name: 'styles/', type: 'folder', children: ['main.css', 'Login_page.css'] },
    ]);

    const [openFile, setOpenFile] = useState('');
    const [openFolders, setOpenFolders] = useState([]);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null });
    const [copiedItem, setCopiedItem] = useState(null); // For copy/paste functionality
    const [renameTarget, setRenameTarget] = useState(null); // For renaming functionality
    const [newName, setNewName] = useState('');
    const menuRef = useRef(null);

    // Folder toggle functionality
    const toggleFolder = (folderName) => {
        setOpenFolders(prevState =>
            prevState.includes(folderName)
                ? prevState.filter(name => name !== folderName)
                : [...prevState, folderName]
        );
    };

    // Handle file click
    const handleFileClick = (fileName) => {
        setOpenFile(fileName);
    };

    // Handle right-click context menu
    const handleContextMenu = (e, item) => {
        e.preventDefault();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, item });
    };

    // Handle delete action
    const handleDelete = () => {
        if (contextMenu.item.type === 'file') {
            const updatedFiles = files.filter(file => file.name !== contextMenu.item.name);
            setFiles(updatedFiles);
        } else if (contextMenu.item.type === 'folder') {
            const updatedFiles = files.filter(file => file.name !== contextMenu.item.name);
            setFiles(updatedFiles);
        }
        setContextMenu({ ...contextMenu, visible: false });
    };

    // Handle copy action
    const handleCopy = () => {
        setCopiedItem(contextMenu.item);
        setContextMenu({ ...contextMenu, visible: false });
    };

    // Handle paste action
    const handlePaste = () => {
        if (copiedItem && contextMenu.item.type === 'folder') {
            const updatedFiles = files.map(file => {
                if (file.name === contextMenu.item.name) {
                    return { ...file, children: [...file.children, copiedItem.name] };
                }
                return file;
            });
            setFiles(updatedFiles);
            setCopiedItem(null); // Clear clipboard
        }
        setContextMenu({ ...contextMenu, visible: false });
    };

    // Handle renaming
    const handleRename = () => {
        setRenameTarget(contextMenu.item);
        setContextMenu({ ...contextMenu, visible: false });
    };

    const submitRename = () => {
        const updatedFiles = files.map(file => {
            if (file.name === renameTarget.name) {
                return { ...file, name: newName };
            }
            return file;
        });
        setFiles(updatedFiles);
        setRenameTarget(null);
        setNewName('');
    };

    // Collapse all folders
    const collapseAll = () => {
        setOpenFolders([]);
    };

    // Handle click outside the menu to close it
    const handleClickOutsideMenu = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setContextMenu({ ...contextMenu, visible: false });
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutsideMenu);
        return () => {
            document.removeEventListener('click', handleClickOutsideMenu);
        };
    }, [contextMenu]);

    // Function to add a new folder
    const addFolder = () => {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
            setFiles([...files, { name: folderName, type: 'folder', children: [] }]);
        }
    };

    // Function to add a new file
    const addFileToFolder = (folderName) => {
        const fileName = prompt('Enter file name:');
        if (fileName) {
            const updatedFiles = files.map(file => {
                if (file.name === folderName) {
                    return { ...file, children: [...file.children, fileName] };
                }
                return file;
            });
            setFiles(updatedFiles);
        }
    };

    return (
        <div className="file-list">
            <div className="controls">
                <span className="collapse-all" onClick={collapseAll}>
                    ⌃ {/* Collapse All Icon */}
                </span>
                <span className="add-folder" onClick={addFolder}>
                    + {/* Add Folder Icon */}
                </span>
            </div>
            <ul>
                {files.map((file, index) => (
                    file.type === 'file' ? (
                        <li
                            key={index}
                            className={openFile === file.name ? 'active' : ''}
                            onClick={() => handleFileClick(file.name)}
                            onContextMenu={(e) => handleContextMenu(e, file)}
                        >
                            {renameTarget && renameTarget.name === file.name ? (
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onBlur={submitRename}
                                    autoFocus
                                />
                            ) : (
                                file.name
                            )}
                        </li>
                    ) : (
                        <li key={index} className="folder">
                            <div className="folder-name" onClick={() => toggleFolder(file.name)}>
                                <span className={`folder-arrow ${openFolders.includes(file.name) ? 'open' : ''}`}>
                                    &#9654;
                                </span>
                                <span>{file.name}</span>
                                <span className="folder-add" onClick={(e) => {
                                    e.stopPropagation();
                                    addFileToFolder(file.name);
                                }}>
                                    +
                                </span>
                            </div>

                            <ul className={`folder-contents ${openFolders.includes(file.name) ? 'open' : ''}`}>
                                {file.children && file.children.map((child, i) => (
                                    <li
                                        key={i}
                                        className={openFile === child ? 'active' : ''}
                                        onClick={() => handleFileClick(child)}
                                        onContextMenu={(e) => handleContextMenu(e, { name: child, type: 'file' })}
                                    >
                                        {renameTarget && renameTarget.name === child ? (
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                onBlur={submitRename}
                                                autoFocus
                                            />
                                        ) : (
                                            child
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    )
                ))}
            </ul>

            {/* Right-click Context Menu */}
            {contextMenu.visible && (
                <div
                    className="folder-menu"
                    ref={menuRef}
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <div className="folder-menu-item" onClick={handleDelete}>
                        Delete
                    </div>
                    <div className="folder-menu-item" onClick={handleCopy}>
                        Copy
                    </div>
                    <div className={`folder-menu-item ${!copiedItem ? 'disabled' : ''}`} onClick={handlePaste}>
                        Paste
                    </div>
                    <div className="folder-menu-item" onClick={handleRename}>
                        Rename
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileList;
