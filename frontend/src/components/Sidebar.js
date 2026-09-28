import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAV_ITEMS } from '../constants/navigation';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Button } from './ui/Button';
export const Sidebar = ({ mobileOpen = false, onCloseMobileSidebar, }) => {
    const navigate = useNavigate();
    const { userProfile, logout } = useAuth();
    const handleLogout = async () => {
        if (onCloseMobileSidebar)
            onCloseMobileSidebar();
        await logout();
        navigate('/login');
    };
    const handleProfileClick = () => {
        if (onCloseMobileSidebar)
            onCloseMobileSidebar();
        navigate('/profile');
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: `sidebar-overlay ${mobileOpen ? 'active' : ''}`, onClick: onCloseMobileSidebar }), _jsx("aside", { className: `shell-sidebar ${mobileOpen ? 'mobile-open' : ''}`, children: _jsxs("div", { className: "sidebar-content", children: [_jsx("div", { children: _jsxs("div", { className: "sidebar-group", children: [_jsx("div", { className: "sidebar-label", children: "ARENA Platform" }), _jsx("ul", { className: "sidebar-nav-list", onClick: onCloseMobileSidebar, children: NAV_ITEMS.map((item) => {
                                            const Icon = item.icon;
                                            return (_jsx(motion.li, { whileHover: { x: 4 }, whileTap: { scale: 0.98 }, transition: { type: "spring", stiffness: 400, damping: 25 }, children: _jsxs(NavLink, { to: item.path, className: ({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`, children: [_jsxs("div", { className: "sidebar-link-left", children: [_jsx("span", { className: "sidebar-link-icon", children: _jsx(Icon, { size: 18 }) }), _jsx("span", { children: item.label })] }), item.isComingSoon && (_jsx("span", { className: "sidebar-badge", children: "Soon" }))] }) }, item.id));
                                        }) })] }) }), _jsxs("div", { children: [userProfile && (_jsxs("div", { onClick: handleProfileClick, style: {
                                        background: 'var(--bg-surface-elevated)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '0.85rem',
                                        marginBottom: '0.75rem',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.2s ease',
                                    }, title: "View & Edit Student Profile", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }, children: [_jsx(UserIcon, { size: 14, style: { color: 'var(--primary)' } }), _jsx("span", { style: { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }, children: userProfile.fullName })] }), _jsx("div", { style: { fontSize: '0.72rem', color: 'var(--text-muted)', wordBreak: 'break-all' }, children: userProfile.email })] })), _jsx(Button, { variant: "outline", size: "sm", fullWidth: true, icon: _jsx(LogOut, { size: 14 }), onClick: handleLogout, children: "Logout" })] })] }) })] }));
};
//# sourceMappingURL=Sidebar.js.map