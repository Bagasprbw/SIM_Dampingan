import { AUTH_TOKEN_KEY, AUTH_USER_KEY, AUTH_PERMISSIONS_KEY } from '../constants/storageKeys';

export const saveAuthData = (token, user) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const savePermissions = (permissions) => {
    localStorage.setItem(AUTH_PERMISSIONS_KEY, JSON.stringify(permissions));
};

export const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const getUser = () => {
    try {
        const raw = localStorage.getItem(AUTH_USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

/**
 * Mengembalikan array permission codes milik user yang sedang login.
 * Contoh: ['kelola_fasilitator', 'view_kegiatan', ...]
 */
export const getPermissions = () => {
    try {
        const raw = localStorage.getItem(AUTH_PERMISSIONS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const clearAuthData = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_PERMISSIONS_KEY);
};

export const isAuthenticated = () => !!getToken();
