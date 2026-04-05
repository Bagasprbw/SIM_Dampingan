import { loginRequest, logoutRequest, getMeRequest } from '../endpoints/authEndpoints';
import { saveAuthData, clearAuthData } from '../../utils/storage';

/**
 * Login: memanggil API, menyimpan token+user, mengembalikan objek user yang sudah dipetakan
 */
export const authRepository = {
    login: async ({ username, password }) => {
        const res = await loginRequest({ username, password });
        const { access_token, user } = res.data;

        const mappedUser = {
            id: user.id_user,
            name: user.name,
            username: user.username,
            role: user.role,
        };

        saveAuthData(access_token, mappedUser);
        return mappedUser;
    },

    logout: async () => {
        try {
            await logoutRequest();
        } finally {
            clearAuthData();
        }
    },

    getMe: async () => {
        const res = await getMeRequest();
        const { user } = res.data;
        return {
            id: user.id_user,
            name: user.name,
            username: user.username,
            role: user.role?.name ?? null,
            permissions: user.role?.permissions?.map((p) => p.code) ?? [],
        };
    },
};
