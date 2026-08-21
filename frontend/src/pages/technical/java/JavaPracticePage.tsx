import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Settings2, Target } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { getJavaTopic } from '../../../services/javaService';
import { TechnicalDifficulty, TechnicalQuestionType, TechnicalTopic } from '../../../services/technicalService';
import { generatePuzzleProblem } from '../../../services/puzzleService';

export const JavaPracticePage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  
  const [topic, setTopic] = useState<TechnicalTopic | null>(null);
  const [difficulty, setDifficulty] = useState<TechnicalDifficulty>('medium');
  const [qType, setQType] = useState<TechnicalQuestionType>('mcq');
  const [count, setCount] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (topicId) {
      getJavaTopic(topicId).then(setTopic).catch(console.error);
    }
  }, [topicId]);

  const handleStart = async () => {
    if (qType === 'coding') {
      setIsGenerating(true);
      try {
        const p = await generatePuzzleProblem({
          category: 'Java Programming',
          difficulty: difficulty,
          problemType: 'coding',
          language: 'java',
          topic: topic?.name
        });
        navigate(`/puzzles/${p.problemId}`);
      } catch (err) {
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
    } else {
      navigate(`/technical/java/session/new?topic=${topicId}&difficulty=${difficulty}&qType=${qType}&count=${count}`);
    }
  };

  if (!topic) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Topic...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={() => navigate(`/technical/java`)} style={{ marginBottom: '1rem' }}>
        Back to Java Topics
      </Button>
      
      <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 1rem' }}>{topic.name}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
          {topic.description}
        </p>

        <div style={{ display: 'grid', gap: '2rem', marginBottom: '2.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={16} /> Question Type
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {(['mcq', 'output', 'debugging', 'conceptual', 'coding', 'interview'] as TechnicalQuestionType[]).map((t) => (
                <Button key={t} variant={qType === t ? 'primary' : 'outline'} onClick={() => setQType(t)} style={{ textTransform: 'capitalize' }}>
                  {t.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings2 size={16} /> Difficulty
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {(['easy', 'medium', 'hard'] as TechnicalDifficulty[]).map((d) => (
                <Button key={d} variant={difficulty === d ? 'primary' : 'outline'} onClick={() => setDifficulty(d)} style={{ textTransform: 'capitalize' }}>
                  {d}
                </Button>
              ))}
            </div>
          </div>
          
          {qType !== 'coding' && (
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Question Count</h3>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {[5, 10, 20].map((c) => (
                  <Button key={c} variant={count === c ? 'primary' : 'outline'} onClick={() => setCount(c)}>
                    {c}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button 
          variant="primary" 
          icon={<Play size={16} />} 
          onClick={handleStart} 
          size="lg" 
          fullWidth
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : qType === 'coding' ? 'Generate Coding Problem' : 'Start Practice Session'}
        </Button>
      </div>
    </div>
  );
};
