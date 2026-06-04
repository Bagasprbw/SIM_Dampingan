import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated, getUser, getPermissions } from '../utils/storage';
import { ROUTE_ACCESS, ROUTE_PERMISSIONS, DEFAULT_ROUTE_BY_ROLE } from '../constants/routes';

const RouteGuard = () => {
    const location = useLocation();
    const isAuth = isAuthenticated();
    const user = getUser();
    const currentPath = location.pathname;

    // Jika belum login, lempar ke halaman login
    if (!isAuth) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Cek paksa ganti password
    if (user?.must_change_password) {
        if (currentPath !== '/ganti-password') {
            return <Navigate to="/ganti-password" replace />;
        }
    } else {
        if (currentPath === '/ganti-password') {
            return <Navigate to="/dashboard" replace />;
        }
    }

    // Ambil role user
    let userRole = typeof user?.role === 'object' && user?.role !== null ? user.role.name : user?.role;
    if (!userRole && user?.username === 'superadmin') {
        userRole = 'superadmin';
    }

    // Superadmin melewati semua check
    if (userRole === 'superadmin') {
        return <Outlet />;
    }

    // Role-based guard (defense-in-depth): pastikan route memang untuk role ini.
    // Ini mencegah kasus fasilitator "kebawa" permission admin dari cache/konfigurasi.
    let allowedRoles = undefined;
    for (const [route, roles] of Object.entries(ROUTE_ACCESS)) {
        if (currentPath === route || currentPath.startsWith(route + '/')) {
            allowedRoles = roles;
            break;
        }
    }

    if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        const fallback = DEFAULT_ROUTE_BY_ROLE?.[userRole] || '/dashboard';
        return <Navigate to={fallback} replace />;
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
    const hasAccess = Array.isArray(requiredPermission)
        ? requiredPermission.some((perm) => userPermissions.includes(perm))
        : userPermissions.includes(requiredPermission);

    if (!hasAccess) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default RouteGuard;
