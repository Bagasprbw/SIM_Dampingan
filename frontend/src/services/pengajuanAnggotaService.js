import api from './api';

export const pengajuanAnggotaService = {
    getAll: async (params) => {
        const response = await api.get('/anggota-grup/pending', { params });
        return response.data;
    },

    indexAjukanSaya: async (params) => {
        const response = await api.get('/anggota-grup/ajukan-saya', { params });
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/anggota-grup/ajukan', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.post(`/anggota-grup/ajukan/${id}`, data, {
            params: { _method: 'PUT' }
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/anggota-grup/ajukan/${id}`);
        return response.data;
    },

    terima: async (id) => {
        const response = await api.patch(`/anggota-grup/${id}/verifikasi`, { status: 'aktif' });
        return response.data;
    },

    tolak: async (id) => {
        const response = await api.patch(`/anggota-grup/${id}/verifikasi`, { status: 'ditolak' });
        return response.data;
    }
};
