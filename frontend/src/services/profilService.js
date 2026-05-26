import api from './api';

export const profilService = {
    updateNoTelp: async (noTelp) => {
        const response = await api.put('/profil/change-no-telp', { no_telp: noTelp });
        return response.data;
    },
    updatePassword: async (payload) => {
        const response = await api.put('/profil/change-password', payload);
        return response.data;
    },
};
