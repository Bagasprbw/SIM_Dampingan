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
        // TODO: aktifkan saat endpoint BE tersedia
        // NEEDS BE: GET /api/pj-dampingan/grup-dampingan | response: { data: { id, nama_grup, anggota: [...] } }
        // const response = await api.get('/pj-dampingan/grup-dampingan');
        // return response.data;

        return {
            data: {
                id: 1,
                nama_grup: 'Grup Tani Makmur (Mock)',
                bidang: { nama_bidang: 'Pertanian' },
                kabupaten: { name: 'Kab. Bantul' },
                provinsi: { name: 'DI Yogyakarta' },
                fasilitators: [
                    { id_user: 1, name: 'Budi Fasilitator' }
                ],
                anggota: [
                    { id: 1, no_anggota: 'AGT-001', nama: 'Siti Aminah', jenis_kelamin: 'P', alamat: 'Bantul' },
                    { id: 2, no_anggota: 'AGT-002', nama: 'Joko Widodo', jenis_kelamin: 'L', alamat: 'Bantul' }
                ]
            }
        };
    }
};
