import api from './api';

const wilayahService = {
    /**
     * Mengambil daftar provinsi dari database internal
     * @returns {Promise<Array>} Array of { kode, name }
     */
    getProvinsi: async () => {
        try {
            const res = await api.get('/wilayah/provinsi');
            return res.data.data;
        } catch (error) {
            console.error('Error fetching provinsi:', error);
            return [];
        }
    },

    /**
     * Mengambil daftar kabupaten berdasarkan kode provinsi dari database internal
     * @param {string} kodeProvinsi 
     * @returns {Promise<Array>} Array of { kode, name, kode_prov }
     */
    getKabupaten: async (kodeProvinsi) => {
        if (!kodeProvinsi) return [];
        try {
            const res = await api.get(`/wilayah/kabupaten/${kodeProvinsi}`);
            return res.data.data;
        } catch (error) {
            console.error('Error fetching kabupaten:', error);
            return [];
        }
    },

    /**
     * Mengambil daftar kecamatan berdasarkan kode kabupaten dari database internal
     * @param {string} kodeKabupaten 
     * @returns {Promise<Array>} Array of { kode, name, kode_kab }
     */
    getKecamatan: async (kodeKabupaten) => {
        if (!kodeKabupaten) return [];
        try {
            const res = await api.get(`/wilayah/kecamatan/${kodeKabupaten}`);
            return res.data.data;
        } catch (error) {
            console.error('Error fetching kecamatan:', error);
            return [];
        }
    },
};

export default wilayahService;
