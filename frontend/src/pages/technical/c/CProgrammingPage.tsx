import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Terminal } from 'lucide-react';
import { getCTopics } from '../../../services/cService';
import { TechnicalTopic } from '../../../services/technicalService';
import { getProgressSummary } from '../../../services/progressService';
import { getPuzzleProgress } from '../../../services/puzzleService';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';

export const CProgrammingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [topics, setTopics] = useState<TechnicalTopic[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [techProgress, setTechProgress] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [codingSolved, setCodingSolved] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fetchedTopics, progSummary, puzzleProg] = await Promise.all([
        getCTopics(),
        getProgressSummary(currentUser!.uid),
        getPuzzleProgress(currentUser!.uid)
      ]);
      setTopics(fetchedTopics);
      
      const tp = progSummary.moduleProgress['technical'];
      if (tp) {
        setTechProgress(tp.progressPercentage);
        setAttempted(tp.attempted);
        setAccuracy(tp.accuracy);
      }
      
      // Realistically we'd query puzzles specifically tagged with 'C', but for M22 scope we show general solved
      setCodingSolved(puzzleProg.problemsSolved);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading C Programming Module...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={() => navigate('/technical')} style={{ marginBottom: '1rem' }}>
        Back to Technical
      </Button>
      
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>C Programming</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Master C fundamentals and prepare for technical placement rounds.
          </p>
        </div>
        
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', gap: '2rem' }}>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Progress</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)' }}>{techProgress}%</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Attempted</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{attempted}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Accuracy</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{accuracy}%</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Coding Solved</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--success)' }}>{codingSolved}</div>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        Topics
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {topics.map(topic => (
          <div key={topic.topicId} style={{ 
            display: 'flex', 
            flexDirection: 'column',
            padding: '1.5rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onClick={() => navigate(`/technical/c/${topic.topicId}`)}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={18} style={{ color: 'var(--primary)' }} />
              {topic.name}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flex: 1, margin: 0 }}>
              {topic.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
