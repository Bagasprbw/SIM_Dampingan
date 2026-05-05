import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated, getUser } from '../utils/storage';
import { ROUTE_ACCESS } from '../constants/routes';

const RouteGuard = () => {
    const location = useLocation();
    const isAuth = isAuthenticated();
    const user = getUser();
    const currentPath = location.pathname;

    // Jika belum login, lempar ke halaman login
    if (!isAuth) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Role user saat ini
    const userRole = user?.role;

    // Cek apakah role user memiliki akses ke path ini
    let hasAccess = false;

    // Cek strict match atau prefix match
    for (const [route, allowedRoles] of Object.entries(ROUTE_ACCESS)) {
        if (currentPath === route || currentPath.startsWith(route + '/')) {
            if (allowedRoles.includes(userRole)) {
                hasAccess = true;
                break;
            }
        }
    }

    // Jika akses tidak diizinkan, kita lemparkan ke dashboard (sebagai default route) atau Forbidden.
    // Dashboard diizinkan untuk semua role, jadi aman.
    if (!hasAccess && currentPath !== '/dashboard') {
        // Bisa diredirect ke dashboard, atau ke komponen halaman khusus 403.
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default RouteGuard;
