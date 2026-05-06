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
        const response = await api.get('/fasilitator/grup-dampingan', { params });
        return response.data;
    },

    getPjGrup: async () => {
        const response = await api.get('/pj-dampingan/grup-dampingan');
        return response.data;
    }
};
