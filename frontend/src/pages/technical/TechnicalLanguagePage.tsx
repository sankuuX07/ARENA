import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getTechnicalModules, TechnicalModule } from '../../services/technicalService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const TechnicalLanguagePage: React.FC = () => {
  const { language } = useParams<{ language: string }>();
  const navigate = useNavigate();
  
  const [moduleData, setModuleData] = useState<TechnicalModule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [language]);

  const loadData = async () => {
    try {
      const mods = await getTechnicalModules();
      const match = mods.find(m => m.language === language);
      setModuleData(match || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading language...</div>;
  if (!moduleData) return <div style={{ padding: '2rem', textAlign: 'center' }}>Language module not found.</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={() => navigate('/technical')} style={{ marginBottom: '1rem' }}>
        Back to Dashboard
      </Button>
      
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{moduleData.title}</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
        {moduleData.description}
      </p>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        Topics
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {moduleData.topics.map(topic => (
          <div key={topic.topicId} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1.5rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} style={{ color: 'var(--primary)' }} />
                {topic.name}
              </h3>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Badge variant="primary">{topic.questionCount} Questions</Badge>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate(`/technical/${language}/${topic.topicId}`)}>
              Start Practice
            </Button>
          </div>
        ))}
        {moduleData.topics.length === 0 && (
          <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', padding: '1rem' }}>
            Topics will be populated in upcoming language-specific milestones.
          </div>
        )}
      </div>
    </div>
  );
};
