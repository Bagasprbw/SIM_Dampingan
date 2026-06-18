import axios from 'axios';
import { clearAuthData } from '../utils/storage';

// Default `/api` = same-origin (Docker nginx & production domain).
// Dev Vite: proxy /api → localhost:8000 di vite.config.js
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Accept': 'application/json',
    },
});

// Request interceptor: otomatis pasang token di setiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: handle 401 (token expired/invalid → auto logout)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearAuthData();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
