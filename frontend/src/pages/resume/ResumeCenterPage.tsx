import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { FileText, Upload } from 'lucide-react';
import { ActiveResumeCard } from '../../components/resume/ActiveResumeCard';
import { resumeService } from '../../services/resumeService';
import { ResumeDetail } from '../../types/resume';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const ResumeCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeResume, setActiveResume] = useState<ResumeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const resume = await resumeService.getActiveResume();
        setActiveResume(resume);
      } catch (err) {
        console.error('Failed to load active resume', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActive();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Loading Resume Center..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader 
        title="Resume Center" 
        subtitle="Upload and manage your resume for future screening and improvement."
        icon={<FileText size={28} />}
        action={
          <Button onClick={() => navigate('/resume/upload')} icon={<Upload size={16} />}>
            Upload Resume
          </Button>
        }
      />

      <div style={{ marginBottom: '2rem' }}>
        <ActiveResumeCard resume={activeResume} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        <Button variant="outline" onClick={() => navigate('/resume/history')}>
          Manage Resume History
        </Button>
      </div>
    </div>
  );
};
