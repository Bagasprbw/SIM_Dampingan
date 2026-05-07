import api from './api';

export const pengajuanAnggotaService = {
    getAll: async (params) => {
        const response = await api.get('/anggota-grup/pending', { params });
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/anggota-grup/ajukan', data);
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
