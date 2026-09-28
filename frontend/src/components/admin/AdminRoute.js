import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const AdminRoute = () => {
    const { currentUser, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-900", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" }) }));
    }
    if (!currentUser) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // Basic UX guard based on UID (The backend enforces true security)
    // In a real app, this would check a role claim on the Firebase token.
    const adminUids = ['mock-uid-admin', 'admin-user-123'];
    const isAdmin = adminUids.includes(currentUser.uid);
    if (!isAdmin) {
        return _jsx(Navigate, { to: "/admin/access-denied", replace: true });
    }
    return _jsx(Outlet, {});
};
export default AdminRoute;
//# sourceMappingURL=AdminRoute.js.map