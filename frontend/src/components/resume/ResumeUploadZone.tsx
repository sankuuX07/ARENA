import React, { useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ResumeUploadZoneProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
  progress?: number;
}

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const ResumeUploadZone: React.FC<ResumeUploadZoneProps> = ({ onUpload, isLoading, progress }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.docx')) {
      setError("Please select a PDF or DOCX file.");
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <Card style={{ padding: '2rem', textAlign: 'center' }}>
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '3rem 2rem',
            background: dragActive ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-surface-elevated)',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        >
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleChange}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              opacity: 0,
              cursor: 'pointer'
            }}
          />
          <UploadCloud size={48} style={{ color: dragActive ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Upload Your Resume</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>PDF or DOCX. Maximum file size: {MAX_SIZE_MB} MB</p>
          <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Drop resume here or Click to Choose</div>
          {error && <div style={{ color: 'var(--danger)', marginTop: '1rem', fontWeight: 500 }}>{error}</div>}
        </div>
      ) : (
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <FileText size={32} style={{ color: 'var(--primary)' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedFile.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{(selectedFile.size / 1024).toFixed(0)} KB</div>
            </div>
            {!isLoading && (
              <button 
                onClick={() => setSelectedFile(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: '1rem' }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {isLoading ? (
            <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span>Uploading...</span>
                <span>{progress || 0}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${progress || 0}%`, 
                  background: 'var(--primary)',
                  transition: 'width 0.2s ease'
                }} />
              </div>
            </div>
          ) : (
            <Button onClick={handleUploadClick} fullWidth style={{ maxWidth: '300px' }}>Upload Resume</Button>
          )}
        </div>
      )}
    </Card>
  );
};
