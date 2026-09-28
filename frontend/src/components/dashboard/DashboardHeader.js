import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { UserProfile } from '../../types';
import { getTimeOfDayGreeting } from '../../services/dashboardService';
import { Badge } from '../ui/Badge';
import { GraduationCap, Shield } from 'lucide-react';
export const DashboardHeader = ({ profile }) => {
    const greeting = getTimeOfDayGreeting();
    const studentName = profile?.fullName || 'Student';
    return (_jsxs("div", { style: { marginBottom: '2rem' }, children: [_jsx("div", { style: { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }, children: _jsx(Badge, { variant: "primary", icon: _jsx(Shield, { size: 12 }), children: "ARENA Student Dashboard" }) }), _jsxs("h1", { className: "page-title", style: { fontSize: '2.2rem', marginBottom: '0.35rem' }, children: [greeting, ", ", _jsx("span", { className: "text-gradient", children: studentName }), " \uD83D\uDC4B"] }), _jsx("p", { className: "page-header-description", style: { fontSize: '1.05rem' }, children: "Ready to continue your placement preparation and competitive learning journey?" }), profile?.college && (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }, children: [_jsx(GraduationCap, { size: 16, style: { color: 'var(--primary)' } }), _jsxs("span", { children: [profile.college, " ", profile.branch ? `• ${profile.branch}` : '', " ", profile.graduationYear ? `(Batch '${profile.graduationYear.slice(-2)})` : ''] })] }))] }));
};
//# sourceMappingURL=DashboardHeader.js.map