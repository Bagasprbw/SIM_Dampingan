import api from './api';

export const adminService = {
    getAll: async (params) => {
        const response = await api.get('/users/admin-bawahan', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/users/admin-bawahan/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/users/admin-bawahan', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/users/admin-bawahan/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/users/admin-bawahan/${id}`);
        return response.data;
    },

    resetPassword: async (id) => {
        const response = await api.post(`/users/reset-password/${id}`);
        return response.data;
    }
};
