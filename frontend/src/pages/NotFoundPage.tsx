import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
        minHeight: '60vh',
      }}
    >
      <Card style={{ maxWidth: 500, width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'var(--error-bg)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--error)',
            margin: '0 auto 1.5rem auto',
          }}
        >
          <ShieldAlert size={36} />
        </div>

        <div className="error-code" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>
          404
        </div>
        <h2 className="card-title" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
          Page Not Found
        </h2>
        <p className="body-text" style={{ fontSize: '0.92rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
          The requested page route does not exist in the ARENA platform. Please check the URL or return to the dashboard.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="primary" icon={<Home size={16} />} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};
