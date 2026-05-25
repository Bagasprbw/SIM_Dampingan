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
        // Gunakan POST dengan _method=PUT agar Laravel bisa menghandle multipart/form-data (upload file) pada update
        const response = await api.post(`/anggota-grup/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/anggota-grup/${id}`);
        return response.data;
    },

    toggleStatus: async (id, status) => {
        const response = await api.patch(`/anggota-grup/${id}/toggle-status`, { status });
        return response.data;
    }
};
