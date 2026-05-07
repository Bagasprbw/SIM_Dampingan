import api from './api';

export const pjGrupService = {
    getAll: async (params) => {
        const response = await api.get('/users/pj-grup', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/users/pj-grup/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/users/pj-grup', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/users/pj-grup/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/users/pj-grup/${id}`);
        return response.data;
    }
};
