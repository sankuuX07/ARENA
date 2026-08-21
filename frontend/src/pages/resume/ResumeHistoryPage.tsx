import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { ResumeCard } from '../../components/resume/ResumeCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { resumeService } from '../../services/resumeService';
import { ResumeListItem } from '../../types/resume';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { FileText, ArrowLeft, Upload } from 'lucide-react';

export const ResumeHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchResumes = async () => {
    try {
      const data = await resumeService.getResumes();
      setResumes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleSetActive = async (id: string) => {
    setIsProcessing(id);
    try {
      await resumeService.setActiveResume(id);
      await fetchResumes(); // Refresh list to show new active status
    } catch (err) {
      console.error(err);
      alert('Failed to set active resume');
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading) return <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;

  return (
    <div className="page-container">
      <PageHeader 
        title="Resume History" 
        subtitle="Manage all your uploaded resumes."
        icon={<FileText size={28} />}
        action={
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="outline" onClick={() => navigate('/resume')} icon={<ArrowLeft size={16} />}>
              Back
            </Button>
            <Button onClick={() => navigate('/resume/upload')} icon={<Upload size={16} />}>
              Upload New
            </Button>
          </div>
        }
      />

      {resumes.length === 0 ? (
        <EmptyState 
          icon={<FileText size={36} />} 
          title="No resumes found" 
          description="You haven't uploaded any resumes yet."
          action={<Button onClick={() => navigate('/resume/upload')}>Upload Resume</Button>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {resumes.map(resume => (
            <ResumeCard 
              key={resume.resumeId} 
              resume={resume} 
              onSetActive={handleSetActive}
              isSettingActive={isProcessing === resume.resumeId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
