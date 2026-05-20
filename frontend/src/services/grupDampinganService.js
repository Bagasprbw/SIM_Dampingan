import api from './api';

export const grupDampinganService = {
    getAll: async (params) => {
        const response = await api.get('/grup-dampingan', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/grup-dampingan/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/grup-dampingan', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/grup-dampingan/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/grup-dampingan/${id}`);
        return response.data;
    },

    getFasilitatorGrup: async (params) => {
        // Backend sudah melakukan cascade filter: fasilitator hanya melihat grup yang ia dampingi
        const response = await api.get('/grup-dampingan', { params });
        return response.data;
    },

    getPjGrup: async () => {
        // Step 1: Dapatkan list grup yang dikelola (untuk PJ Grup akan return array berisi 1 grup)
        const groupsRes = await api.get('/grup-dampingan');
        const groups = groupsRes.data?.data || [];
        
        if (groups.length === 0) {
            throw new Error('Grup tidak ditemukan');
        }

        // Step 2: Ambil detail grup tersebut (termasuk relasi anggotaGrupDampingans)
        const id = groups[0].id_grup_dampingan;
        const detailRes = await api.get(`/grup-dampingan/${id}`);
        return detailRes.data;
    }
};
