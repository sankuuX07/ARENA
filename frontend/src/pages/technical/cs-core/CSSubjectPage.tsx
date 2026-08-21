import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getCSCoreSubject, CSSubject } from '../../../services/csCoreService';
import { Button } from '../../../components/ui/Button';

export const CSSubjectPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  
  const [subject, setSubject] = useState<CSSubject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subjectId) {
      getCSCoreSubject(subjectId)
        .then(setSubject)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [subjectId]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Subject...</div>;
  if (!subject) return <div style={{ padding: '2rem', textAlign: 'center' }}>Subject not found.</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={() => navigate('/technical/cs-core')} style={{ marginBottom: '1rem' }}>
        Back to CS Core Subjects
      </Button>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{subject.name}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          {subject.description}
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {subject.topics?.map((topic, idx) => (
          <div 
            key={topic.topicId} 
            onClick={() => navigate(`/technical/cs-core/${subject.subjectId}/${topic.topicId}`)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '1.25rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '1rem', width: '24px' }}>
                {idx + 1}.
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>{topic.name}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{topic.description}</p>
              </div>
            </div>
            
            <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
          </div>
        ))}
      </div>
    </div>
  );
};
