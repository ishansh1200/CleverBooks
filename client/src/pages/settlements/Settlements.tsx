import React, { useState } from 'react';
import { FileUpload } from '../../components/settlements/FileUpload';
import { SettlementsTable } from '../../components/settlements/SettlementsTable';
import './Settlements.scss';

export const Settlements = () => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="settlements-wrapper">
      <header className="settlements-header animate-graceful">
        <div className="header-text">
          <h1 className="settlements-title">Settlements Manager</h1>
          <p className="settlements-subtitle">Upload and reconcile courier data batches.</p>
        </div>
        <button 
          className="upload-toggle-btn"
          onClick={() => setShowUpload(!showUpload)}
        >
          {showUpload ? 'Cancel Upload' : 'Upload New Batch'}
        </button>
      </header>

      {/* Conditionally render upload component with animation */}
      {showUpload && (
        <section className="settlements-section animate-graceful">
          <FileUpload onClose={() => setShowUpload(false)} />
        </section>
      )}

      <section className="settlements-section animate-graceful delay-100">
        <SettlementsTable />
      </section>
    </div>
  );
};