import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsOverview } from '../../types/analytics';
export const AnalyticsWidget = () => {
    const navigate = useNavigate();
    const [overview, setOverview] = useState(null);
    useEffect(() => {
        analyticsService.getOverview().then(setOverview).catch(console.error);
    }, []);
    if (!overview)
        return null;
    return (_jsxs(Card, { style: { marginBottom: '2rem' }, children: [_jsx("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(BarChart2, { size: 24, style: { color: 'var(--primary)' } }), _jsx("h2", { style: { margin: 0, fontSize: '1.25rem' }, children: "Your Performance" })] }) }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }, children: "Overall Preparation Score" }), _jsxs("div", { style: { fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }, children: [overview.overallScore, " ", _jsx("span", { style: { fontSize: '1rem', color: 'var(--text-muted)' }, children: "/ 100" })] }), _jsxs("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)' }, children: ["Based on ", overview.coverage.exploredCategories, " of ", overview.coverage.availableCategories, " areas"] })] }), _jsxs("div", { children: [overview.strengths.length > 0 && (_jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("div", { style: { fontSize: '0.9rem', color: 'var(--text-secondary)' }, children: "Top Strength:" }), _jsx("div", { style: { fontWeight: 'bold' }, children: overview.strengths[0].categoryName })] })), overview.improvementAreas.length > 0 && (_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.9rem', color: 'var(--text-secondary)' }, children: "Focus Area:" }), _jsx("div", { style: { fontWeight: 'bold' }, children: overview.improvementAreas[0].categoryName })] }))] })] }), _jsx(Button, { style: { width: '100%' }, onClick: () => navigate('/analytics'), children: "View Full Analytics" })] }));
};
//# sourceMappingURL=AnalyticsWidget.js.map