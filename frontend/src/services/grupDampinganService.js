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
        // TODO: aktifkan saat endpoint BE tersedia
        // NEEDS BE: GET /api/fasilitator/grup-dampingan | response: { data: [{ id, nama_grup, ... }] }
        // const response = await api.get('/fasilitator/grup-dampingan', { params });
        // return response.data;
        
        return {
            data: [
                { id: 1, nama_grup: 'Grup Tani Makmur', bidang: { nama_bidang: 'Pertanian' } },
                { id: 2, nama_grup: 'Grup Nelayan Jaya', bidang: { nama_bidang: 'Perikanan' } }
            ],
            meta: { current_page: 1, last_page: 1, total: 2 }
        };
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
