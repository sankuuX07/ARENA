import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { adminService, AdminDashboardStats } from '../../services/adminService';
import { Users, Activity, Trophy, BookOpen } from 'lucide-react';
const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        adminService.getDashboardStats()
            .then(setStats)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);
    if (loading)
        return _jsx("div", { className: "text-gray-400", children: "Loading dashboard..." });
    if (error)
        return _jsxs("div", { className: "text-red-500", children: ["Error: ", error] });
    if (!stats)
        return null;
    return (_jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight text-white", children: "Platform Overview" }), _jsx("p", { className: "text-gray-400 mt-2", children: "Real-time statistics and activity for the ARENA platform." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsx(StatCard, { title: "Total Students", value: stats.totalStudents, icon: Users, color: "bg-blue-500" }), _jsx(StatCard, { title: "Active Students", value: stats.activeStudents, icon: Activity, color: "bg-green-500" }), _jsx(StatCard, { title: "Live Competitions", value: stats.liveCompetitions, icon: Trophy, color: "bg-yellow-500" }), _jsx(StatCard, { title: "Assessments Completed", value: stats.completedAssessments, icon: BookOpen, color: "bg-purple-500" })] }), _jsxs("div", { className: "bg-gray-900 border border-gray-800 rounded-2xl p-6", children: [_jsx("h3", { className: "text-xl font-semibold text-white mb-4", children: "Recent Activity" }), _jsxs("div", { className: "space-y-4", children: [stats.recentActivity.map((activity) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50", children: [_jsx("span", { className: "text-gray-200", children: activity.action }), _jsx("span", { className: "text-sm text-gray-500", children: activity.time })] }, activity.id))), stats.recentActivity.length === 0 && (_jsx("div", { className: "text-gray-500 text-center py-8", children: "No recent activity found." }))] })] })] }));
};
const StatCard = ({ title, value, icon: Icon, color }) => (_jsxs("div", { className: "bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-4", children: [_jsx("div", { className: `p-4 rounded-xl ${color}/20 text-white`, children: _jsx(Icon, { className: `w-8 h-8 text-${color.split('-')[1]}-400` }) }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-sm font-medium", children: title }), _jsx("p", { className: "text-3xl font-bold text-white mt-1", children: value })] })] }));
export default AdminDashboardPage;
//# sourceMappingURL=AdminDashboardPage.js.map