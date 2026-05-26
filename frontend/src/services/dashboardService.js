import api from './api';

export const dashboardService = {
    getFasilitator: async () => {
        const response = await api.get('/dashboard/fasilitator');
        return response.data;
    },
    getAdmin: async () => {
        const response = await api.get('/dashboard/admin');
        return response.data;
    },
    getPjDampingan: async () => {
        const response = await api.get('/dashboard/pj-dampingan');
        return response.data;
    },
};