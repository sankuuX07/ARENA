import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { PlacementRoundSession } from '../../types/placement';
import { CheckCircle, Circle, Lock, XCircle, ArrowRight } from 'lucide-react';
export const PlacementProgressTracker = ({ rounds, currentRoundOrder }) => {
    const sortedRounds = [...rounds].sort((a, b) => a.order - b.order);
    const getStatusIcon = (status) => {
        switch (status) {
            case 'passed':
            case 'completed':
                return _jsx(CheckCircle, { size: 24, style: { color: 'var(--success)' } });
            case 'failed':
                return _jsx(XCircle, { size: 24, style: { color: 'var(--danger)' } });
            case 'in_progress':
            case 'not_started':
                return _jsx(Circle, { size: 24, style: { color: 'var(--primary)' } });
            case 'locked':
            default:
                return _jsx(Lock, { size: 24, style: { color: 'var(--text-muted)' } });
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'passed': return 'PASSED';
            case 'failed': return 'NOT CLEARED';
            case 'completed': return 'COMPLETED';
            case 'in_progress': return 'IN PROGRESS';
            case 'not_started': return 'AVAILABLE';
            case 'locked': return 'LOCKED';
            default: return status.toUpperCase();
        }
    };
    return (_jsx("div", { className: "placement-progress-tracker", style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: sortedRounds.map((round, index) => {
            const isCurrent = round.order === currentRoundOrder;
            return (_jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '1rem' }, children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' }, children: [getStatusIcon(round.status), index < sortedRounds.length - 1 && (_jsx("div", { style: {
                                    width: '2px',
                                    height: '40px',
                                    background: round.status === 'passed' || round.status === 'completed'
                                        ? 'var(--success)'
                                        : 'var(--border-color)',
                                    margin: '4px 0'
                                } }))] }), _jsx("div", { style: {
                            flex: 1,
                            padding: '1rem',
                            background: isCurrent ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                            border: `1px solid ${isCurrent ? 'var(--primary)' : 'var(--border-color)'}`,
                            borderRadius: 'var(--radius-md)',
                            opacity: round.status === 'locked' ? 0.6 : 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }, children: _jsxs("div", { children: [_jsxs("h4", { style: { margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: ["Round ", round.order, ": ", round.roundId.split('_')[1]?.toUpperCase(), isCurrent && _jsx(ArrowRight, { size: 16, style: { color: 'var(--primary)' } })] }), _jsxs("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)' }, children: ["Status: ", _jsx("strong", { style: { color: round.status === 'passed' ? 'var(--success)' :
                                                    round.status === 'failed' ? 'var(--danger)' :
                                                        'inherit'
                                            }, children: getStatusText(round.status) }), round.score !== undefined && round.score !== null && ` | Score: ${round.score}%`] })] }) })] }, round.roundSessionId));
        }) }));
};
//# sourceMappingURL=PlacementProgressTracker.js.map