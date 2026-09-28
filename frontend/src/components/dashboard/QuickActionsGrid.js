import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { QuickActionItem } from '../../services/dashboardService';
import { Brain, Puzzle, MessageSquare, Code2, ClipboardCheck, Video, ArrowRight, Zap, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const getIcon = (iconName) => {
    switch (iconName) {
        case 'Brain':
            return _jsx(Brain, { size: 18 });
        case 'Puzzle':
            return _jsx(Puzzle, { size: 18 });
        case 'MessageSquare':
            return _jsx(MessageSquare, { size: 18 });
        case 'Code2':
            return _jsx(Code2, { size: 18 });
        case 'ClipboardCheck':
            return _jsx(ClipboardCheck, { size: 18 });
        case 'Video':
            return _jsx(Video, { size: 18 });
        default:
            return _jsx(Zap, { size: 18 });
    }
};
export const QuickActionsGrid = ({ actions }) => {
    const navigate = useNavigate();
    return (_jsxs(Card, { style: { marginBottom: '1.5rem' }, children: [_jsxs("div", { className: "arena-card-header", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Zap, { size: 20, style: { color: 'var(--warning)' } }), _jsx("h2", { className: "card-title", children: "Quick Actions" })] }), _jsx(Badge, { variant: "warning", children: "Direct Practice" })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }, children: actions.map((act) => (_jsxs(Card, { hoverLift: true, style: {
                        padding: '1rem',
                        background: 'var(--bg-surface-elevated)',
                        cursor: 'pointer',
                    }, onClick: () => navigate(act.path), children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }, children: [_jsx("div", { style: {
                                        padding: '0.4rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--primary-light)',
                                        color: 'var(--primary)',
                                        display: 'flex',
                                    }, children: getIcon(act.iconName) }), _jsx(Badge, { variant: "neutral", style: { fontSize: '0.68rem' }, children: act.category })] }), _jsx("h3", { style: { fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.35rem' }, children: act.title }), _jsx("p", { className: "caption-text", style: { fontSize: '0.78rem', marginBottom: '0.65rem' }, children: act.description }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }, children: [_jsx("span", { children: "Launch" }), _jsx(ArrowRight, { size: 12 })] })] }, act.id))) })] }));
};
//# sourceMappingURL=QuickActionsGrid.js.map