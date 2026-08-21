import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Trophy, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { competitionService } from '../../services/competitionService';

export const CompetitionDashboardWidget: React.FC = () => {
  const navigate = useNavigate();
  const [liveCount, setLiveCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [live, upcoming] = await Promise.all([
          competitionService.getLive(),
          competitionService.getUpcoming()
        ]);
        setLiveCount(live.length);
        setUpcomingCount(upcoming.length);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCounts();
  }, []);

  if (isLoading) return null; // Or a small skeleton

  return (
    <Card style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
        <Trophy size={20} />
        <h3 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Competitions</h3>
      </div>
      
      {liveCount === 0 && upcomingCount === 0 ? (
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          No competitions are currently available. Check back soon!
        </p>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: liveCount > 0 ? 'var(--success)' : 'var(--text-primary)' }}>{liveCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Live Now</div>
          </div>
          <div style={{ flex: 1, background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{upcomingCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Upcoming</div>
          </div>
        </div>
      )}

      <Button onClick={() => navigate('/competitions')} icon={<ArrowRight size={16} />} style={{ width: '100%' }}>
        Explore Competitions
      </Button>
    </Card>
  );
};
