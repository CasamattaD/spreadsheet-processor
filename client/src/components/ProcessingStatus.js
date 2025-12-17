import React from 'react';
import './ProcessingStatus.css';

function ProcessingStatus() {
  return (
    <div className="processing-status">
      <div className="spinner"></div>
      <h3>Processing your file...</h3>
      <p>AI is analyzing and extracting OEM and Model data</p>
      <div className="processing-steps">
        <div className="step active">
          <span className="step-number">1</span>
          <span className="step-text">Reading file</span>
        </div>
        <div className="step active">
          <span className="step-number">2</span>
          <span className="step-text">Analyzing with AI</span>
        </div>
        <div className="step">
          <span className="step-number">3</span>
          <span className="step-text">Generating structured file</span>
        </div>
      </div>
    </div>
  );
}

export default ProcessingStatus;

