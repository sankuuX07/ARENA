import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { RecentActivityItem } from '../../services/dashboardService';
import { Activity, CheckCircle2 } from 'lucide-react';
export const RecentActivityList = ({ activities = [] }) => {
    return (_jsxs(Card, { style: { marginBottom: '1.5rem' }, children: [_jsx("div", { className: "arena-card-header", children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Activity, { size: 20, style: { color: 'var(--secondary)' } }), _jsx("h2", { className: "card-title", children: "Recent Activity" })] }) }), activities.length === 0 ? (_jsx(EmptyState, { title: "No recent activity yet", description: "Start practicing to build your ARENA activity history.", icon: _jsx(Activity, { size: 32 }) })) : (_jsx("div", { className: "activity-list", children: activities.map((act) => (_jsxs("div", { className: "activity-item", children: [_jsx("div", { className: "activity-icon-badge", children: _jsx(CheckCircle2, { size: 16 }) }), _jsxs("div", { className: "activity-content", children: [_jsx("div", { className: "activity-title", children: act.title }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }, children: [_jsx("span", { className: "activity-time", children: act.timeAgo }), act.scoreBadge && (_jsx(Badge, { variant: "success", style: { fontSize: '0.65rem' }, children: act.scoreBadge }))] })] })] }, act.id))) }))] }));
};
//# sourceMappingURL=RecentActivityList.js.map