import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { analyticsService } from '../../services/analyticsService';
import { ArrowLeft, Activity } from 'lucide-react';

export const CategoryAnalyticsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;
      try {
        let result;
        switch(categoryId) {
          case 'communication': result = await analyticsService.getCommunicationAnalytics(); break;
          case 'aptitude': result = await analyticsService.getAptitudeAnalytics(); break;
          case 'coding': result = await analyticsService.getCodingAnalytics(); break;
          case 'technical': result = await analyticsService.getTechnicalAnalytics(); break;
          case 'assessments': result = await analyticsService.getAssessmentAnalytics(); break;
          case 'interviews': result = await analyticsService.getInterviewAnalytics(); break;
          case 'resume': result = await analyticsService.getResumeAnalytics(); break;
          default: throw new Error("Unknown category");
        }
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);

  if (isLoading) return <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;

  if (!data) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Category Not Found</h2>
        <Button onClick={() => navigate('/analytics')}>Back to Analytics</Button>
      </div>
    );
  }

  const formatTitle = (id: string) => {
    return id.charAt(0).toUpperCase() + id.slice(1) + ' Analytics';
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader 
        title={formatTitle(categoryId || '')} 
        subtitle={`Detailed performance breakdown for ${categoryId}.`}
        icon={<Activity size={28} />}
        action={<Button variant="outline" onClick={() => navigate('/analytics')} icon={<ArrowLeft size={16} />}>Back to Overview</Button>}
      />

      <Card style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Performance Breakdown</h3>
        
        {data.overallScore === null ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            No data available yet. Start practicing to generate analytics.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {Object.entries(data).map(([key, value]) => {
              // Simple formatting for keys like 'fluencyScore' -> 'Fluency Score'
              const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              
              if (Array.isArray(value)) return null; // Skip complex nested arrays for basic view
              
              return (
                <div key={key} style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{formattedKey}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    {value !== null ? String(value) : 'N/A'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
      
      {data.languages && data.languages.length > 0 && (
        <Card>
          <h3 style={{ marginBottom: '1.5rem' }}>Language Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.languages.map((lang: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontWeight: 'bold' }}>{lang.language}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{lang.problemsSolved} Solved ({lang.successRate}% Success)</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
