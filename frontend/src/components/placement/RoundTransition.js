import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PlacementRoundSession } from '../../types/placement';
import { CheckCircle, XCircle } from 'lucide-react';
export const RoundTransition = ({ round, nextRoundName, onContinue, onSummary }) => {
    const isPassed = round.passed;
    return (_jsx("div", { style: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }, children: _jsxs(Card, { style: { maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2rem' }, children: [isPassed ? (_jsx(CheckCircle, { size: 64, style: { color: 'var(--success)', margin: '0 auto 1rem auto' } })) : (_jsx(XCircle, { size: 64, style: { color: 'var(--danger)', margin: '0 auto 1rem auto' } })), _jsx("h2", { style: { marginBottom: '1rem' }, children: "Round Complete" }), _jsx("h3", { style: { color: 'var(--primary)', marginBottom: '1rem' }, children: round.roundId.split('_')[1]?.toUpperCase() }), _jsxs("div", { style: { marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }, children: [_jsxs("div", { style: { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }, children: ["Score: ", round.score !== undefined ? `${round.score}%` : 'N/A'] }), _jsxs("div", { style: {
                                color: isPassed ? 'var(--success)' : 'var(--danger)',
                                fontWeight: 'bold'
                            }, children: ["Status: ", isPassed ? 'PASSED' : 'NOT CLEARED'] })] }), isPassed && nextRoundName ? (_jsxs("div", { style: { marginBottom: '1.5rem' }, children: [_jsx("div", { style: { color: 'var(--text-muted)', marginBottom: '0.5rem' }, children: "Next Round:" }), _jsx("div", { style: { fontWeight: 'bold' }, children: nextRoundName })] })) : (_jsx("div", { style: { marginBottom: '1.5rem', color: 'var(--text-muted)' }, children: "This simulation has ended." })), isPassed && nextRoundName ? (_jsx(Button, { fullWidth: true, onClick: onContinue, children: "Continue" })) : (_jsx(Button, { fullWidth: true, variant: "outline", onClick: onSummary, children: "View Simulation Summary" }))] }) }));
};
//# sourceMappingURL=RoundTransition.js.map