import api from './api';

export const importService = {
    preview: async (type, rows) => {
        const response = await api.post('/import/preview', { type, rows });
        return response.data;
    },

    commit: async (type, valid_rows) => {
        const response = await api.post('/import/commit', { type, valid_rows });
        return response.data;
    }
};

export default importService;
