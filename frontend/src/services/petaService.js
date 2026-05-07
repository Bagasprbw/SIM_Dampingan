import api from './api';

export const petaService = {
    getStatistik: async () => {
        const response = await api.get('/peta-sebaran');
        return response.data;
    },
};
