import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StudentRecommendation } from '../../types/recommendation';
import { Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const NextBestActionCard = ({ recommendation, onAction }) => {
    const navigate = useNavigate();
    const handleAction = () => {
        if (onAction)
            onAction();
        navigate(recommendation.actionRoute);
    };
    return (_jsxs(Card, { style: { border: '2px solid var(--primary)', position: 'relative', overflow: 'hidden' }, children: [_jsx("div", { style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--primary)' } }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }, children: [_jsx(Star, { size: 20, fill: "currentColor" }), _jsx("h3", { style: { margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }, children: "Next Best Action" })] }), _jsx("h2", { style: { fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }, children: recommendation.title }), _jsx("p", { style: { fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }, children: recommendation.description }), _jsxs("div", { style: { background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }, children: [_jsx("div", { style: { fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase' }, children: "Why this?" }), _jsx("div", { style: { fontSize: '0.95rem', color: 'var(--text-primary)' }, children: recommendation.reasonSummary })] }), _jsx(Button, { onClick: handleAction, icon: _jsx(ArrowRight, { size: 18 }), style: { width: '100%' }, children: recommendation.actionLabel })] }));
};
//# sourceMappingURL=NextBestActionCard.js.map