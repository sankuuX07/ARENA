import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Briefcase, ArrowRight, Activity } from 'lucide-react';
import { placementService } from '../../services/placementService';
import { PlacementSimulationSession, PlacementSimulation } from '../../types/placement';

export const PlacementDashboardWidget: React.FC = () => {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState<PlacementSimulationSession | null>(null);
  const [simulation, setSimulation] = useState<PlacementSimulation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const session = await placementService.getActiveSession();
        if (session) {
          setActiveSession(session);
          const sim = await placementService.getSimulation(session.simulationId);
          setSimulation(sim);
        }
      } catch (error) {
        console.error('Failed to fetch active placement session', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActiveSession();
  }, []);

  if (isLoading) return null;

  return (
    <Card style={{ marginBottom: '1.5rem', background: 'var(--bg-surface-elevated)', borderLeft: '4px solid var(--primary)' }}>
      {activeSession && simulation ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>
              <Activity size={18} />
              Active Placement Simulation
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{simulation.title}</h3>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Progress: {Math.min(activeSession.currentRoundOrder - 1, simulation.totalRounds)} / {simulation.totalRounds} rounds completed
            </div>
          </div>
          <Button onClick={() => navigate(`/placement/sessions/${activeSession.sessionId}`)}>
            Continue
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 'bold' }}>
              <Briefcase size={18} style={{ color: 'var(--primary)' }} />
              Placement Practice
            </div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Experience a complete placement process before the real one.
            </p>
          </div>
          <Button variant="outline" icon={<ArrowRight size={16} />} onClick={() => navigate('/placement')}>
            Explore Simulations
          </Button>
        </div>
      )}
    </Card>
  );
};
