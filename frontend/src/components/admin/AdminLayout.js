import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Trophy, BookOpen, Activity, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
const AdminLayout = () => {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Students', href: '/admin/students', icon: Users },
        { name: 'Competitions', href: '/admin/competitions', icon: Trophy },
        { name: 'Content', href: '/admin/content', icon: BookOpen },
        { name: 'Activity', href: '/admin/activity', icon: Activity },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-gray-950 flex flex-col md:flex-row font-sans text-gray-100", children: [_jsxs("aside", { className: "w-full md:w-64 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0", children: [_jsxs("div", { className: "p-6 flex items-center gap-3", children: [_jsx(ShieldAlert, { className: "text-red-500 h-8 w-8" }), _jsx("h1", { className: "text-xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent", children: "ARENA Admin" })] }), _jsx("nav", { className: "flex-1 px-4 space-y-2 mt-4", children: navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (_jsxs(Link, { to: item.href, className: `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-red-500/10 text-red-400 font-medium border border-red-500/20'
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`, children: [_jsx(item.icon, { className: "h-5 w-5" }), item.name] }, item.name));
                        }) }), _jsx("div", { className: "p-4 border-t border-gray-800 mt-auto", children: _jsxs("div", { className: "flex items-center justify-between px-2 mb-4", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-sm font-medium text-gray-200 truncate w-32", children: currentUser?.displayName || 'Admin' }), _jsx("span", { className: "text-xs text-red-400 font-medium", children: "Administrator" })] }), _jsx("button", { onClick: logout, className: "p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors", title: "Logout", children: _jsx(LogOut, { className: "h-5 w-5" }) })] }) })] }), _jsx("main", { className: "flex-1 overflow-y-auto", children: _jsx("div", { className: "max-w-7xl mx-auto p-4 md:p-8", children: _jsx(Outlet, {}) }) })] }));
};
export default AdminLayout;
//# sourceMappingURL=AdminLayout.js.map