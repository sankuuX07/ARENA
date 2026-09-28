import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Compass, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { recommendationService } from '../../services/recommendationService';
import { StudentRecommendation } from '../../types/recommendation';
export const RecommendationWidget = () => {
    const navigate = useNavigate();
    const [nextAction, setNextAction] = useState(null);
    useEffect(() => {
        recommendationService.getNextAction()
            .then(setNextAction)
            .catch(console.error); // Silently ignore if no action
    }, []);
    if (!nextAction)
        return null;
    return (_jsxs(Card, { style: { marginBottom: '2rem', border: '2px solid var(--primary)' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }, children: [_jsx(Compass, { size: 20 }), _jsx("h3", { style: { margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }, children: "Your Next Step" })] }), _jsx("h2", { style: { fontSize: '1.25rem', marginBottom: '0.5rem' }, children: nextAction.title }), _jsx("p", { style: { fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }, children: nextAction.description }), _jsxs("div", { style: { display: 'flex', gap: '1rem' }, children: [_jsx(Button, { onClick: () => navigate(nextAction.actionRoute), icon: _jsx(ArrowRight, { size: 16 }), children: nextAction.actionLabel }), _jsx(Button, { variant: "outline", onClick: () => navigate('/recommendations'), children: "View My Plan" })] })] }));
};
//# sourceMappingURL=RecommendationWidget.js.map