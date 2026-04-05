import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authRepository } from '../api/repositories/authRepository';

export const useLogout = () => {
    const navigate = useNavigate();

    const logout = async () => {
        const result = await Swal.fire({
            title: 'Keluar dari akun?',
            text: 'Anda akan diarahkan ke halaman login.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Keluar',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#e53e3e',
            cancelButtonColor: '#718096',
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {
            await authRepository.logout();
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil Keluar',
                text: 'Sampai jumpa kembali!',
                timer: 1500,
                showConfirmButton: false,
                timerProgressBar: true,
            });
            navigate('/login');
        } catch {
            // tetap navigasi walaupun request gagal (token sudah dihapus)
            navigate('/login');
        }
    };

    return { logout };
};
