// hook untuk menangani proses login (termasuk: state loading dan error handling)
// ini nanti di panggil di LoginPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authRepository } from '../api/repositories/authRepository';
import { ROLE_LABELS } from '../constants/roles';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const login = async (credentials) => {
        setLoading(true);
        try {
            const user = await authRepository.login(credentials);

            const roleLabel = ROLE_LABELS[user.role] ?? user.role;

            await Swal.fire({
                icon: 'success',
                title: 'Login Berhasil!',
                html: `Selamat datang, <strong>${user.name}</strong><br/><span style="color:#6b7280;font-size:0.9rem">${roleLabel}</span>`,
                timer: 1800,
                showConfirmButton: false,
                timerProgressBar: true,
            });

            navigate('/dashboard');
        } catch (err) {
            const message =
                err.response?.data?.message ?? 'Terjadi kesalahan. Coba lagi.';
            Swal.fire({
                icon: 'error',
                title: 'Login Gagal',
                text: message,
                confirmButtonColor: '#337ab7',
            });
        } finally {
            setLoading(false);
        }
    };

    return { login, loading };
};
