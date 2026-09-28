import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const PerformanceOverviewCard = () => {
    const navigate = useNavigate();
    const mockCategories = [
        { name: 'Communication & GD', score: 70, color: 'var(--primary)' },
        { name: 'Aptitude & Logic', score: 50, color: 'var(--secondary)' },
        { name: 'Problem Solving & Coding', score: 80, color: 'var(--warning)' },
        { name: 'Technical Fundamentals', score: 40, color: 'var(--success)' },
    ];
    return (_jsxs(Card, { style: { marginBottom: '1.5rem' }, children: [_jsxs("div", { className: "arena-card-header", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(BarChart2, { size: 20, style: { color: 'var(--secondary)' } }), _jsx("h2", { className: "card-title", children: "Performance Overview" })] }), _jsx(Badge, { variant: "neutral", children: "Visual Demo" })] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }, children: mockCategories.map((cat, index) => (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.3rem' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }, children: [_jsx("span", { style: { fontWeight: 500 }, children: cat.name }), _jsxs("span", { style: { color: 'var(--text-muted)' }, children: [cat.score, "%"] })] }), _jsx("div", { className: "skill-track", style: { height: 6 }, children: _jsx("div", { className: "skill-fill", style: {
                                    width: `${cat.score}%`,
                                    background: cat.color,
                                } }) })] }, index))) }), _jsx(Button, { variant: "outline", size: "sm", fullWidth: true, onClick: () => navigate('/assessments'), children: "View Assessments" })] }));
};
//# sourceMappingURL=PerformanceOverviewCard.js.map