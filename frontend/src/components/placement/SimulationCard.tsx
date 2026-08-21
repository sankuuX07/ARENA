import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PlacementSimulation } from '../../types/placement';
import { Briefcase, Clock, Play } from 'lucide-react';

interface SimulationCardProps {
  simulation: PlacementSimulation;
  onStart: (simulationId: string) => void;
  isLoading?: boolean;
}

export const SimulationCard: React.FC<SimulationCardProps> = ({
  simulation,
  onStart,
  isLoading = false
}) => {
  return (
    <Card className="simulation-card">
      <div className="card-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Briefcase size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{simulation.title}</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            {simulation.description}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Badge variant="info" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={14} />
          ~{simulation.estimatedDurationMinutes} mins
        </Badge>
        <Badge variant="primary">
          {simulation.totalRounds} Rounds
        </Badge>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Round Sequence
        </h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>
          {simulation.rounds.map((round) => (
            <li key={round.roundId} style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{round.order}.</span>
              {round.name}
            </li>
          ))}
        </ul>
      </div>

      <Button
        onClick={() => onStart(simulation.simulationId)}
        fullWidth
        disabled={isLoading}
        icon={<Play size={16} />}
      >
        {isLoading ? 'Starting...' : 'Start Simulation'}
      </Button>
    </Card>
  );
};
