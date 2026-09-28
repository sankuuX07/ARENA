import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { PlacementProgressTracker } from '../../components/placement/PlacementProgressTracker';
import { RoundTransition } from '../../components/placement/RoundTransition';
import { AbandonSimulationDialog } from '../../components/placement/AbandonSimulationDialog';
import { placementService } from '../../services/placementService';
import { PlacementSimulationSession, PlacementRoundSession, PlacementSimulation } from '../../types/placement';
import { Button } from '../../components/ui/Button';
import { Briefcase, AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import { Card } from '../../components/ui/Card';
export const PlacementSessionPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [session, setSession] = useState(null);
    const [simulation, setSimulation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showAbandonDialog, setShowAbandonDialog] = useState(false);
    const [showTransition, setShowTransition] = useState(false);
    const [lastCompletedRound, setLastCompletedRound] = useState(null);
    // Parse any completion payload passed from module via navigate state
    const completedRoundRef = location.state?.completedRoundRef;
    const completedRoundId = location.state?.roundId;
    const loadData = async () => {
        if (!sessionId)
            return;
        try {
            const sess = await placementService.getSession(sessionId);
            setSession(sess);
            const sim = await placementService.getSimulation(sess.simulationId);
            setSimulation(sim);
            // If redirected back with completion state, process it
            if (completedRoundRef && completedRoundId) {
                await handleRoundComplete(sessionId, completedRoundId, completedRoundRef);
            }
            else if (sess.status === 'completed' || sess.status === 'failed') {
                navigate(`/placement/sessions/${sessionId}/summary`);
            }
        }
        catch (err) {
            console.error('Failed to load session', err);
            navigate('/placement');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId, completedRoundRef, completedRoundId]);
    const handleRoundComplete = async (sessId, roundId, resultRef) => {
        setIsLoading(true);
        try {
            const updatedSession = await placementService.completeRound(sessId, roundId, { resultReference: resultRef });
            setSession(updatedSession);
            const round = updatedSession.rounds.find(r => r.roundId === roundId);
            if (round) {
                setLastCompletedRound(round);
                setShowTransition(true);
            }
            // Clear location state to prevent re-triggering
            window.history.replaceState({}, document.title);
        }
        catch (err) {
            console.error('Failed to process round completion', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleStartRound = async () => {
        if (!session || !sessionId)
            return;
        const activeRound = session.rounds.find(r => r.order === session.currentRoundOrder);
        if (!activeRound)
            return;
        try {
            setIsLoading(true);
            // Start the round to get moduleSessionId
            const startRes = await placementService.startRound(sessionId, activeRound.roundId);
            // Route to appropriate module based on round type
            const simRound = simulation?.rounds.find(r => r.roundId === activeRound.roundId);
            if (!simRound)
                throw new Error("Round config not found");
            // For M31 we simulate the redirect to existing modules
            // passing placement session info so they can navigate back on completion.
            switch (simRound.type) {
                case 'interview':
                    navigate(`/interview/session/${startRes.moduleSessionId}`, {
                        state: { placementSessionId: sessionId, placementRoundId: activeRound.roundId }
                    });
                    break;
                case 'technical':
                    navigate(`/technical/session/${startRes.moduleSessionId}`, {
                        state: { placementSessionId: sessionId, placementRoundId: activeRound.roundId }
                    });
                    break;
                case 'coding':
                    navigate(`/technical/python/session/${startRes.moduleSessionId}`, {
                        state: { placementSessionId: sessionId, placementRoundId: activeRound.roundId }
                    });
                    break;
                case 'aptitude':
                    navigate(`/assessments/session/${startRes.moduleSessionId}`, {
                        state: { placementSessionId: sessionId, placementRoundId: activeRound.roundId }
                    });
                    break;
                case 'communication':
                    navigate(`/communication/situational`, {
                        state: { placementSessionId: sessionId, placementRoundId: activeRound.roundId, moduleSessionId: startRes.moduleSessionId }
                    });
                    break;
                default:
                    alert(`Navigation for ${simRound.type} is not mocked yet.`);
                    setIsLoading(false);
            }
        }
        catch (err) {
            console.error('Failed to start round', err);
            alert('Failed to start round. Please try again.');
            setIsLoading(false);
        }
    };
    const handleAbandon = async () => {
        if (!sessionId)
            return;
        setIsLoading(true);
        try {
            await placementService.abandonSession(sessionId);
            navigate('/placement/history');
        }
        catch (err) {
            console.error('Failed to abandon', err);
        }
        finally {
            setIsLoading(false);
            setShowAbandonDialog(false);
        }
    };
    const closeTransitionAndContinue = () => {
        setShowTransition(false);
        setLastCompletedRound(null);
        if (session?.status === 'completed' || session?.status === 'failed') {
            navigate(`/placement/sessions/${sessionId}/summary`);
        }
    };
    if (isLoading || !session || !simulation) {
        return _jsx("div", { className: "page-container", children: "Loading session..." });
    }
    const activeRound = session.rounds.find(r => r.order === session.currentRoundOrder);
    const nextRoundSim = activeRound ? simulation.rounds.find(r => r.order === activeRound.order + 1) : null;
    return (_jsxs("div", { className: "page-container", children: [_jsx(PageHeader, { title: simulation.title, subtitle: `Session ID: ${session.sessionId}`, icon: _jsx(Briefcase, { size: 28 }), action: session.status === 'in_progress' && (_jsx(Button, { variant: "outline", onClick: () => setShowAbandonDialog(true), icon: _jsx(AlertTriangle, { size: 16 }), children: "Abandon Simulation" })) }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }, children: [_jsxs("div", { children: [_jsx("h2", { style: { marginBottom: '1.5rem' }, children: "Simulation Progress" }), _jsx(PlacementProgressTracker, { rounds: session.rounds, currentRoundOrder: session.currentRoundOrder })] }), _jsx("div", { style: { position: 'sticky', top: '2rem' }, children: _jsxs(Card, { children: [_jsxs("h3", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }, children: [_jsx(Activity, { size: 20 }), " Current Status"] }), _jsxs("div", { style: { marginBottom: '1.5rem' }, children: [_jsx("div", { style: { color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }, children: "Progress" }), _jsxs("div", { style: { fontWeight: 'bold', fontSize: '1.2rem' }, children: [Math.min(session.currentRoundOrder - 1, simulation.totalRounds), " / ", simulation.totalRounds, " Rounds"] })] }), activeRound && session.status === 'in_progress' ? (_jsxs("div", { style: { padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }, children: [_jsx("div", { style: { color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }, children: "Up Next:" }), _jsxs("div", { style: { fontWeight: 'bold', marginBottom: '1rem' }, children: ["Round ", activeRound.order, ": ", activeRound.roundId.split('_')[1]?.toUpperCase()] }), _jsx(Button, { fullWidth: true, onClick: handleStartRound, icon: _jsx(ArrowRight, { size: 16 }), children: activeRound.status === 'in_progress' ? 'Continue Round' : 'Start Round' })] })) : session.status === 'completed' || session.status === 'failed' ? (_jsxs("div", { style: { padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', textAlign: 'center' }, children: [_jsxs("div", { style: { fontWeight: 'bold', color: session.status === 'completed' ? 'var(--success)' : 'var(--danger)', marginBottom: '1rem' }, children: ["Simulation ", session.status.toUpperCase()] }), _jsx(Button, { fullWidth: true, onClick: () => navigate(`/placement/sessions/${sessionId}/summary`), children: "View Summary" })] })) : null] }) })] }), showAbandonDialog && (_jsx(AbandonSimulationDialog, { onConfirm: handleAbandon, onCancel: () => setShowAbandonDialog(false), isLoading: isLoading })), showTransition && lastCompletedRound && (_jsx(RoundTransition, { round: lastCompletedRound, nextRoundName: nextRoundSim?.name, onContinue: closeTransitionAndContinue, onSummary: () => navigate(`/placement/sessions/${sessionId}/summary`) }))] }));
};
//# sourceMappingURL=PlacementSessionPage.js.map