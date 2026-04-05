import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../constants/storageKeys';

export const saveAuthData = (token, user) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
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

export const clearAuthData = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
};

export const isAuthenticated = () => !!getToken();
