import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated, getUser, getPermissions } from '../utils/storage';
import { ROUTE_PERMISSIONS } from '../constants/routes';

const RouteGuard = () => {
    const location = useLocation();
    const isAuth = isAuthenticated();
    const user = getUser();
    const currentPath = location.pathname;

    // Jika belum login, lempar ke halaman login
    if (!isAuth) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Ambil role user
    let userRole = typeof user?.role === 'object' && user?.role !== null ? user.role.name : user?.role;
    if (!userRole && user?.username === 'superadmin') {
        userRole = 'superadmin';
    }

    // Superadmin melewati semua permission check
    if (userRole === 'superadmin') {
        return <Outlet />;
    }

    // Ambil permissions dari localStorage (dinamis dari DB)
    const userPermissions = getPermissions(); // string[]

    // Cari permission yang dibutuhkan untuk path saat ini (prefix match)
    let requiredPermission = undefined;
    for (const [route, perm] of Object.entries(ROUTE_PERMISSIONS)) {
        if (currentPath === route || currentPath.startsWith(route + '/')) {
            requiredPermission = perm;
            break;
        }
    }

    // Jika path tidak ada di peta ROUTE_PERMISSIONS → izinkan (route internal/publik)
    if (requiredPermission === undefined) {
        return <Outlet />;
    }

    // null = semua user login boleh akses
    if (requiredPermission === null) {
        return <Outlet />;
    }

    // Cek apakah user punya permission yang dibutuhkan
    const hasAccess = userPermissions.includes(requiredPermission);

    if (!hasAccess) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default RouteGuard;
