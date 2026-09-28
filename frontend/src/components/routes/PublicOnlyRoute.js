import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
export const PublicOnlyRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return null;
    }
    if (isAuthenticated) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return _jsx(Outlet, {});
};
//# sourceMappingURL=PublicOnlyRoute.js.map