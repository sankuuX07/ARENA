import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { CompetitionCard } from '../../components/competitions/CompetitionCard';
import { competitionService } from '../../services/competitionService';
import { Competition } from '../../types/competition';
import { Trophy } from 'lucide-react';

export const CompetitionsPage: React.FC = () => {
  const [live, setLive] = useState<Competition[]>([]);
  const [upcoming, setUpcoming] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const [liveData, upcomingData] = await Promise.all([
          competitionService.getLive(),
          competitionService.getUpcoming()
        ]);
        setLive(liveData);
        setUpcoming(upcomingData);
      } catch (err) {
        console.error("Failed to load competitions", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompetitions();
  }, []);

  if (isLoading) return <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;

  return (
    <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <PageHeader 
        title="Competitive Environment" 
        subtitle="Challenge yourself in coding, aptitude, and technical competitions."
        icon={<Trophy size={28} />}
      />

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Live Now
        </h2>
        {live.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
            No live competitions at the moment. Check the upcoming schedule!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {live.map(c => <CompetitionCard key={c.competitionId} competition={c} />)}
          </div>
        )}
      </div>

      <div>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
            No upcoming competitions scheduled right now.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {upcoming.map(c => <CompetitionCard key={c.competitionId} competition={c} />)}
          </div>
        )}
      </div>
    </div>
  );
};
