import api from './api';

export const bidangService = {
    getAll: async () => {
        const response = await api.get('/bidang');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/bidang', data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/bidang/${id}`);
        return response.data;
    }
};

export default bidangService;
