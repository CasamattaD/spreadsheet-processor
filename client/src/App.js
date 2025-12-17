import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import ProcessingStatus from './components/ProcessingStatus';
import Results from './components/Results';

function App() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process file');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while processing the file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (result && result.outputFile) {
      try {
        const response = await fetch(`/api/download/${result.outputFile}`);
        if (!response.ok) {
          throw new Error('Failed to download file');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.outputFile;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        setError('Failed to download file: ' + error.message);
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setIsProcessing(false);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>Spreadsheet Processor</h1>
          <p className="subtitle">
            Upload Excel files to extract OEM and Model data using AI
          </p>
        </header>

        <main className="main-content">
          {!result ? (
            <>
              <FileUpload
                file={file}
                onFileSelect={handleFileSelect}
                onUpload={handleUpload}
                disabled={isProcessing}
              />
              {isProcessing && <ProcessingStatus />}
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}
            </>
          ) : (
            <Results
              result={result}
              onDownload={handleDownload}
              onReset={handleReset}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

