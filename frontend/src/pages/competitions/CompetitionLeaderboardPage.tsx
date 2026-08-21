import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { CompetitionLeaderboard } from '../../components/competitions/CompetitionLeaderboard';
import { competitionService } from '../../services/competitionService';
import { CompetitionLeaderboardResponse, Competition } from '../../types/competition';
import { Trophy, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CompetitionLeaderboardPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [leaderboard, setLeaderboard] = useState<CompetitionLeaderboardResponse | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (refresh = false) => {
    if (!competitionId) return;
    if (refresh) setIsRefreshing(true);
    
    try {
      if (!competition) {
        const comp = await competitionService.getById(competitionId);
        setCompetition(comp);
      }
      
      const lb = await competitionService.getLeaderboard(competitionId);
      setLeaderboard(lb);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not load leaderboard");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Optional: Setup polling if it's a live leaderboard
    // const interval = setInterval(() => fetchData(true), 15000);
    // return () => clearInterval(interval);
  }, [competitionId]);

  if (isLoading) return <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;
  if (error || !competition || !leaderboard) return <div style={{ textAlign: 'center', padding: '4rem' }}><h2>Error</h2><p>{error}</p></div>;

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <PageHeader 
        title={`${competition.title} - Leaderboard`}
        subtitle="See how you stack up against the competition."
        icon={<Trophy size={28} />}
        action={
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="outline" onClick={() => navigate(`/competitions/${competitionId}`)} icon={<ArrowLeft size={16} />}>Back to Details</Button>
            <Button 
              onClick={() => fetchData(true)} 
              disabled={isRefreshing}
              icon={<RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />}
            >
              Refresh
            </Button>
          </div>
        }
      />
      
      <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Last updated: {new Date(leaderboard.lastUpdated).toLocaleString()}
      </div>

      <CompetitionLeaderboard 
        entries={leaderboard.entries} 
        currentUserId={currentUser?.uid} 
      />
    </div>
  );
};
