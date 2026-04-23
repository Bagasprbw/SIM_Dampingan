import { loginRequest, logoutRequest, getMeRequest } from '../endpoints/authEndpoints';
import { saveAuthData, clearAuthData } from '../../utils/storage';

/**
 * Login: memanggil API, mengembalikan data + token TANPA menyimpan ke localStorage.
 * Penyimpanan dilakukan secara terpisah via commitLogin() agar modal bisa tampil dulu.
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

        // Kembalikan token + user, JANGAN simpan dulu ke localStorage
        return { token: access_token, user: mappedUser };
    },

    // Panggil ini SETELAH modal sukses selesai (saat redirect)
    commitLogin: ({ token, user }) => {
        saveAuthData(token, user);
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
