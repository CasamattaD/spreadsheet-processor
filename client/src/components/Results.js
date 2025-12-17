import React from 'react';
import './Results.css';

function Results({ result, onDownload, onReset }) {
  const dataCount = result.data ? result.data.length : 0;

  return (
    <div className="results-container">
      <div className="success-header">
        <div className="success-icon">✅</div>
        <h2>File Processed Successfully!</h2>
        <p>Extracted {dataCount} {dataCount === 1 ? 'record' : 'records'}</p>
      </div>

      {result.data && result.data.length > 0 && (
        <div className="preview-section">
          <h3>Preview ({result.data.length} {result.data.length === 1 ? 'record' : 'records'}):</h3>
          <div className="table-container">
            <table className="preview-table">
              <thead>
                <tr>
                  <th>OEM</th>
                  <th>Model</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.OEM}</td>
                    <td>{item.Model}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="actions">
        <button className="download-button" onClick={onDownload}>
          <span className="download-icon">⬇️</span>
          Download Structured Excel File
        </button>
        <button className="reset-button" onClick={onReset}>
          Process Another File
        </button>
      </div>
    </div>
  );
}

export default Results;

