import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Clock, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
export const ComingSoon = ({ moduleTitle, moduleDescription, icon, features = [], }) => {
    const navigate = useNavigate();
    return (_jsx("div", { className: "placeholder-page-wrapper", children: _jsxs(Card, { className: "coming-soon-card", children: [_jsx("div", { className: "coming-soon-icon-ring", children: icon }), _jsx(Badge, { variant: "warning", icon: _jsx(Clock, { size: 12 }), className: "mb-3", children: "Coming Soon" }), _jsx("h2", { className: "coming-soon-title", children: moduleTitle }), _jsx("p", { className: "coming-soon-desc", children: moduleDescription }), _jsx(Button, { variant: "secondary", onClick: () => navigate('/dashboard'), children: "Back to Dashboard" }), features.length > 0 && (_jsx("div", { className: "feature-preview-grid", children: features.map((feat, index) => (_jsxs("div", { className: "preview-item", children: [_jsxs("div", { className: "preview-item-title", children: [_jsx(Sparkles, { size: 14, style: { color: 'var(--primary)' } }), _jsx("span", { children: feat.title })] }), _jsx("div", { className: "preview-item-desc", children: feat.description })] }, index))) }))] }) }));
};
//# sourceMappingURL=ComingSoon.js.map