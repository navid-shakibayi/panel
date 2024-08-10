import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = sessionStorage.getItem('jwt');

    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
