import api from './api';

export const setupInterceptors = (onLogout) => {
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                
                // Here you would typically try to refresh the token.
                // For now, we will just call onLogout if we get 401.
                if (onLogout) {
                    onLogout();
                }
                
                return Promise.reject(error);
            }

            return Promise.reject(error);
        }
    );
};
