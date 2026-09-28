import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from './Card';
export const StatCard = ({ label, value, subtext, icon, badge, }) => {
    return (_jsxs(Card, { className: "stat-card", hoverLift: true, children: [_jsxs("div", { className: "stat-card-top", children: [_jsx("span", { className: "stat-card-label", children: label }), _jsx("div", { className: "stat-card-icon", children: icon })] }), _jsxs("div", { children: [_jsx("div", { className: "stat-card-value", children: value }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [subtext && _jsx("span", { className: "stat-card-subtext", children: subtext }), badge] })] })] }));
};
//# sourceMappingURL=StatCard.js.map