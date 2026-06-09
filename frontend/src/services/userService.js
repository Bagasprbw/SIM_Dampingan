import api from './api';

export const userService = {
    checkUsername: async (username, excludeId = null) => {
        const response = await api.get('/users/check-username', {
            params: { username, ...(excludeId ? { exclude_id: excludeId } : {}) },
        });
        return response.data;
    },
};
