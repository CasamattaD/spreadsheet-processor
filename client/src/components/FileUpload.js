import React, { useRef } from 'react';
import './FileUpload.css';

function FileUpload({ file, onFileSelect, onUpload, disabled }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-drop-zone ${file ? 'has-file' : ''} ${disabled ? 'disabled' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />
        
        {file ? (
          <div className="file-selected">
            <div className="file-icon">📄</div>
            <div className="file-info">
              <div className="file-name">{file.name}</div>
              <div className="file-size">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <button
              className="change-file-btn"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={disabled}
            >
              Change File
            </button>
          </div>
        ) : (
          <div className="file-drop-content">
            <div className="upload-icon">📤</div>
            <h3>Drop your Excel file here</h3>
            <p>or click to browse</p>
            <p className="file-types">Supports .xlsx, .xls, and .csv files</p>
          </div>
        )}
      </div>

      {file && (
        <button
          className="upload-button"
          onClick={onUpload}
          disabled={disabled}
        >
          {disabled ? 'Processing...' : 'Process File'}
        </button>
      )}
    </div>
  );
}

export default FileUpload;

