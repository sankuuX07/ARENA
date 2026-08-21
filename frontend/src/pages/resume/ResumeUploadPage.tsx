import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { ResumeUploadZone } from '../../components/resume/ResumeUploadZone';
import { resumeService } from '../../services/resumeService';
import { UploadCloud, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ResumeUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    
    try {
      // If the service doesn't perfectly emit progress, simulate a fast bar
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const response = await resumeService.uploadResume(file, (p) => {
        clearInterval(progressInterval);
        setProgress(p);
      });
      
      setProgress(100);
      clearInterval(progressInterval);
      
      // Navigate to details page for the newly uploaded resume
      setTimeout(() => {
        navigate(`/resume/${response.resume.resumeId}`);
      }, 500);
      
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || err.message || 'Upload failed. Please try again.');
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader 
        title="Upload Resume" 
        subtitle="Upload a new resume to your profile."
        icon={<UploadCloud size={28} />}
        action={
          <Button variant="outline" onClick={() => navigate('/resume')} icon={<ArrowLeft size={16} />}>
            Back
          </Button>
        }
      />

      <ResumeUploadZone 
        onUpload={handleUpload} 
        isLoading={isUploading} 
        progress={progress} 
      />
    </div>
  );
};
