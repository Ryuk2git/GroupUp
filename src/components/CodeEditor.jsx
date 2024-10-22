// CodeEditorPage.jsx
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
  const [editorHeight, setEditorHeight] = useState('80%');
  const [consoleHeight, setConsoleHeight] = useState('150px');
  const [isResizing, setIsResizing] = useState(false);

  const handleEditorChange = (value) => {
    const updatedFiles = [...files];
    updatedFiles[activeFileIndex].content = value;
    setFiles(updatedFiles);
  };

  const runCode = () => {
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
    const newEditorHeight = `${e.clientY}px`;
    setEditorHeight(newEditorHeight);
    setConsoleHeight(`calc(100vh - ${newEditorHeight} - 35px)`);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  return (
    <div className="code-editor-page" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
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

      <div className="editor-container" style={{ height: editorHeight }}>
        <MonacoEditor
          height="100%"
          language={files[activeFileIndex].name.endsWith('.py') ? 'python' : 'javascript'}
          theme="vs-dark"
          value={files[activeFileIndex].content}
          onChange={handleEditorChange}
        />
      </div>

      <div className="split-pane-divider" onMouseDown={handleMouseDown}></div>

      <div className="console" style={{ height: consoleHeight }}>
        <div className="console-output">
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPage;
