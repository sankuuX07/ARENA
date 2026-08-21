import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Upload, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resumeService } from '../../services/resumeService';
import { ResumeDetail } from '../../types/resume';

export const ResumeWidget: React.FC = () => {
  const navigate = useNavigate();
  const [activeResume, setActiveResume] = useState<ResumeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const resume = await resumeService.getActiveResume();
        setActiveResume(resume);
      } catch (err) {
        console.error('Failed to load active resume for widget', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActive();
  }, []);

  if (loading) return null;

  return (
    <Card style={{ marginBottom: '1.5rem', background: 'var(--bg-surface-elevated)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <FileText size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>Resume</h3>
            {activeResume ? (
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span style={{ fontWeight: 500 }}>{activeResume.originalFileName}</span>
                <span style={{ margin: '0 0.5rem' }}>•</span>
                <span style={{ color: 'var(--success)' }}>Ready</span>
              </div>
            ) : (
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Upload your resume to prepare for screening.
              </div>
            )}
          </div>
        </div>
        <div>
          {activeResume ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="outline" onClick={() => navigate('/resume/improve')} icon={<Wand2 size={16} />}>Improve</Button>
              <Button variant="outline" onClick={() => navigate('/resume')}>Manage</Button>
            </div>
          ) : (
            <Button onClick={() => navigate('/resume/upload')} icon={<Upload size={16} />}>Upload Resume</Button>
          )}
        </div>
      </div>
    </Card>
  );
};
