import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If user's role is not authorized, redirect to their respective dashboard
        return <Navigate to={user.role === 'Admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
