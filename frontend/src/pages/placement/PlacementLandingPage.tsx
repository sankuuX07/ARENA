import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { SimulationCard } from '../../components/placement/SimulationCard';
import { placementService } from '../../services/placementService';
import { PlacementSimulation, PlacementSimulationSession } from '../../types/placement';
import { EmptyState } from '../../components/ui/EmptyState';
import { Briefcase, Activity, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const PlacementLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [simulations, setSimulations] = useState<PlacementSimulation[]>([]);
  const [activeSession, setActiveSession] = useState<PlacementSimulationSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [simData, sessionData] = await Promise.all([
          placementService.getSimulations(),
          placementService.getActiveSession()
        ]);
        setSimulations(simData);
        setActiveSession(sessionData);
      } catch (err) {
        console.error('Failed to load placement data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleStartSimulation = async (simulationId: string) => {
    setStartingId(simulationId);
    try {
      if (activeSession) {
        // Enforce one active session - navigate to it
        navigate(`/placement/sessions/${activeSession.sessionId}`);
        return;
      }
      const newSession = await placementService.startSession(simulationId);
      navigate(`/placement/sessions/${newSession.sessionId}`);
    } catch (err) {
      console.error('Failed to start simulation', err);
      alert('Failed to start simulation. You might already have an active session.');
    } finally {
      setStartingId(null);
    }
  };

  return (
    <div className="page-container">
      <PageHeader
        title="ARENA Placement Simulation"
        subtitle="Experience a complete placement process before the real one."
        icon={<Briefcase size={28} />}
        action={
          <Button variant="outline" icon={<FileText size={16} />} onClick={() => navigate('/placement/history')}>
            Simulation History
          </Button>
        }
      />

      {isLoading ? (
        <div>Loading simulations...</div>
      ) : activeSession ? (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            <Activity size={24} />
            <h3 style={{ margin: 0 }}>Active Simulation Found</h3>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            You have an active placement simulation in progress. You must complete or abandon it before starting a new one.
          </p>
          <Button onClick={() => navigate(`/placement/sessions/${activeSession.sessionId}`)}>
            Continue Simulation
          </Button>
        </div>
      ) : (
        <div className="simulations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {simulations.length > 0 ? (
            simulations.map((sim) => (
              <SimulationCard
                key={sim.simulationId}
                simulation={sim}
                onStart={handleStartSimulation}
                isLoading={startingId === sim.simulationId}
              />
            ))
          ) : (
            <EmptyState
              icon={<Briefcase size={36} />}
              title="No Simulations Available"
              description="There are currently no placement simulations available."
            />
          )}
        </div>
      )}
    </div>
  );
};
