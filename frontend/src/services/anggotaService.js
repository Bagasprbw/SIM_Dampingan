import api from './api';

export const anggotaService = {
    getAll: async (params) => {
        const response = await api.get('/anggota-grup', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/anggota-grup/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/anggota-grup', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/anggota-grup/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/anggota-grup/${id}`);
        return response.data;
    }
};
