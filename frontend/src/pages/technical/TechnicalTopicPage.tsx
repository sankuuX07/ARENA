import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Settings2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { TechnicalDifficulty } from '../../services/technicalService';

export const TechnicalTopicPage: React.FC = () => {
  const { language, topicId } = useParams<{ language: string, topicId: string }>();
  const navigate = useNavigate();
  
  const [difficulty, setDifficulty] = useState<TechnicalDifficulty>('medium');

  const handleStart = () => {
    // Navigating directly to session page with query params to start session
    navigate(`/technical/session/new?language=${language}&topic=${topicId}&difficulty=${difficulty}`);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={() => navigate(`/technical/${language}`)} style={{ marginBottom: '1rem' }}>
        Back to Topics
      </Button>
      
      <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 1rem' }}>Prepare: {topicId?.replace('_', ' ')}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Test your knowledge and problem-solving skills with AI-curated practice questions.
        </p>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings2 size={16} /> Select Difficulty
          </h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {(['easy', 'medium', 'hard'] as TechnicalDifficulty[]).map((d) => (
              <Button
                key={d}
                variant={difficulty === d ? 'primary' : 'outline'}
                onClick={() => setDifficulty(d)}
                style={{ textTransform: 'capitalize' }}
              >
                {d}
              </Button>
            ))}
          </div>
        </div>

        <Button variant="primary" icon={<Play size={16} />} onClick={handleStart} size="lg" fullWidth>
          Start Practice Session
        </Button>
      </div>
    </div>
  );
};
