import api from '../config/axiosInstance';

/**
 * POST /api/login
 */
export const loginRequest = (credentials) =>
    api.post('/login', credentials);

/**
 * POST /api/logout
 */
export const logoutRequest = () =>
    api.post('/logout');

/**
 * GET /api/me
 */
export const getMeRequest = () =>
    api.get('/me');
