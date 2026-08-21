import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Database, Activity, Server, Cpu, Globe, Box, Settings, HardDrive, Terminal, Share2, Shield } from 'lucide-react';
import { getCSCoreSubjects, CSSubject } from '../../../services/csCoreService';
import { getProgressSummary } from '../../../services/progressService';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';

const iconMap: Record<string, React.ElementType> = {
  'database': Database,
  'activity': Activity,
  'server': Server,
  'cpu': Cpu,
  'globe': Globe,
  'box': Box,
  'settings': Settings,
  'hard-drive': HardDrive,
  'terminal': Terminal,
  'share-2': Share2,
  'shield': Shield,
  'book-open': BookOpen
};

export const CSCorePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [subjects, setSubjects] = useState<CSSubject[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [techProgress, setTechProgress] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fetchedSubjects, progSummary] = await Promise.all([
        getCSCoreSubjects(),
        getProgressSummary(currentUser!.uid)
      ]);
      setSubjects(fetchedSubjects.sort((a, b) => a.order - b.order));
      
      const tp = progSummary.moduleProgress['technical'];
      if (tp) {
        setTechProgress(tp.progressPercentage);
        setAttempted(tp.attempted);
        setAccuracy(tp.accuracy);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading CS Core Module...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={() => navigate('/technical')} style={{ marginBottom: '1rem' }}>
        Back to Technical
      </Button>
      
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>CS Core Subjects</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Master Computer Science fundamentals for technical placement rounds.
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
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        Subjects
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {subjects.map(subject => {
          const Icon = iconMap[subject.icon] || BookOpen;
          return (
            <div key={subject.subjectId} style={{ 
              display: 'flex', 
              flexDirection: 'column',
              padding: '1.5rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            onClick={() => navigate(`/technical/cs-core/${subject.subjectId}`)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.2rem' }}>{subject.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{subject.topics?.length || 0} Topics</div>
                </div>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flex: 1, margin: '0 0 1.5rem' }}>
                {subject.description}
              </p>

              <Button variant="outline" fullWidth>
                View Topics
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
