import api from './api';

export const masterService = {
    getBidangs: async () => {
        const response = await api.get('/bidang');
        return response.data;
    },

    getPekerjaans: async () => {
        const response = await api.get('/pekerjaan');
        return response.data;
    },

    getGrupSaya: async () => {
        // PJ Grup only sees their groups
        const response = await api.get('/anggota-grup/ajukan-saya');
        // Actually we need a specific endpoint to just get the group names
        // For now, we can extract from the pengajuan data or use a mock
        // Better to use the endpoint if it exists. 
        // Based on api.php, there's no specific "my-groups" for PJ Grup other than this.
        return response.data;
    }
};
