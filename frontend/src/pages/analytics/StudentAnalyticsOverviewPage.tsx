import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { AnalyticsCategoryCard } from '../../components/analytics/AnalyticsCategoryCard';
import { AnalyticsScoreCard } from '../../components/analytics/AnalyticsScoreCard';
import { AnalyticsCoverageCard } from '../../components/analytics/AnalyticsCoverageCard';
import { AnalyticsStrengthsCard } from '../../components/analytics/AnalyticsStrengthsCard';
import { AnalyticsInsightsCard } from '../../components/analytics/AnalyticsInsightsCard';
import { AnalyticsActivityTimeline } from '../../components/analytics/AnalyticsActivityTimeline';
import { NextBestActionCard } from '../../components/recommendations/NextBestActionCard';
import { analyticsService } from '../../services/analyticsService';
import { recommendationService } from '../../services/recommendationService';
import { AnalyticsOverview } from '../../types/analytics';
import { StudentRecommendation } from '../../types/recommendation';
import { BarChart2, RefreshCw } from 'lucide-react';

export const StudentAnalyticsOverviewPage: React.FC = () => {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [nextAction, setNextAction] = useState<StudentRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async (forceRefresh = false) => {
    if (forceRefresh) setIsRefreshing(true);
    setError(null);
    try {
      const data = forceRefresh 
        ? await analyticsService.refreshOverview() 
        : await analyticsService.getOverview();
      setOverview(data);
      
      const recData = await recommendationService.getNextAction().catch(() => null);
      setNextAction(recData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (isLoading) return <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;
  
  if (error) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Error loading analytics</h2>
        <p style={{ color: 'var(--danger)' }}>{error}</p>
        <Button onClick={() => fetchOverview(true)}>Try Again</Button>
      </div>
    );
  }

  if (!overview) return null;

  return (
    <div className="page-container">
      <PageHeader 
        title="Unified Student Analytics" 
        subtitle="Your complete learning and placement preparation progress."
        icon={<BarChart2 size={28} />}
        action={
          <Button 
            variant="outline" 
            onClick={() => fetchOverview(true)} 
            disabled={isRefreshing}
            icon={<RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Analytics'}
          </Button>
        }
      />

      {/* Top Section: Score, Coverage, and Quick Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <AnalyticsScoreCard 
          title="Overall Preparation Score"
          score={overview.overallScore}
          performanceLevel={overview.performanceLevel}
          subtitle={`Based on ${overview.coverage.exploredCategories} of ${overview.coverage.availableCategories} preparation areas`}
        />
        
        <AnalyticsCoverageCard coverage={overview.coverage} />
        
        <AnalyticsStrengthsCard 
          strengths={overview.strengths} 
          improvementAreas={overview.improvementAreas} 
        />
      </div>

      {nextAction && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Personalized Next Steps</h2>
          <NextBestActionCard recommendation={nextAction} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Main Categories Grid */}
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Category Breakdown</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {overview.categories.map(category => (
              <AnalyticsCategoryCard 
                key={category.id} 
                category={category} 
                viewRoute={`/analytics/${category.id}`} 
              />
            ))}
          </div>
        </div>

        {/* Sidebar: Insights and Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AnalyticsInsightsCard insights={overview.insights} />
          <AnalyticsActivityTimeline activities={overview.recentActivity} />
        </div>
      </div>
      
      <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Last updated: {new Date(overview.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};
