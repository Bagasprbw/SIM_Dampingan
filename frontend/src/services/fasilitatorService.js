import api from './api';

export const fasilitatorService = {
    getAll: async (params) => {
        const response = await api.get('/users/fasilitator', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/users/fasilitator/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/users/fasilitator', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/users/fasilitator/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/users/fasilitator/${id}`);
        return response.data;
    },

    resetPassword: async (id) => {
        const response = await api.post(`/users/reset-password/${id}`);
        return response.data;
    },

    toggleStatus: async (id) => {
        const response = await api.patch(`/users/fasilitator/${id}/toggle-status`);
        return response.data;
    }
};
