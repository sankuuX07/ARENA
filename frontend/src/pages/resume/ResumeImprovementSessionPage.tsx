import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ResumeImprovementSuggestionCard } from '../../components/resume/improvement/ResumeImprovementSuggestionCard';
import { resumeImprovementService } from '../../services/resumeImprovementService';
import { ResumeImprovementSummary } from '../../types/resumeImprovement';
import { Activity, ArrowLeft, Wand2 } from 'lucide-react';

export const ResumeImprovementSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<ResumeImprovementSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateSection, setGenerateSection] = useState('Professional Summary');

  const fetchSummary = async () => {
    if (!sessionId) return;
    try {
      const data = await resumeImprovementService.getSessionSummary(sessionId);
      setSummary(data);
    } catch (err) {
      console.error(err);
      navigate('/resume/improve');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [sessionId]);

  const handleGenerate = async () => {
    if (!sessionId) return;
    setIsGenerating(true);
    try {
      await resumeImprovementService.generateSuggestions(sessionId, generateSection);
      await fetchSummary(); // Refresh to show new suggestions
    } catch (err) {
      console.error(err);
      alert('Failed to generate suggestions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccept = async (suggestionId: string) => {
    if (!sessionId) return;
    await resumeImprovementService.acceptSuggestion(sessionId, suggestionId);
    await fetchSummary();
  };

  const handleReject = async (suggestionId: string) => {
    if (!sessionId) return;
    await resumeImprovementService.rejectSuggestion(sessionId, suggestionId);
    await fetchSummary();
  };

  const handleEdit = async (suggestionId: string, editedText: string) => {
    if (!sessionId) return;
    await resumeImprovementService.editSuggestion(sessionId, suggestionId, editedText);
    await resumeImprovementService.acceptSuggestion(sessionId, suggestionId);
    await fetchSummary();
  };

  if (isLoading) return <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;
  if (!summary) return <div>Session not found.</div>;

  return (
    <div className="page-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <PageHeader 
        title="Resume Improvement Session" 
        subtitle="Review AI suggestions, compare before & after, and build your draft."
        icon={<Activity size={28} />}
        action={
          <Button variant="outline" onClick={() => navigate('/resume/improve')} icon={<ArrowLeft size={16} />}>
            Back
          </Button>
        }
      />

      <Card style={{ marginBottom: '2rem', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <select 
          value={generateSection}
          onChange={(e) => setGenerateSection(e.target.value)}
          style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)', flex: 1 }}
        >
          <option value="Professional Summary">Professional Summary</option>
          <option value="Projects">Projects</option>
          <option value="Experience">Experience</option>
          <option value="Technical Skills">Technical Skills</option>
        </select>
        <Button onClick={handleGenerate} disabled={isGenerating} icon={<Wand2 size={16} />}>
          {isGenerating ? 'Generating...' : 'Generate New Suggestions'}
        </Button>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {summary.suggestions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <Wand2 size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <h3>No suggestions yet</h3>
            <p>Select a section above and click Generate to get started.</p>
          </div>
        ) : (
          summary.suggestions
            .sort((a: any, b: any) => {
              const pMap: Record<string, number> = { high: 0, medium: 1, low: 2 };
              return pMap[a.priority] - pMap[b.priority];
            })
            .map(suggestion => (
              <ResumeImprovementSuggestionCard 
                key={suggestion.suggestionId} 
                suggestion={suggestion} 
                onAccept={handleAccept}
                onReject={handleReject}
                onEdit={handleEdit}
              />
            ))
        )}
      </div>
    </div>
  );
};
