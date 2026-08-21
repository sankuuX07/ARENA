import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Calendar, HardDrive } from 'lucide-react';
import { ResumeListItem } from '../../types/resume';
import { useNavigate } from 'react-router-dom';

interface ResumeCardProps {
  resume: ResumeListItem;
  onSetActive?: (id: string) => void;
  isSettingActive?: boolean;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onSetActive, isSettingActive }) => {
  const navigate = useNavigate();
  const formatSize = (bytes: number) => `${Math.round(bytes / 1024)} KB`;
  
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <FileText size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', wordBreak: 'break-all' }}>{resume.originalFileName}</h3>
            {resume.isActive && (
              <span style={{ 
                background: 'var(--success)', 
                color: 'white', 
                padding: '0.15rem 0.5rem', 
                borderRadius: '1rem', 
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                Active
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} /> Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HardDrive size={16} /> Size: {formatSize(resume.fileSize)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        <Button variant="outline" fullWidth onClick={() => navigate(`/resume/${resume.resumeId}`)}>View Details</Button>
        {!resume.isActive && onSetActive && (
          <Button variant="primary" fullWidth onClick={() => onSetActive(resume.resumeId)} disabled={isSettingActive}>
            Set Active
          </Button>
        )}
      </div>
    </Card>
  );
};
