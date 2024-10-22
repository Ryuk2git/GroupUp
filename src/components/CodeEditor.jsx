import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import '../styles/CodeEditor.css';

const CodeEditorPage = () => {
  const [files, setFiles] = useState([
    { name: 'file1.js', content: '// Write your code here' },
    { name: 'file2.py', content: '# Python code here' },
  ]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [output, setOutput] = useState('');
  const [editorHeight, setEditorHeight] = useState('80%');  // Initial editor height
  const [consoleHeight, setConsoleHeight] = useState('150px');  // Initial console height
  const [isResizing, setIsResizing] = useState(false);  // Track if resizing is happening

  const handleEditorChange = (value) => {
    const updatedFiles = [...files];
    updatedFiles[activeFileIndex].content = value;
    setFiles(updatedFiles);
  };

  const runCode = () => {
    // Dummy compilation logic
    setOutput(`Running ${files[activeFileIndex].name}...\nOutput:\nHello, World!`);
  };

  const switchTab = (index) => {
    setActiveFileIndex(index);
  };

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    const newEditorHeight = `${e.clientY}px`; // Set editor height based on cursor Y position
    setEditorHeight(newEditorHeight);
    setConsoleHeight(`calc(100vh - ${newEditorHeight} - 35px)`); // Adjust console height
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  return (
    <div className="code-editor-page" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* Top Bar with Tabs and Run Button */}
      <div className="top-bar">
        <div className="tabs">
          {files.map((file, index) => (
            <div
              key={index}
              className={`tab ${index === activeFileIndex ? 'active' : ''}`}
              onClick={() => switchTab(index)}
            >
              {file.name}
            </div>
          ))}
        </div>
        <div className="run-button-container">
          <button className="run-button" onClick={runCode}>&#9654;</button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="editor-container" style={{ height: editorHeight }}>
        <MonacoEditor
          height="100%" // Editor fills the remaining space
          language={files[activeFileIndex].name.endsWith('.py') ? 'python' : 'javascript'}
          theme="vs-dark"
          value={files[activeFileIndex].content}
          onChange={handleEditorChange}
        />
      </div>

      {/* Split Pane Divider */}
      <div className="split-pane-divider" onMouseDown={handleMouseDown}></div>

      {/* Console at the Bottom */}
      <div className="console" style={{ height: consoleHeight }}>
        <div className="console-output">
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPage;
