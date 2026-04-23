import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authRepository } from '../api/repositories/authRepository';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    // Simpan data hasil login sementara, belum commit ke localStorage
    const pendingAuthRef = useRef(null);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const data = await authRepository.login(credentials);
            // Simpan sementara di ref, JANGAN ke localStorage dulu
            pendingAuthRef.current = data;
            return data.user;
        } catch (err) {
            const message = err.response?.data?.message ?? 'Terjadi kesalahan. Coba lagi.';
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    // Dipanggil saat modal sukses selesai, baru simpan ke localStorage
    const commitLogin = () => {
        if (pendingAuthRef.current) {
            authRepository.commitLogin(pendingAuthRef.current);
            pendingAuthRef.current = null;
        }
    };

    return { login, commitLogin, loading };
};

export const useLogout = () => {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await authRepository.logout();
            navigate('/login');
        } catch (err) {
            // Jika API gagal, tetap hapus data lokal dan redirect
            authRepository.clearAuthData();
            navigate('/login');
        }
    };

    return { logout };
};
