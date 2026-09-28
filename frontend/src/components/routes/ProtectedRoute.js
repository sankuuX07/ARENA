import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../LoadingSpinner';
export const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { style: {
                display: 'flex',
                minHeight: '50vh',
                alignItems: 'center',
                justifyContent: 'center',
            }, children: _jsx(LoadingSpinner, { message: "Checking authentication status...", size: 20 }) }));
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(Outlet, {});
};
//# sourceMappingURL=ProtectedRoute.js.map