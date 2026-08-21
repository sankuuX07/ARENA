import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

interface AbandonSimulationDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AbandonSimulationDialog: React.FC<AbandonSimulationDialogProps> = ({
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <Card style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2rem' }}>
        <AlertTriangle size={48} style={{ color: 'var(--danger)', margin: '0 auto 1rem auto' }} />
        <h2 style={{ marginBottom: '1rem' }}>Abandon Simulation?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Are you sure you want to abandon this placement simulation? Unfinished rounds will be locked, and this action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="outline" fullWidth onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button fullWidth onClick={onConfirm} disabled={isLoading} style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }}>
            {isLoading ? 'Abandoning...' : 'Yes, Abandon'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
