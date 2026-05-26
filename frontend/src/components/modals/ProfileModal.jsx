import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import { getUser } from '../../utils/storage';
import { ROLE_LABELS } from '../../constants/roles';
import { profilService } from '../../services/profilService';

const ProfileModal = ({ isOpen, onClose }) => {
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const user = getUser();
    const [noTelp, setNoTelp] = useState(user?.no_telp || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!user) return;

        const hasNoTelpChange = noTelp !== (user?.no_telp || '');
        const wantsPasswordChange = showPasswordFields && (currentPassword || newPassword || confirmPassword);

        if (!hasNoTelpChange && !wantsPasswordChange) {
            Swal.fire({
                icon: 'info',
                title: 'Tidak ada perubahan',
                text: 'Tidak ada data yang diperbarui.',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' },
            });
            return;
        }

        if (showPasswordFields) {
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
        }

        setIsSaving(true);
        try {
            if (hasNoTelpChange) {
                const response = await profilService.updateNoTelp(noTelp);
                const updatedUser = response?.data ? { ...user, ...response.data } : { ...user, no_telp: noTelp };
                localStorage.setItem('AUTH_USER', JSON.stringify(updatedUser));
                if (user.role === 'superadmin' || user.username === 'superadmin') {
                    localStorage.setItem('superadmin_wa', noTelp);
                }
            }

            if (wantsPasswordChange) {
                await profilService.updatePassword({
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                });
            }

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordFields(false);

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Informasi profil telah diperbarui.',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                customClass: {
                    popup: 'rounded-2xl font-["Poppins"]',
                    title: 'text-[#0A0F1E] font-bold',
                }
            });
            
            onClose();
        } catch (error) {
            const message = error?.response?.data?.message || 'Terjadi kesalahan saat memperbarui profil.';
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[400px] bg-white rounded-[20px] shadow-[0px_20px_60px_0px_rgba(0,0,0,0.18)] overflow-hidden transition-all duration-300 ease-in-out">
                
                {/* Header Section */}
                <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img 
                                src={user?.foto || "/images/superadmin.png"} 
                                alt="Profile" 
                                className="w-10 h-10 rounded-full border-[1.6px] border-[#0080C5] object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-[1.6px] border-white" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[#0A0F1E] text-base font-bold leading-tight">Profil Akun</h3>
                            <p className="text-[#9298B0] text-[10px] font-normal leading-tight mt-0.5">Kelola informasi dan keamanan akun Anda</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-7 h-7 bg-[#F1F5F9] rounded-full flex items-center justify-center text-[#64748B] hover:bg-gray-200 transition-colors"
                    >
                        <X size={14} strokeWidth={3} />
                    </button>
                </div>

                {/* Form Section */}
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Input Nama */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#374151] text-[10px] font-semibold uppercase tracking-wider">Username</label>
                        <div className="px-4 py-2.5 bg-[#F9FAFB] rounded-[10px] border border-[#E5E7EB]">
                            <span className="text-[#0A0F1E] text-sm font-normal">{user?.username || user?.name || 'User'}</span>
                        </div>
                    </div>

                    {/* Input Role */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#374151] text-[10px] font-semibold uppercase tracking-wider">Role</label>
                        <div className="px-4 py-2.5 bg-[#F9FAFB] rounded-[10px] border border-[#E5E7EB] flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#0080C5] rounded-full" />
                            <span className="text-[#0A0F1E] text-sm font-normal">{ROLE_LABELS[user?.role] || user?.role || 'Guest'}</span>
                        </div>
                    </div>

                    {/* Input WhatsApp */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#374151] text-[10px] font-semibold uppercase tracking-wider">No. WhatsApp</label>
                        <input 
                            type="text" 
                            value={noTelp}
                            onChange={(e) => setNoTelp(e.target.value)}
                            placeholder="Contoh: 6281234567890"
                            className="px-4 py-2.5 bg-white rounded-[10px] border border-[#E5E7EB] text-[#0A0F1E] text-sm font-normal focus:outline-none focus:border-[#0080C5] transition-colors"
                        />
                    </div>

                    {/* Toggle Password Fields */}
                    <div className="flex justify-end">
                        <button 
                            onClick={() => setShowPasswordFields(!showPasswordFields)}
                            className="text-[#0080C5] text-[11px] font-semibold hover:underline"
                        >
                            {showPasswordFields ? 'Sembunyikan Password' : 'Ubah Password'}
                        </button>
                    </div>

                    {/* Hidden Password Fields */}
                    {showPasswordFields && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            {/* Password Lama */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#374151] text-[10px] font-semibold uppercase tracking-wider">Password Lama</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F59E0B]">
                                        <Lock size={16} />
                                    </div>
                                    <input 
                                        type={showCurrentPass ? "text" : "password"} 
                                        placeholder="Masukkan password lama"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full pl-11 pr-11 py-2.5 bg-white rounded-[10px] border border-[#E5E7EB] text-[#0A0F1E] text-sm font-normal focus:outline-none focus:border-[#0080C5] transition-colors placeholder:text-slate-300"
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
                                <label className="text-[#374151] text-[10px] font-semibold uppercase tracking-wider">Konfirmasi Password</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F59E0B]">
                                        <Search size={16} className="rotate-90" /> {/* Simulating the Figma key/search icon */}
                                    </div>
                                    <input 
                                        type={showConfirmPass ? "text" : "password"} 
                                        placeholder="Ulangi password baru"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-11 pr-11 py-2.5 bg-white rounded-[10px] border border-[#E5E7EB] text-[#0A0F1E] text-sm font-normal focus:outline-none focus:border-[#0080C5] transition-colors placeholder:text-slate-300"
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
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="px-6 py-5 flex items-center justify-end gap-3 bg-white">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 rounded-[10px] border border-[#E5E7EB] text-[#6B7280] text-xs font-semibold hover:bg-gray-50 transition-colors h-10"
                        disabled={isSaving}
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 rounded-[10px] bg-[#0080C5] text-white text-xs font-semibold hover:bg-[#006da8] transition-colors shadow-lg shadow-blue-100 h-10 disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
