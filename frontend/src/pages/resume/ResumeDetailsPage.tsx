import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { resumeService } from '../../services/resumeService';
import { ResumeDetail } from '../../types/resume';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { FileText, ArrowLeft, Download, Trash2, CheckCircle, Wand2 } from 'lucide-react';

export const ResumeDetailsPage: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!resumeId) return;
      try {
        const data = await resumeService.getResumeDetails(resumeId);
        setResume(data);
      } catch (err) {
        console.error(err);
        navigate('/resume/history');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [resumeId, navigate]);

  const handleSetActive = async () => {
    if (!resume || isProcessing) return;
    setIsProcessing(true);
    try {
      const updated = await resumeService.setActiveResume(resume.resumeId);
      setResume(updated);
      // Optional: navigate to center to see it active
      navigate('/resume');
    } catch (err) {
      console.error(err);
      alert('Failed to set active resume');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!resume || isProcessing) return;
    if (window.confirm('Are you sure you want to delete this resume? This cannot be undone.')) {
      setIsProcessing(true);
      try {
        await resumeService.deleteResume(resume.resumeId);
        navigate('/resume/history');
      } catch (err) {
        console.error(err);
        alert('Failed to delete resume');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleDownload = () => {
    if (!resume) return;
    const url = resumeService.getDownloadUrl(resume.resumeId);
    window.open(url, '_blank');
  };

  if (isLoading) return <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;
  if (!resume) return <div>Resume not found</div>;

  const formatSize = (bytes: number) => `${Math.round(bytes / 1024)} KB`;

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader 
        title="Resume Details" 
        icon={<FileText size={28} />}
        action={
          <Button variant="outline" onClick={() => navigate('/resume')} icon={<ArrowLeft size={16} />}>
            Back
          </Button>
        }
      />

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>{resume.originalFileName}</h2>
            {resume.isActive ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontWeight: 'bold' }}>
                <CheckCircle size={16} /> Active Resume
              </span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Inactive</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" onClick={() => navigate(`/resume/${resume.resumeId}/improve`)} icon={<Wand2 size={16} />}>Improve Resume</Button>
            <Button variant="outline" onClick={handleDownload} icon={<Download size={16} />}>Download</Button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Upload Date</div>
            <div style={{ fontWeight: 500 }}>{new Date(resume.uploadedAt).toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>File Size</div>
            <div style={{ fontWeight: 500 }}>{formatSize(resume.fileSize)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>File Type</div>
            <div style={{ fontWeight: 500, textTransform: 'uppercase' }}>{resume.fileExtension}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Resume ID</div>
            <div style={{ fontWeight: 500, fontFamily: 'monospace', fontSize: '0.9rem' }}>{resume.resumeId}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <Button 
            variant="outline"
            style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} 
            onClick={handleDelete} 
            disabled={isProcessing}
            icon={<Trash2 size={16} />}
          >
            Delete Resume
          </Button>

          {!resume.isActive && (
            <Button 
              variant="primary" 
              onClick={handleSetActive} 
              disabled={isProcessing}
              icon={<CheckCircle size={16} />}
            >
              Set as Active
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
