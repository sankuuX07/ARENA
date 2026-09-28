import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { SimulationCard } from '../../components/placement/SimulationCard';
import { placementService } from '../../services/placementService';
import { PlacementSimulation, PlacementSimulationSession } from '../../types/placement';
import { EmptyState } from '../../components/ui/EmptyState';
import { Briefcase, Activity, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
export const PlacementLandingPage = () => {
    const navigate = useNavigate();
    const [simulations, setSimulations] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [startingId, setStartingId] = useState(null);
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
            }
            catch (err) {
                console.error('Failed to load placement data', err);
            }
            finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);
    const handleStartSimulation = async (simulationId) => {
        setStartingId(simulationId);
        try {
            if (activeSession) {
                // Enforce one active session - navigate to it
                navigate(`/placement/sessions/${activeSession.sessionId}`);
                return;
            }
            const newSession = await placementService.startSession(simulationId);
            navigate(`/placement/sessions/${newSession.sessionId}`);
        }
        catch (err) {
            console.error('Failed to start simulation', err);
            alert('Failed to start simulation. You might already have an active session.');
        }
        finally {
            setStartingId(null);
        }
    };
    return (_jsxs("div", { className: "page-container", children: [_jsx(PageHeader, { title: "ARENA Placement Simulation", subtitle: "Experience a complete placement process before the real one.", icon: _jsx(Briefcase, { size: 28 }), action: _jsx(Button, { variant: "outline", icon: _jsx(FileText, { size: 16 }), onClick: () => navigate('/placement/history'), children: "Simulation History" }) }), isLoading ? (_jsx("div", { children: "Loading simulations..." })) : activeSession ? (_jsxs("div", { style: { marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary)' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }, children: [_jsx(Activity, { size: 24 }), _jsx("h3", { style: { margin: 0 }, children: "Active Simulation Found" })] }), _jsx("p", { style: { color: 'var(--text-muted)' }, children: "You have an active placement simulation in progress. You must complete or abandon it before starting a new one." }), _jsx(Button, { onClick: () => navigate(`/placement/sessions/${activeSession.sessionId}`), children: "Continue Simulation" })] })) : (_jsx("div", { className: "simulations-grid", style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }, children: simulations.length > 0 ? (simulations.map((sim) => (_jsx(SimulationCard, { simulation: sim, onStart: handleStartSimulation, isLoading: startingId === sim.simulationId }, sim.simulationId)))) : (_jsx(EmptyState, { icon: _jsx(Briefcase, { size: 36 }), title: "No Simulations Available", description: "There are currently no placement simulations available." })) }))] }));
};
//# sourceMappingURL=PlacementLandingPage.js.map