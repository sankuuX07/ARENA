import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AnalyticsCategory } from '../../types/analytics';
import { TrendingUp, TrendingDown, Minus, HelpCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const AnalyticsCategoryCard = ({ category, viewRoute }) => {
    const navigate = useNavigate();
    const getTrendIcon = () => {
        switch (category.trend) {
            case 'Improving': return _jsx(TrendingUp, { size: 16, style: { color: 'var(--success)' } });
            case 'Declining': return _jsx(TrendingDown, { size: 16, style: { color: 'var(--danger)' } });
            case 'Stable': return _jsx(Minus, { size: 16, style: { color: 'var(--text-secondary)' } });
            default: return _jsx(HelpCircle, { size: 16, style: { color: 'var(--text-muted)' } });
        }
    };
    return (_jsxs(Card, { style: { display: 'flex', flexDirection: 'column', height: '100%' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }, children: [_jsx("h3", { style: { margin: 0 }, children: category.name }), category.score !== null ? (_jsxs("div", { style: { fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }, children: [category.score, _jsx("span", { style: { fontSize: '1rem', color: 'var(--text-muted)' }, children: "/100" })] })) : (_jsx("div", { style: { fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }, children: "No Data" }))] }), category.score !== null ? (_jsxs("div", { style: { flex: 1 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }, children: [_jsx("span", { style: { color: 'var(--text-secondary)' }, children: "Performance" }), _jsx("span", { style: { fontWeight: 'bold' }, children: category.performanceLevel })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }, children: [_jsx("span", { style: { color: 'var(--text-secondary)' }, children: "Activities" }), _jsxs("span", { children: [category.completedActivities, " completed"] })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '1.5rem', alignItems: 'center' }, children: [_jsx("span", { style: { color: 'var(--text-secondary)' }, children: "Trend" }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.25rem' }, children: [getTrendIcon(), _jsx("span", { children: category.trend })] })] }), _jsx(Button, { variant: "outline", style: { width: '100%' }, onClick: () => navigate(viewRoute), children: "View Details" })] })) : (_jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1rem 0' }, children: [_jsx("p", { style: { color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '1rem' }, children: "Start practicing to build your performance analytics." }), _jsx(Button, { onClick: () => navigate(viewRoute), icon: _jsx(ArrowRight, { size: 16 }), children: "Start Practice" })] }))] }));
};
//# sourceMappingURL=AnalyticsCategoryCard.js.map