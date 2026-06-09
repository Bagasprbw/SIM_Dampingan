import React, { useState, useEffect } from 'react';
import { X, Lock, Eye, EyeOff, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import { getUser } from '../../utils/storage';
import { AUTH_USER_KEY } from '../../constants/storageKeys';
import { ROLE_LABELS } from '../../constants/roles';
import { profilService } from '../../services/profilService';

const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();
};

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
    return `${baseUrl}/storage/${path}`;
};

const ProfileModal = ({ isOpen, onClose, isForced = false }) => {
    const [showPasswordFields, setShowPasswordFields] = useState(isForced || false);
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const user = getUser();
    // Normalize role — bisa berupa object { name: '...' } atau string langsung
    const userRole = typeof user?.role === 'object' && user?.role !== null ? user.role.name : user?.role;
    const [noTelp, setNoTelp] = useState('');
    const [originalNoTelp, setOriginalNoTelp] = useState('');
    const [profileFoto, setProfileFoto] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verifyName, setVerifyName] = useState('');
    const [verifyUsername, setVerifyUsername] = useState('');
    const [verifyRole, setVerifyRole] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Force show password fields if isForced is true
    useEffect(() => {
        if (isForced) {
            setShowPasswordFields(true);
        }
    }, [isForced]);

    // Fetch profil terbaru dari API setiap kali modal dibuka
    useEffect(() => {
        if (!isOpen) return;
        profilService.getProfile()
            .then(res => {
                const data = res?.data || {};
                setNoTelp(data.no_telp || '');
                setOriginalNoTelp(data.no_telp || '');
                setProfileFoto(data.foto || null);
            })
            .catch(() => {
                // Fallback ke localStorage jika API gagal
                setNoTelp(user?.no_telp || '');
                setOriginalNoTelp(user?.no_telp || '');
                setProfileFoto(user?.foto || null);
            });
    }, [isOpen]);


    const handleSave = async () => {
        if (!user) return;

        const hasNoTelpChange = noTelp !== originalNoTelp;
        const wantsPasswordChange = showPasswordFields && (currentPassword || newPassword || confirmPassword);

        if (isForced && !wantsPasswordChange) {
            Swal.fire({
                icon: 'warning',
                title: 'Wajib Ganti Password',
                text: 'Anda harus mengganti password default demi keamanan akun.',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' },
            });
            return;
        }

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
            if (!currentPassword || !newPassword || !confirmPassword || !verifyName || !verifyUsername || !verifyRole) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Lengkapi data',
                    text: 'Verifikasi identitas dan password wajib diisi.',
                    confirmButtonColor: '#0080C5',
                    customClass: { popup: 'rounded-2xl font-["Poppins"]' },
                });
                return;
            }
            if (newPassword === '12345678' || newPassword.length < 8 || !/(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Password lemah',
                    text: 'Password minimal 8 karakter, huruf + angka, bukan password default.',
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
                // Simpan user terbaru ke localStorage dengan key yang benar
                const updatedUser = response?.data ? { ...user, ...response.data } : { ...user, no_telp: noTelp };
                localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
            }

            if (wantsPasswordChange) {
                await profilService.updatePassword({
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                    verify_name: verifyName,
                    verify_username: verifyUsername,
                    verify_role: verifyRole,
                });
                
                // Hapus flag must_change_password di localStorage
                const latestUser = getUser() || user;
                const updatedUser = { ...latestUser, must_change_password: false };
                localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
            }

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
            if (!isForced) {
                setShowPasswordFields(false);
            }

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
                onClick={() => {
                    if (!isForced) onClose();
                }}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[400px] bg-white rounded-[20px] shadow-[0px_20px_60px_0px_rgba(0,0,0,0.18)] overflow-hidden transition-all duration-300 ease-in-out">
                
                {/* Header Section */}
                <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {profileFoto ? (
                                <img
                                    src={getImageUrl(profileFoto)}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full border-[1.6px] border-[#0080C5] object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full border-[1.6px] border-[#0080C5] bg-[#EFF6FF] flex items-center justify-center">
                                    <span className="text-[#0080C5] text-sm font-bold leading-none">{getInitials(user?.name)}</span>
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-[1.6px] border-white" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[#0A0F1E] text-base font-bold leading-tight">Profil Akun</h3>
                            <p className="text-[#9298B0] text-[10px] font-normal leading-tight mt-0.5">Kelola informasi dan keamanan akun Anda</p>
                        </div>
                    </div>
                    {!isForced && (
                        <button 
                            onClick={onClose}
                            className="w-7 h-7 bg-[#F1F5F9] rounded-full flex items-center justify-center text-[#64748B] hover:bg-gray-200 transition-colors"
                        >
                            <X size={14} strokeWidth={3} />
                        </button>
                    )}
                </div>

                {/* Form Section */}
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Warning Banner for Forced Password Change */}
                    {isForced && (
                        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] rounded-xl font-medium leading-relaxed">
                            ⚠️ Akun Anda menggunakan password default / telah di-reset. Anda wajib memperbarui password Anda sebelum melanjutkan ke Dashboard.
                        </div>
                    )}

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
                            <span className="text-[#0A0F1E] text-sm font-normal">{ROLE_LABELS[userRole] || userRole || 'Guest'}</span>
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
                    {!isForced && (
                        <div className="flex justify-end">
                            <button 
                                onClick={() => setShowPasswordFields(!showPasswordFields)}
                                className="text-[#0080C5] text-[11px] font-semibold hover:underline"
                            >
                                {showPasswordFields ? 'Sembunyikan Password' : 'Ubah Password'}
                            </button>
                        </div>
                    )}

                    {/* Hidden Password Fields */}
                    {showPasswordFields && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Verifikasi Identitas</p>
                                <input type="text" placeholder="Nama lengkap Anda" value={verifyName} onChange={(e) => setVerifyName(e.target.value)} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs focus:border-[#0080C5] focus:outline-none" />
                                <input type="text" placeholder="Username Anda" value={verifyUsername} onChange={(e) => setVerifyUsername(e.target.value)} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs focus:border-[#0080C5] focus:outline-none" />
                                <input type="text" placeholder={`Role (contoh: ${userRole || 'fasilitator'})`} value={verifyRole} onChange={(e) => setVerifyRole(e.target.value)} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs focus:border-[#0080C5] focus:outline-none" />
                            </div>
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
                    {!isForced && (
                        <button 
                            onClick={onClose}
                            className="px-6 py-2 rounded-[10px] border border-[#E5E7EB] text-[#6B7280] text-xs font-semibold hover:bg-gray-50 transition-colors h-10"
                            disabled={isSaving}
                        >
                            Batal
                        </button>
                    )}
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 rounded-[10px] bg-[#0080C5] text-white text-xs font-semibold hover:bg-[#006da8] transition-colors shadow-lg shadow-blue-100 h-10 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
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
