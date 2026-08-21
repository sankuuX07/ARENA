import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Calendar, HardDrive, CheckCircle } from 'lucide-react';
import { ResumeDetail } from '../../types/resume';
import { useNavigate } from 'react-router-dom';

interface ActiveResumeCardProps {
  resume: ResumeDetail | null;
}

export const ActiveResumeCard: React.FC<ActiveResumeCardProps> = ({ resume }) => {
  const navigate = useNavigate();

  if (!resume) {
    return (
      <Card style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--bg-surface-elevated)' }}>
        <FileText size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
        <h3 style={{ marginBottom: '0.5rem' }}>No active resume</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Upload your resume to prepare for future AI screening and improvement.
        </p>
        <Button onClick={() => navigate('/resume/upload')}>Upload Resume</Button>
      </Card>
    );
  }

  const formatSize = (bytes: number) => `${Math.round(bytes / 1024)} KB`;

  return (
    <Card style={{ border: '2px solid var(--primary)', position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        top: '-12px', 
        left: '20px', 
        background: 'var(--primary)', 
        color: 'white', 
        padding: '0.25rem 1rem', 
        borderRadius: '1rem',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
      }}>
        <CheckCircle size={14} /> Active Resume
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <FileText size={40} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>{resume.originalFileName}</h2>
            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} /> Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HardDrive size={16} /> {formatSize(resume.fileSize)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Button onClick={() => navigate(`/resume/${resume.resumeId}`)}>View Resume</Button>
          <Button variant="outline" onClick={() => navigate('/resume/upload')}>Replace Resume</Button>
        </div>
      </div>
    </Card>
  );
};
