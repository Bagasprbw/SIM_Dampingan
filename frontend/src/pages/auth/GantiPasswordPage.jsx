import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Search, LogOut } from 'lucide-react';
import Swal from 'sweetalert2';
import { getUser } from '../../utils/storage';
import { AUTH_USER_KEY } from '../../constants/storageKeys';
import { profilService } from '../../services/profilService';
import { useLogout } from '../../hooks/useLogin';

const GantiPasswordPage = () => {
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    
    const [currentPassword, setCurrentPassword] = useState('12345678');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const user = getUser();
    const navigate = useNavigate();
    const { logout } = useLogout();

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Lengkapi password',
                text: 'Password lama, baru, dan konfirmasi wajib diisi.',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' },
            });
            return;
        }

        if (newPassword === '12345678') {
            Swal.fire({
                icon: 'warning',
                title: 'Password Tidak Aman',
                text: 'Jangan gunakan password default (12345678) sebagai password baru Anda.',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' },
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Konfirmasi tidak cocok',
                text: 'Password baru dan konfirmasi harus sama.',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' },
            });
            return;
        }

        setIsSaving(true);
        try {
            await profilService.updatePassword({
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });

            // Hapus flag must_change_password di localStorage
            const latestUser = getUser() || user;
            const updatedUser = { ...latestUser, must_change_password: false };
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Password Anda telah berhasil diperbarui.',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                customClass: {
                    popup: 'rounded-2xl font-["Poppins"]',
                    title: 'text-[#0A0F1E] font-bold',
                }
            });

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            const message = error?.response?.data?.message || 'Terjadi kesalahan saat memperbarui password.';
            Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: message,
                confirmButtonColor: '#EF4444',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' },
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[#f8f9fa] flex items-center justify-center font-['Poppins'] p-4">
            <div className="w-full max-w-[420px] bg-white rounded-[24px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden p-6 md:p-8 space-y-6">
                
                {/* Header */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <img
                        src="/images/logo-mpm.png"
                        alt="Logo MPM"
                        className="w-[48px] h-auto object-contain"
                    />
                    <h1 className="text-[#1E1E1E] text-2xl font-bold tracking-wide">
                        GANTI PASSWORD
                    </h1>
                    <p className="text-[#636364] text-xs leading-relaxed max-w-[320px]">
                        Anda sedang menggunakan password default. Untuk menjaga keamanan akun Anda, silakan ubah password Anda sekarang.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="space-y-4">
                    {/* Password Lama */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#374151] text-[10px] font-semibold uppercase tracking-wider">Password Lama</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F59E0B]">
                                <Lock size={16} />
                            </div>
                            <input 
                                type={showCurrentPass ? "text" : "password"} 
                                placeholder="Masukkan password saat ini (12345678)"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full pl-11 pr-11 py-2.5 bg-white rounded-[10px] border border-[#E5E7EB] text-[#0A0F1E] text-sm font-normal focus:outline-none focus:border-[#0080C5] transition-colors placeholder:text-slate-300"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowCurrentPass(!showCurrentPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Password Baru */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#374151] text-[10px] font-semibold uppercase tracking-wider">Password Baru</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F59E0B]">
                                <Lock size={16} />
                            </div>
                            <input 
                                type={showPass ? "text" : "password"} 
                                placeholder="Masukkan password baru"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pl-11 pr-11 py-2.5 bg-white rounded-[10px] border border-[#E5E7EB] text-[#0A0F1E] text-sm font-normal focus:outline-none focus:border-[#0080C5] transition-colors placeholder:text-slate-300"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Konfirmasi Password */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#374151] text-[10px] font-semibold uppercase tracking-wider">Konfirmasi Password Baru</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F59E0B]">
                                <Search size={16} className="rotate-90" />
                            </div>
                            <input 
                                type={showConfirmPass ? "text" : "password"} 
                                placeholder="Ulangi password baru"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-11 pr-11 py-2.5 bg-white rounded-[10px] border border-[#E5E7EB] text-[#0A0F1E] text-sm font-normal focus:outline-none focus:border-[#0080C5] transition-colors placeholder:text-slate-300"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                        <button 
                            type="button"
                            onClick={logout}
                            className="w-full py-2.5 rounded-[10px] border border-[#E5E7EB] text-[#6B7280] text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                        <button 
                            type="submit"
                            className="w-full py-2.5 rounded-[10px] bg-[#0080C5] text-white text-sm font-semibold hover:bg-[#006da8] transition-colors shadow-lg shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GantiPasswordPage;
