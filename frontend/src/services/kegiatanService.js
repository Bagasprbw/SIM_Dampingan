import api from './api';

export const kegiatanService = {
    getAllFasilitator: async (params) => {
        const response = await api.get('/kelola-kegiatan', { params });
        return response.data;
    },
    
    getAllAdmin: async (params) => {
        const response = await api.get('/kegiatan', { params });
        return response.data;
    },

    getByIdFasilitator: async (id) => {
        const response = await api.get(`/kelola-kegiatan/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/kelola-kegiatan', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/kelola-kegiatan/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/kelola-kegiatan/${id}`);
        return response.data;
    }
};
