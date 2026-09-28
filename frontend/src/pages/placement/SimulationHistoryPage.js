import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { placementService } from '../../services/placementService';
import { PlacementSimulationSession } from '../../types/placement';
import { EmptyState } from '../../components/ui/EmptyState';
import { Briefcase, ArrowLeft, Clock } from 'lucide-react';
export const SimulationHistoryPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await placementService.getHistory();
                setHistory(data.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()));
            }
            catch (err) {
                console.error('Failed to load history', err);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);
    if (isLoading)
        return _jsx("div", { className: "page-container", children: "Loading history..." });
    return (_jsxs("div", { className: "page-container", children: [_jsx(PageHeader, { title: "Simulation History", subtitle: "Review your past placement simulation attempts.", icon: _jsx(Briefcase, { size: 28 }), action: _jsx(Button, { variant: "outline", onClick: () => navigate('/placement'), icon: _jsx(ArrowLeft, { size: 16 }), children: "Back to Placement" }) }), history.length > 0 ? (_jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }, children: history.map(session => {
                    const completedRounds = session.rounds.filter(r => ['passed', 'completed', 'failed'].includes(r.status)).length;
                    return (_jsxs(Card, { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }, children: [_jsx("h3", { style: { margin: 0, fontSize: '1.1rem' }, children: "Simulation Attempt" }), _jsx("span", { style: {
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            background: session.status === 'completed' ? 'var(--success-light, #d4edda)' :
                                                session.status === 'failed' ? 'var(--danger-light, #f8d7da)' :
                                                    'var(--bg-surface-elevated)',
                                            color: session.status === 'completed' ? 'var(--success)' :
                                                session.status === 'failed' ? 'var(--danger)' :
                                                    'var(--text-main)'
                                        }, children: session.status.toUpperCase() })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }, children: [_jsx(Clock, { size: 16 }), new Date(session.startedAt).toLocaleDateString()] }), _jsxs("div", { style: { color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }, children: [completedRounds, " / ", session.rounds.length, " rounds completed"] }), _jsx(Button, { fullWidth: true, variant: "outline", icon: _jsx(Clock, { size: 16 }), onClick: () => navigate(`/placement/sessions/${session.sessionId}/summary`), children: "View Summary" })] }, session.sessionId));
                }) })) : (_jsx(EmptyState, { icon: _jsx(Briefcase, { size: 36 }), title: "No History Found", description: "You haven't completed or abandoned any placement simulations yet.", action: _jsx(Button, { onClick: () => navigate('/placement'), children: "Start a Simulation" }) }))] }));
};
//# sourceMappingURL=SimulationHistoryPage.js.map