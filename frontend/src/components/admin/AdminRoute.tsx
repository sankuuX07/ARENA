import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Basic UX guard based on UID (The backend enforces true security)
  // In a real app, this would check a role claim on the Firebase token.
  const adminUids = ['mock-uid-admin', 'admin-user-123'];
  const isAdmin = adminUids.includes(currentUser.uid);

  if (!isAdmin) {
    return <Navigate to="/admin/access-denied" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
