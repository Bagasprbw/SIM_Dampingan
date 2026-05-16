import api from './api';

export const bidangService = {
    getAll: async () => {
        const response = await api.get('/bidang');
        return response.data;
    }
};

export default bidangService;
