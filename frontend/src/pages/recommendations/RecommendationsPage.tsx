import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { NextBestActionCard } from '../../components/recommendations/NextBestActionCard';
import { RecommendationSection } from '../../components/recommendations/RecommendationSection';
import { recommendationService } from '../../services/recommendationService';
import { RecommendationOverview } from '../../types/recommendation';
import { Compass, RefreshCw, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<RecommendationOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (forceRefresh = false) => {
    if (forceRefresh) setIsRefreshing(true);
    setError(null);
    try {
      const data = forceRefresh 
        ? await recommendationService.refreshRecommendations() 
        : await recommendationService.getOverview();
      setOverview(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load recommendations');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (isLoading) return <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;
  
  if (error) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Error loading your personalized plan</h2>
        <p style={{ color: 'var(--danger)' }}>{error}</p>
        <Button onClick={() => fetchRecommendations(true)}>Try Again</Button>
      </div>
    );
  }

  if (!overview) return null;

  // Filter recommendations by priority for sections (excluding nextBestAction if it's there)
  const remainingRecs = overview.activeRecommendations.filter(
    r => r.recommendationId !== overview.nextBestAction?.recommendationId
  );

  const critical = remainingRecs.filter(r => r.priority === 'critical');
  const high = remainingRecs.filter(r => r.priority === 'high');
  const medium = remainingRecs.filter(r => r.priority === 'medium');
  const low = remainingRecs.filter(r => r.priority === 'low');

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <PageHeader 
        title="Your Personalized Plan" 
        subtitle="AI-driven recommendations based on your performance and goals."
        icon={<Compass size={28} />}
        action={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" onClick={() => navigate('/recommendations/history')} icon={<History size={16} />}>
              History
            </Button>
            <Button 
              onClick={() => fetchRecommendations(true)} 
              disabled={isRefreshing}
              icon={<RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Plan'}
            </Button>
          </div>
        }
      />

      {overview.nextBestAction ? (
        <div style={{ marginBottom: '3rem' }}>
          <NextBestActionCard recommendation={overview.nextBestAction} />
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>No Critical Actions Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Complete more activities to receive personalized guidance.</p>
          <Button onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem' }}>Return to Dashboard</Button>
        </div>
      )}

      {remainingRecs.length > 0 && (
        <div>
          <RecommendationSection title="Critical Priorities" recommendations={critical} onDismissed={() => fetchRecommendations()} />
          <RecommendationSection title="High Priority" recommendations={high} onDismissed={() => fetchRecommendations()} />
          <RecommendationSection title="Medium Priority" recommendations={medium} onDismissed={() => fetchRecommendations()} />
          <RecommendationSection title="Keep Improving / Coverage" recommendations={low} onDismissed={() => fetchRecommendations()} />
        </div>
      )}

      <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
        Last refreshed: {new Date(overview.lastRefreshed).toLocaleString()}
      </div>
    </div>
  );
};
