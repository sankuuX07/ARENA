import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { placementService } from '../../services/placementService';
import { PlacementSimulationSummary } from '../../types/placement';
import { Briefcase, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
export const SimulationSummaryPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchSummary = async () => {
            if (!sessionId)
                return;
            try {
                const data = await placementService.getSummary(sessionId);
                setSummary(data);
            }
            catch (err) {
                console.error('Failed to load summary', err);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchSummary();
    }, [sessionId]);
    if (isLoading)
        return _jsx("div", { className: "page-container", children: "Loading summary..." });
    if (!summary)
        return _jsx("div", { className: "page-container", children: "Summary not found." });
    const isSuccess = summary.status === 'completed';
    return (_jsxs("div", { className: "page-container", children: [_jsx(PageHeader, { title: "Placement Simulation Complete", subtitle: summary.simulationName, icon: _jsx(Briefcase, { size: 28 }), action: _jsx(Button, { variant: "outline", onClick: () => navigate('/placement'), icon: _jsx(ArrowLeft, { size: 16 }), children: "Back to Placement" }) }), _jsxs(Card, { style: { textAlign: 'center', padding: '3rem', marginBottom: '2rem' }, children: [isSuccess ? (_jsx(CheckCircle, { size: 64, style: { color: 'var(--success)', margin: '0 auto 1rem auto' } })) : (_jsx(XCircle, { size: 64, style: { color: 'var(--danger)', margin: '0 auto 1rem auto' } })), _jsx("h2", { style: { marginBottom: '0.5rem' }, children: "Final Status" }), _jsx("div", { style: {
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: isSuccess ? 'var(--success)' : 'var(--danger)',
                            marginBottom: '2rem'
                        }, children: summary.status.toUpperCase() }), _jsxs("div", { style: { color: 'var(--text-muted)' }, children: ["Completed At: ", new Date(summary.completedAt).toLocaleString()] })] }), _jsx("h3", { style: { marginBottom: '1rem' }, children: "Rounds Overview" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }, children: summary.rounds.map(round => (_jsxs(Card, { style: {
                        opacity: round.status === 'locked' || round.status === 'not_started' ? 0.6 : 1,
                        borderLeft: `4px solid ${round.passed ? 'var(--success)' : round.status === 'failed' ? 'var(--danger)' : 'var(--border-color)'}`
                    }, children: [_jsxs("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }, children: ["Round ", round.order] }), _jsx("h4", { style: { margin: '0 0 0.5rem 0' }, children: round.roundId.split('_')[1]?.toUpperCase() }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }, children: [_jsx("span", { style: {
                                        fontWeight: 'bold',
                                        color: round.passed ? 'var(--success)' : round.status === 'failed' ? 'var(--danger)' : 'inherit'
                                    }, children: round.status === 'passed' ? 'PASSED' : round.status === 'failed' ? 'FAILED' : round.status.toUpperCase() }), round.score !== undefined && round.score !== null && (_jsxs("span", { style: { fontWeight: 'bold' }, children: [round.score, "%"] }))] })] }, round.roundSessionId))) })] }));
};
//# sourceMappingURL=SimulationSummaryPage.js.map