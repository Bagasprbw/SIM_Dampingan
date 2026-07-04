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

    getById: async (id) => {
        const response = await api.get(`/kelola-kegiatan/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/kelola-kegiatan', data);
        return response.data;
    },

    update: async (id, data) => {
        const isFormData = data instanceof FormData;
        if (isFormData) {
            data.append('_method', 'PUT');
            const response = await api.post(`/kelola-kegiatan/${id}`, data);
            return response.data;
        }
        const response = await api.put(`/kelola-kegiatan/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/kelola-kegiatan/${id}`);
        return response.data;
    },

    uploadFotoKegiatan: async (kegiatanId, files) => {
        const formData = new FormData();
        files.forEach((file) => formData.append('files[]', file));
        const response = await api.post(`/kelola-kegiatan/${kegiatanId}/foto-kegiatan`, formData);
        return response.data;
    },

    uploadFotoAbsensi: async (kegiatanId, files) => {
        const formData = new FormData();
        files.forEach((file) => formData.append('files[]', file));
        const response = await api.post(`/kelola-kegiatan/${kegiatanId}/foto-absensi`, formData);
        return response.data;
    },

    addPeserta: async (kegiatanId, data) => {
        const response = await api.post(`/kelola-kegiatan/${kegiatanId}/peserta`, data);
        return response.data;
    },

    syncPeserta: async (kegiatanId, data) => {
        const response = await api.post(`/kelola-kegiatan/${kegiatanId}/peserta/sync`, { peserta: data });
        return response.data;
    },

    deleteFotoKegiatan: async (kegiatanId, idFoto) => {
        const response = await api.delete(`/kelola-kegiatan/${kegiatanId}/foto-kegiatan/${idFoto}`);
        return response.data;
    },

    deleteFotoAbsensi: async (kegiatanId, idFotoAbsensi) => {
        const response = await api.delete(`/kelola-kegiatan/${kegiatanId}/foto-absensi/${idFotoAbsensi}`);
        return response.data;
    },
};
