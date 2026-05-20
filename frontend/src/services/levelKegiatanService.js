import api from './api';

export const levelKegiatanService = {
    getAll: async () => {
        const response = await api.get('/level-kegiatan');
        return response.data;
    },
};

export default levelKegiatanService;
