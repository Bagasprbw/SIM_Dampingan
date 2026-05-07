import api from './api';

export const panduanService = {
    getAllKelola: async (params) => {
        const response = await api.get('/kelola-panduan', { params });
        return response.data;
    },
    getByIdKelola: async (id) => {
        const response = await api.get(`/kelola-panduan/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/kelola-panduan', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/kelola-panduan/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/kelola-panduan/${id}`);
        return response.data;
    },

    getAllView: async (params) => {
        const response = await api.get('/view-panduan', { params });
        return response.data;
    },
    getByIdView: async (id) => {
        const response = await api.get(`/view-panduan/${id}`);
        return response.data;
    }
};
