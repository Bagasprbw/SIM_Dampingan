import api from './api';

export const publicService = {
    getProfilAnggota: async (id) => {
        const response = await api.get(`/anggota-grup/profil/${id}`);
        return response.data;
    },

    getStatistics: async () => {
        const response = await api.get('/public/statistics');
        return response.data;
    },

    getPetaSebaran: async () => {
        const response = await api.get('/public/peta-sebaran');
        return response.data;
    },

    getLandingPage: async () => {
        const response = await api.get('/public/landing-page');
        return response.data;
    },
};
