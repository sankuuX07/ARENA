import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';
export const AbandonSimulationDialog = ({ onConfirm, onCancel, isLoading = false }) => {
    return (_jsx("div", { style: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }, children: _jsxs(Card, { style: { maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2rem' }, children: [_jsx(AlertTriangle, { size: 48, style: { color: 'var(--danger)', margin: '0 auto 1rem auto' } }), _jsx("h2", { style: { marginBottom: '1rem' }, children: "Abandon Simulation?" }), _jsx("p", { style: { color: 'var(--text-muted)', marginBottom: '2rem' }, children: "Are you sure you want to abandon this placement simulation? Unfinished rounds will be locked, and this action cannot be undone." }), _jsxs("div", { style: { display: 'flex', gap: '1rem' }, children: [_jsx(Button, { variant: "outline", fullWidth: true, onClick: onCancel, disabled: isLoading, children: "Cancel" }), _jsx(Button, { fullWidth: true, onClick: onConfirm, disabled: isLoading, style: { background: 'var(--danger)', borderColor: 'var(--danger)' }, children: isLoading ? 'Abandoning...' : 'Yes, Abandon' })] })] }) }));
};
//# sourceMappingURL=AbandonSimulationDialog.js.map