import React, { useState } from 'react';
import { Button } from '../../ui/Button';

interface ResumeSuggestionEditorProps {
  initialText: string;
  onSave: (editedText: string) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const ResumeSuggestionEditor: React.FC<ResumeSuggestionEditorProps> = ({ initialText, onSave, onCancel, isSaving }) => {
  const [text, setText] = useState(initialText);

  return (
    <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Edit Suggestion</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: '100%',
          minHeight: '120px',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--primary)',
          background: 'var(--bg-main)',
          color: 'var(--text-primary)',
          fontFamily: 'inherit',
          resize: 'vertical'
        }}
      />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>Cancel</Button>
        <Button onClick={() => onSave(text)} disabled={isSaving || !text.trim()}>Save Changes</Button>
      </div>
    </div>
  );
};
