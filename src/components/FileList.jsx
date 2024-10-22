import React, { useState, useRef, useEffect } from 'react';
import '../styles/ProjectPage.css';

const FileList = () => {
    const [files, setFiles] = useState([
        { name: 'index.html', type: 'file' },
        { name: 'App.jsx', type: 'file' },
        { name: 'components/', type: 'folder', children: [] },
        { name: 'styles/', type: 'folder', children: [] },
    ]);

    const [openFile, setOpenFile] = useState('');
    const [openFolders, setOpenFolders] = useState([]);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null });
    const [copiedItem, setCopiedItem] = useState(null);
    const [renameTarget, setRenameTarget] = useState(null);
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
        const updatedFiles = deleteItem(files, contextMenu.item.name);
        setFiles(updatedFiles);
        setContextMenu({ ...contextMenu, visible: false });
    };

    // Helper function to delete item recursively
    const deleteItem = (items, name) => {
        return items.reduce((acc, item) => {
            if (item.name === name) {
                return acc; // Skip the item to delete
            }
            if (item.type === 'folder') {
                const updatedChildren = deleteItem(item.children, name);
                acc.push({ ...item, children: updatedChildren });
            } else {
                acc.push(item);
            }
            return acc;
        }, []);
    };

    // Handle copy action
    const handleCopy = () => {
        setCopiedItem(contextMenu.item);
        setContextMenu({ ...contextMenu, visible: false });
    };

    // Handle paste action
    const handlePaste = () => {
        if (copiedItem && contextMenu.item.type === 'folder') {
            const updatedFiles = pasteItem(files, contextMenu.item.name);
            setFiles(updatedFiles);
            setCopiedItem(null);
        }
        setContextMenu({ ...contextMenu, visible: false });
    };

    // Helper function to paste item into folder
    const pasteItem = (items, folderName) => {
        return items.map(item => {
            if (item.name === folderName) {
                return { ...item, children: [...item.children, { ...copiedItem, name: copiedItem.name }] };
            } else if (item.type === 'folder') {
                return { ...item, children: pasteItem(item.children, folderName) };
            }
            return item;
        });
    };

    // Handle renaming
    const handleRename = () => {
        setRenameTarget(contextMenu.item);
        setContextMenu({ ...contextMenu, visible: false });
    };

    const submitRename = () => {
        const updatedFiles = renameItem(files, renameTarget.name);
        setFiles(updatedFiles);
        setRenameTarget(null);
        setNewName('');
    };

    // Helper function to rename item
    const renameItem = (items, oldName) => {
        return items.map(item => {
            if (item.name === oldName) {
                return { ...item, name: newName };
            } else if (item.type === 'folder') {
                return { ...item, children: renameItem(item.children, oldName) };
            }
            return item;
        });
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

    // Function to add a new file to a folder
    const addFileToFolder = (folderName) => {
        const fileName = prompt('Enter file name:');
        if (fileName) {
            const updatedFiles = addItemToFolder(files, folderName, { name: fileName, type: 'file' });
            setFiles(updatedFiles);
        }
    };

    // Helper function to add item to folder
    const addItemToFolder = (items, folderName, newItem) => {
        return items.map(item => {
            if (item.name === folderName) {
                return { ...item, children: [...item.children, newItem] };
            } else if (item.type === 'folder') {
                return { ...item, children: addItemToFolder(item.children, folderName, newItem) };
            }
            return item;
        });
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
                                        className={openFile === child.name ? 'active' : ''}
                                        onClick={() => handleFileClick(child.name)}
                                        onContextMenu={(e) => handleContextMenu(e, child)}
                                    >
                                        {renameTarget && renameTarget.name === child.name ? (
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                onBlur={submitRename}
                                                autoFocus
                                            />
                                        ) : (
                                            child.name
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    )
                ))}
            </ul>

            {/* Right-click Context Menu */}
            <div
                className={`folder-menu ${contextMenu.visible ? 'active' : ''}`}
                ref={menuRef}
                style={{ top: contextMenu.y, left: contextMenu.x }}
            >
                <div className="folder-menu-item" onClick={handleDelete}>Delete</div>
                <div className="folder-menu-item" onClick={handleCopy}>Copy</div>
                <div className={`folder-menu-item ${!copiedItem ? 'disabled' : ''}`} onClick={handlePaste}>Paste</div>
                <div className="folder-menu-item" onClick={handleRename}>Rename</div>
            </div>
        </div>
    );
};

export default FileList;
