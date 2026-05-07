import api from './api';

export const logService = {
    getAll: async (params) => {
        const response = await api.get('/log-aktivitas', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/log-aktivitas/${id}`);
        return response.data;
    }
};
