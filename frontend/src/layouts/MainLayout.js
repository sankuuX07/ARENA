import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/routes/PageTransition';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
export const MainLayout = () => {
    const location = useLocation();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const isLandingPage = location.pathname === '/';
    // Also consider login and register pages as pages that should not have a sidebar,
    // though isAuthenticated check already handles it for logged out users.
    // We want to ensure no sidebar on auth pages even if there's a routing glitch.
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const toggleMobileSidebar = () => {
        setMobileSidebarOpen((prev) => !prev);
    };
    const closeMobileSidebar = () => {
        setMobileSidebarOpen(false);
    };
    const shouldShowSidebar = !isLandingPage && !isAuthPage && isAuthenticated;
    return (_jsxs("div", { className: "app-shell", children: [_jsx(Header, { onToggleMobileSidebar: toggleMobileSidebar }), _jsxs("div", { className: "shell-body", children: [shouldShowSidebar && (_jsx(Sidebar, { mobileOpen: mobileSidebarOpen, onCloseMobileSidebar: closeMobileSidebar })), _jsx("main", { className: `shell-main ${(!shouldShowSidebar) ? 'full-width' : ''}`, children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(PageTransition, { children: _jsx(Outlet, {}) }, location.pathname) }) })] }), isLandingPage && _jsx(Footer, {})] }));
};
//# sourceMappingURL=MainLayout.js.map