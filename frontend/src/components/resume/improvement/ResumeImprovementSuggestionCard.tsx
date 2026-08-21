import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ResumeBeforeAfterComparison } from './ResumeBeforeAfterComparison';
import { ResumeSuggestionEditor } from './ResumeSuggestionEditor';
import { ResumeImprovementSuggestion } from '../../../types/resumeImprovement';
import { CheckCircle, XCircle, Edit3, Lightbulb } from 'lucide-react';

interface ResumeImprovementSuggestionCardProps {
  suggestion: ResumeImprovementSuggestion;
  onAccept: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
}

export const ResumeImprovementSuggestionCard: React.FC<ResumeImprovementSuggestionCardProps> = ({
  suggestion, onAccept, onReject, onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    setIsProcessing(true);
    await onAccept(suggestion.suggestionId);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await onReject(suggestion.suggestionId);
    setIsProcessing(false);
  };

  const handleEditSave = async (text: string) => {
    setIsProcessing(true);
    await onEdit(suggestion.suggestionId, text);
    setIsEditing(false);
    setIsProcessing(false);
  };

  const getPriorityColor = () => {
    if (suggestion.priority === 'high') return 'var(--danger)';
    if (suggestion.priority === 'medium') return 'var(--warning)';
    return 'var(--primary)';
  };

  return (
    <Card style={{ marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Priority Indicator */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: getPriorityColor() }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: '0.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'var(--bg-main)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold', color: getPriorityColor(), marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            {suggestion.section}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
            <Lightbulb size={18} style={{ color: 'var(--warning)', marginTop: '2px' }} />
            <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.95rem' }}>{suggestion.reason}</p>
          </div>
        </div>
        
        {suggestion.status !== 'pending' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: suggestion.status === 'accepted' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            {suggestion.status === 'accepted' ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {suggestion.status}
          </div>
        )}
      </div>

      {isEditing ? (
        <ResumeSuggestionEditor 
          initialText={suggestion.suggestedText} 
          onSave={handleEditSave} 
          onCancel={() => setIsEditing(false)} 
          isSaving={isProcessing}
        />
      ) : (
        <ResumeBeforeAfterComparison 
          originalText={suggestion.originalText} 
          suggestedText={suggestion.suggestedText} 
        />
      )}

      {suggestion.status === 'pending' && !isEditing && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <Button variant="ghost" onClick={handleReject} disabled={isProcessing} icon={<XCircle size={16} />}>Reject</Button>
          <Button variant="outline" onClick={() => setIsEditing(true)} disabled={isProcessing} icon={<Edit3 size={16} />}>Edit Draft</Button>
          <Button variant="primary" onClick={handleAccept} disabled={isProcessing} icon={<CheckCircle size={16} />}>Accept Suggestion</Button>
        </div>
      )}
    </Card>
  );
};
