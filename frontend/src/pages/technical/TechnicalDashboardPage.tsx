import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, ArrowRight } from 'lucide-react';
import { getTechnicalModules, TechnicalModule } from '../../services/technicalService';
import { getProgressSummary } from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export const TechnicalDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [modules, setModules] = useState<TechnicalModule[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mods, progSummary] = await Promise.all([
        getTechnicalModules(),
        getProgressSummary(currentUser!.uid)
      ]);
      setModules(mods);
      
      const technicalProg = progSummary.moduleProgress['technical']?.progressPercentage || 0;
      setProgress(technicalProg);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading modules...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ padding: '1rem', background: 'var(--primary)', color: 'white', borderRadius: '12px' }}>
          <Code2 size={32} />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>ARENA Technical Preparation</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>
            Learn. Practice. Master. Get Placement Ready.
          </p>
        </div>
      </div>
      
      <div style={{ marginBottom: '3rem', padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'inline-block' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Overall Progress:</span> 
        <strong style={{ marginLeft: '0.5rem', color: 'var(--primary)' }}>{progress}%</strong>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {modules.map((mod) => (
          <div key={mod.moduleId} style={{ 
            background: 'var(--bg-surface)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            opacity: mod.status === 'coming_soon' ? 0.6 : 1
          }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem' }}>{mod.title}</h2>
            <p style={{ color: 'var(--text-secondary)', flex: 1, marginBottom: '1.5rem' }}>
              {mod.description}
            </p>
            
            {mod.status === 'coming_soon' ? (
              <Button variant="outline" disabled fullWidth>Coming Soon</Button>
            ) : (
              <Button 
                variant="primary" 
                icon={<ArrowRight size={16} />} 
                fullWidth 
                onClick={() => navigate(`/technical/${mod.language}`)}
              >
                Explore
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
