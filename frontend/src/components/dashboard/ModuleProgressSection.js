import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ModuleProgressItem } from '../../services/dashboardService';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const ModuleProgressSection = ({ modules }) => {
    const navigate = useNavigate();
    return (_jsxs(Card, { style: { marginBottom: '1.5rem' }, children: [_jsxs("div", { className: "arena-card-header", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(TrendingUp, { size: 20, style: { color: 'var(--primary)' } }), _jsx("h2", { className: "card-title", children: "Module Progress" })] }), _jsx(Badge, { variant: "neutral", children: "Placement Modules" })] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.1rem' }, children: modules.map((mod) => (_jsxs("div", { onClick: () => navigate(mod.path), style: { cursor: 'pointer' }, className: "skill-item", children: [_jsxs("div", { className: "skill-info", style: { marginBottom: '0.35rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.4rem' }, children: [_jsx("span", { style: { fontWeight: 600, color: 'var(--text-main)' }, children: mod.name }), _jsx(ChevronRight, { size: 14, style: { color: 'var(--text-dim)' } })] }), _jsxs("span", { style: { fontSize: '0.85rem', color: 'var(--text-muted)' }, children: [mod.progressPercentage, "%"] })] }), _jsx("div", { className: "skill-track", children: _jsx("div", { className: "skill-fill", style: { width: `${mod.progressPercentage}%` } }) })] }, mod.id))) })] }));
};
//# sourceMappingURL=ModuleProgressSection.js.map