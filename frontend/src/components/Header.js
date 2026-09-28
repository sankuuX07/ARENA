import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Sun, Moon, Menu, LayoutDashboard, Home, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { APP_NAME } from '../constants';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
export const Header = ({ onToggleMobileSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, userProfile, logout } = useAuth();
    const getInitials = (name) => {
        if (!name)
            return 'ST';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    return (_jsx("header", { className: "shell-header", children: _jsxs("div", { className: "header-container", children: [_jsxs("div", { className: "header-left", children: [isAuthenticated && onToggleMobileSidebar && (_jsx("button", { onClick: onToggleMobileSidebar, className: "mobile-menu-toggle", "aria-label": "Toggle navigation menu", children: _jsx(Menu, { size: 22 }) })), _jsxs(Link, { to: "/", className: "brand-link", children: [_jsx("div", { className: "brand-logo-box", children: _jsx(Shield, { size: 22 }) }), _jsx("span", { className: "brand-title", children: APP_NAME }), _jsx(Badge, { variant: "primary", children: "v4 Profile" })] })] }), _jsxs("div", { className: "header-right", children: [_jsxs("nav", { className: "header-nav-links", children: [_jsxs(Link, { to: "/", className: `header-nav-item ${location.pathname === '/' ? 'active' : ''}`, children: [_jsx(Home, { size: 16 }), _jsx("span", { children: "Home" })] }), isAuthenticated && (_jsxs(_Fragment, { children: [_jsxs(Link, { to: "/dashboard", className: `header-nav-item ${location.pathname.startsWith('/dashboard') ? 'active' : ''}`, children: [_jsx(LayoutDashboard, { size: 16 }), _jsx("span", { children: "Dashboard" })] }), _jsxs(Link, { to: "/profile", className: `header-nav-item ${location.pathname.startsWith('/profile') ? 'active' : ''}`, children: [_jsx(User, { size: 16 }), _jsx("span", { children: "Profile" })] })] }))] }), _jsx("button", { onClick: toggleTheme, className: "theme-toggle-btn", title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, "aria-label": "Toggle theme", children: theme === 'dark' ? _jsx(Sun, { size: 18 }) : _jsx(Moon, { size: 18 }) }), isAuthenticated ? (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [_jsxs("div", { className: "user-profile-badge", title: `Manage Profile: ${userProfile?.fullName || 'Student'}`, style: { cursor: 'pointer' }, onClick: () => navigate('/profile'), children: [_jsx("div", { className: "avatar-circle", style: { overflow: 'hidden' }, children: userProfile?.profilePhotoUrl ? (_jsx("img", { src: userProfile.profilePhotoUrl, alt: userProfile.fullName, style: { width: '100%', height: '100%', objectFit: 'cover' } })) : (getInitials(userProfile?.fullName)) }), _jsxs("div", { className: "user-info-text", children: [_jsx("span", { className: "user-name", children: userProfile?.fullName || 'Student Account' }), _jsxs("span", { className: "user-role", children: ["Role: ", userProfile?.role || 'student'] })] })] }), _jsx(Button, { variant: "ghost", size: "sm", icon: _jsx(LogOut, { size: 16 }), onClick: handleLogout, title: "Logout", children: "Logout" })] })) : (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Link, { to: "/login", style: { textDecoration: 'none' }, children: _jsx(Button, { variant: "ghost", size: "sm", icon: _jsx(LogIn, { size: 16 }), children: "Login" }) }), _jsx(Link, { to: "/register", style: { textDecoration: 'none' }, children: _jsx(Button, { variant: "primary", size: "sm", icon: _jsx(UserPlus, { size: 16 }), children: "Get Started" }) })] }))] })] }) }));
};
//# sourceMappingURL=Header.js.map