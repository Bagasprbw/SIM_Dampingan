import { loginRequest, logoutRequest, getMeRequest } from '../endpoints/authEndpoints';
import { saveAuthData, savePermissions, clearAuthData } from '../../utils/storage';

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
            kode_prov: user.kode_prov,
            kode_kab: user.kode_kab,
            kode_kec: user.kode_kec,
        };

        // Permissions dari backend (array of code strings)
        const permissions = user.permissions ?? [];

        // Kembalikan token + user + permissions, JANGAN simpan dulu ke localStorage
        return { token: access_token, user: mappedUser, permissions };
    },

    // Panggil ini SETELAH modal sukses selesai (saat redirect)
    commitLogin: ({ token, user, permissions }) => {
        saveAuthData(token, user);
        savePermissions(permissions ?? []);
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
            kode_prov: user.kode_prov,
            kode_kab: user.kode_kab,
            kode_kec: user.kode_kec,
        };
    },
};
