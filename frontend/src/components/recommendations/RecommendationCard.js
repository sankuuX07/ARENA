import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { StudentRecommendation } from '../../types/recommendation';
import { useNavigate } from 'react-router-dom';
import { recommendationService } from '../../services/recommendationService';
export const RecommendationCard = ({ recommendation, onDismissed }) => {
    const navigate = useNavigate();
    const [isDismissing, setIsDismissing] = useState(false);
    const handleAction = async () => {
        // Optionally mark as complete right away, or just navigate.
        // We'll navigate, the backend should ideally auto-complete based on actual activity later.
        navigate(recommendation.actionRoute);
    };
    const handleDismiss = async () => {
        setIsDismissing(true);
        try {
            await recommendationService.dismissRecommendation(recommendation.recommendationId);
            if (onDismissed)
                onDismissed();
        }
        catch (err) {
            console.error(err);
            setIsDismissing(false);
        }
    };
    const getPriorityColor = () => {
        switch (recommendation.priority) {
            case 'critical': return 'var(--danger)';
            case 'high': return 'var(--warning)';
            case 'medium': return 'var(--primary)';
            case 'low': return 'var(--success)';
            default: return 'var(--text-muted)';
        }
    };
    return (_jsxs(Card, { style: { opacity: isDismissing ? 0.5 : 1, transition: 'opacity 0.2s' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }, children: [_jsxs(Badge, { style: { background: getPriorityColor(), color: 'white' }, children: [recommendation.priority.toUpperCase(), " PRIORITY"] }), _jsx("div", { style: { fontSize: '0.8rem', color: 'var(--text-muted)' }, children: recommendation.targetCategory.toUpperCase() })] }), _jsx("h3", { style: { fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }, children: recommendation.title }), _jsx("p", { style: { fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }, children: recommendation.description }), _jsxs("div", { style: { borderLeft: '3px solid var(--border-color)', paddingLeft: '0.75rem', marginBottom: '1.5rem' }, children: [_jsx("div", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }, children: "Based on your data:" }), _jsx("div", { style: { fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }, children: recommendation.reasonSummary })] }), _jsxs("div", { style: { display: 'flex', gap: '0.5rem' }, children: [_jsx(Button, { onClick: handleAction, style: { flex: 1 }, children: recommendation.actionLabel }), _jsx(Button, { variant: "outline", onClick: handleDismiss, disabled: isDismissing, children: "Dismiss" })] })] }));
};
//# sourceMappingURL=RecommendationCard.js.map