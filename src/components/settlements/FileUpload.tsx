import React, { useState, useRef } from 'react';
import './settlements-components.scss';

interface FileUploadProps {
  onClose: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Prepare the form data to send to the backend
    const formData = new FormData();
    formData.append('file', file);
    // Generate a unique batch ID for idempotency (in a real app, this might come from the user)
    formData.append('batchId', `BATCH-${Date.now()}`); 

    try {
      const response = await fetch('http://localhost:5000/api/settlements/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      alert('Batch uploaded successfully!');
      onClose(); // Close the upload panel on success
      
      // Ideally, you would trigger a refresh of the SettlementsTable here

    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-panel">
      <div 
        className="upload-dropzone cursor-pointer" 
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="dropzone-icon">{/* Your SVG Icon */}</div>
        <h3 className="dropzone-title">
          {isUploading ? 'Uploading...' : 'Select or drag a file'}
        </h3>
        <p className="dropzone-hint">Supports .csv or .json (Max 1,000 rows)</p>
        
        {/* Hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".csv,.json" 
          className="hidden" 
        />
        
        <div className="dropzone-actions">
          <button className="btn-browse" disabled={isUploading}>
            {isUploading ? 'Processing...' : 'Browse Files'}
          </button>
        </div>
      </div>
    </div>
  );
};