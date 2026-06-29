import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import AuthModal from '../../components/modals/AuthModal';
import { verifyForgotPasswordRequest } from '../../api/endpoints/authEndpoints';
import { landingPageService } from '../../services/landingPageService';
import { resolveStorageUrl } from '../../utils/resolveStorageUrl';
import Swal from 'sweetalert2';

const ROLE_LABELS = {
    'superadmin': 'Super Admin',
    'admin_provinsi': 'Admin Provinsi',
    'admin_kabupaten': 'Admin Kabupaten',
    'admin_kecamatan': 'Admin Kecamatan',
    'fasilitator': 'Fasilitator',
    'pj_grup': 'PJ Grup'
};

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, type: 'success' });
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [verifyName, setVerifyName] = useState('');
    const [verifyUsername, setVerifyUsername] = useState('');
    const [verifyRole, setVerifyRole] = useState('');
    const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);
    const [loginImageUrl, setLoginImageUrl] = useState(null);

    const { login, commitLogin, loading } = useLogin();
    const navigate = useNavigate();

    useEffect(() => {
        const savedUsername = localStorage.getItem('remembered_username');
        const savedPassword = localStorage.getItem('remembered_password');
        const savedRememberMe = localStorage.getItem('remember_me') === 'true';

        if (savedRememberMe && savedUsername && savedPassword) {
            setUsername(savedUsername);
            setPassword(savedPassword);
            setRememberMe(true);
        }

        const fetchLoginImage = async () => {
            try {
                const response = await landingPageService.getLandingPageData();
                if (response.status === 'success' && response.data.halaman_utama?.login_image) {
                    setLoginImageUrl(resolveStorageUrl(response.data.halaman_utama.login_image));
                }
            } catch (err) {
                console.error("Failed to fetch login image:", err);
            }
        };
        fetchLoginImage();
    }, []);

    const resetForgotForm = () => {
        setVerifyName('');
        setVerifyUsername('');
        setVerifyRole('');
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!verifyName || !verifyUsername || !verifyRole) return;

        setIsSubmittingForgot(true);
        try {
            await verifyForgotPasswordRequest({
                verify_name: verifyName,
                verify_username: verifyUsername,
                verify_role: verifyRole,
            });

            const superAdminWa = import.meta.env.VITE_SUPERADMIN_WA || '081234567890';
            if (!superAdminWa) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Nomor WhatsApp SuperAdmin belum diatur dalam sistem.',
                    confirmButtonColor: '#d33',
                });
                return;
            }

            let formattedWa = superAdminWa;
            if (formattedWa.startsWith('0')) {
                formattedWa = '62' + formattedWa.substring(1);
            }

            const displayRole = ROLE_LABELS[verifyRole] || verifyRole;
            const message = `Halo SuperAdmin, saya meminta bantuan reset password akun saya.\n\nNama: ${verifyName}\nUsername: ${verifyUsername}\nRole: ${displayRole}\n\nMohon bantu reset password akun saya. Terima kasih.`;
            const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent(message)}`;

            setShowForgotModal(false);
            resetForgotForm();
            window.open(waUrl, '_blank');
        } catch (error) {
            const message = error?.response?.data?.message || 'Data identitas tidak ditemukan atau tidak sesuai.';
            Swal.fire({
                icon: 'error',
                title: 'Verifikasi Gagal',
                text: message,
                confirmButtonColor: '#EF4444',
            });
        } finally {
            setIsSubmittingForgot(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login({ username, password, rememberMe });
            if (user) {
                if (rememberMe) {
                    localStorage.setItem('remembered_username', username);
                    localStorage.setItem('remembered_password', password);
                    localStorage.setItem('remember_me', 'true');
                } else {
                    localStorage.removeItem('remembered_username');
                    localStorage.removeItem('remembered_password');
                    localStorage.setItem('remember_me', 'false');
                }

                setModal({ isOpen: true, type: 'success' });
                setTimeout(() => {
                    commitLogin();
                    if (user.must_change_password) {
                        navigate('/ganti-password');
                    } else {
                        navigate('/dashboard');
                    }
                }, 3000);
            }
        } catch {
            setModal({ isOpen: true, type: 'error' });
            setTimeout(() => {
                setModal({ isOpen: false, type: 'error' });
            }, 5000);
        }
    };

    return (
        <div className="h-screen w-full bg-[#f8f9fa] lg:bg-white flex flex-col lg:flex-row overflow-hidden font-['Poppins']">

            {/* ── HERO IMAGE ──
                Mobile  : full-width di atas (40vh), urutan pertama secara visual
                Desktop : kolom kanan tetap (450px / 665px), full height
            */}
            <div className="relative w-full h-[40vh] min-h-[300px] lg:h-screen lg:w-[450px] xl:w-[665px] lg:order-2 shrink-0 overflow-hidden">
                <img
                    src={loginImageUrl || "/images/mentora-hero.png"}
                    alt="Mentora"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* ── FORM SECTION ──
                Mobile  : card putih slide-up di atas hero (-mt-8, rounded-t-[30px])
                Desktop : kolom kiri full height, centered
            */}
            <div className="flex-1 flex flex-col items-center justify-start lg:justify-center relative z-10 bg-white lg:order-1
                px-6 lg:px-12
                rounded-t-[30px] lg:rounded-none
                -mt-8 lg:mt-0 pt-6 lg:pt-0 pb-10 lg:pb-0
                overflow-y-auto lg:overflow-hidden
                shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:shadow-none">

                <div className="w-full max-w-[420px] flex flex-col lg:block min-h-full lg:min-h-0">

                    {/* Drag indicator — mobile only */}
                    <div className="w-full flex justify-center mb-8 lg:hidden">
                        <div className="w-[40px] h-[5px] bg-gray-300 rounded-full" />
                    </div>

                    {/* ── Header ── */}
                    <div className="flex flex-col items-center gap-3 mb-8">

                        {/* Logo MPM — desktop only (dari Code 2) */}
                        <img
                            src="/images/logo-mpm.png"
                            alt="Logo MPM"
                            className="hidden lg:block w-[48px] h-auto object-contain"
                        />

                        <h1 className="text-[#1E1E1E] text-[24px] lg:text-[30px] font-bold lg:font-semibold leading-normal tracking-wide">
                            LOGIN
                        </h1>
                        <p className="text-[#636364] text-[13px] lg:text-[14px] font-normal text-center tracking-[0.42px] leading-relaxed max-w-[300px] lg:max-w-none">
                            Selamat Datang di Website Resmi MPM - Mentora<br />
                            Masukkan Username dan Password Anda !
                        </p>
                    </div>

                    {/* ── Form ── */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 lg:flex-none">

                        {/* Username */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#1E1E1E] text-[14px] lg:text-[15px] font-semibold lg:font-medium tracking-[0.45px]">
                                Username
                            </label>
                            <div className="relative h-[50px] lg:h-[54px]">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full h-full border border-black/25 rounded-[10px] px-[18px] text-[15px] lg:text-[16px] font-medium tracking-[0.48px] outline-none focus:border-[#0080C5] placeholder:text-[#C5C6C7] transition-all bg-white"
                                    required
                                />
                                <div className="absolute right-[17px] top-1/2 -translate-y-1/2 text-[#C5C6C7]">
                                    <Mail size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#1E1E1E] text-[14px] lg:text-[15px] font-semibold lg:font-medium tracking-[0.45px]">
                                Password
                            </label>
                            <div className="relative h-[50px] lg:h-[54px]">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-full border border-black/25 rounded-[10px] px-[18px] text-[15px] lg:text-[16px] font-medium tracking-[0.48px] outline-none focus:border-[#0080C5] placeholder:text-[#C5C6C7] transition-all bg-white"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-[17px] top-1/2 -translate-y-1/2 text-[#C5C6C7] hover:text-[#0080C5] transition-colors"
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Lupa Password */}
                        <div className="flex items-center justify-between mt-1">
                            <label className="flex items-center gap-[7px] cursor-pointer group">
                                {/* Mobile: rounded checkbox | Desktop: square checkbox (Code 2 style) */}
                                <div className="w-[18px] h-[18px] lg:w-[19px] lg:h-[21px] border-2 border-[#CFCFCF] rounded-sm lg:rounded-none flex items-center justify-center relative transition-all group-hover:border-[#0080C5]">
                                    <input
                                        type="checkbox"
                                        className="hidden peer"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <div className="w-full h-full bg-[#0080C5] opacity-0 peer-checked:opacity-100 transition-all flex items-center justify-center rounded-sm lg:rounded-none">
                                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                            <path d="M1 5L4.33333 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <span className="text-[#1E1E1E] lg:text-black text-[13px] lg:text-[15px] font-semibold lg:font-medium tracking-[0.45px]">
                                    Ingat Saya
                                </span>
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowForgotModal(true)}
                                className="text-[#0080C5] text-[13px] lg:text-[15px] font-semibold lg:font-medium tracking-[0.45px] hover:underline"
                            >
                                Lupa Password
                            </button>
                        </div>

                        {/* Login Button
                            Mobile  : tinggi 46px, rounded-xl (Code 1)
                            Desktop : h-9 px-4, rounded-lg (Code 2) — lebih compact
                        */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full
                                h-[46px] lg:h-[48px]
                                bg-[#0080C5] text-white
                                rounded-xl lg:rounded-lg
                                flex items-center justify-center gap-2
                                hover:bg-sky-700 transition-all shadow-sm
                                text-[15px] font-semibold tracking-wide"
                        >
                            {loading ? 'MOHON TUNGGU...' : 'LOGIN'}
                        </button>

                        {/* Footer copyright — mobile only */}
                        <div className="mt-auto pt-8 flex justify-center pb-4 lg:hidden">
                            <span className="text-[#C5C6C7] text-[11px] font-medium text-center">
                                © 2025 Majelis Pemberdayaan Masyarakat
                            </span>
                        </div>
                    </form>
                </div>
            </div>

            {/* ── AUTH MODAL ── */}
            <AuthModal
                isOpen={modal.isOpen}
                type={modal.type}
            />

            {/* ── FORGOT PASSWORD MODAL ── */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => { setShowForgotModal(false); resetForgotForm(); }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Lupa Password?</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Verifikasi identitas Anda terlebih dahulu. Jika sesuai, sistem akan membuka WhatsApp ke SuperAdmin untuk permintaan reset password.
                        </p>
                        <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Verifikasi Identitas</p>
                                <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">Nama Lengkap</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0080C5]" />
                                        <input
                                            type="text"
                                            value={verifyName}
                                            onChange={(e) => setVerifyName(e.target.value)}
                                            placeholder="Ketik nama Anda sesuai akun"
                                            className="w-full h-10 border border-gray-300 rounded-lg pl-10 pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">Username</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0080C5]" />
                                        <input
                                            type="text"
                                            value={verifyUsername}
                                            onChange={(e) => setVerifyUsername(e.target.value)}
                                            placeholder="Ketik username Anda"
                                            className="w-full h-10 border border-gray-300 rounded-lg pl-10 pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">Role</label>
                                    <div className="relative">
                                        <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0080C5]" />
                                        <select
                                            value={verifyRole}
                                            onChange={(e) => setVerifyRole(e.target.value)}
                                            className="w-full h-10 border border-gray-300 rounded-lg pl-10 pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white"
                                            required
                                        >
                                            <option value="">-- Pilih Role --</option>
                                            <option value="superadmin">Super Admin</option>
                                            <option value="admin_provinsi">Admin Provinsi</option>
                                            <option value="admin_kabupaten">Admin Kabupaten</option>
                                            <option value="admin_kecamatan">Admin Kecamatan</option>
                                            <option value="fasilitator">Fasilitator</option>
                                            <option value="pj_grup">PJ Grup</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowForgotModal(false); resetForgotForm(); }}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    disabled={isSubmittingForgot}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingForgot || !verifyName || !verifyUsername || !verifyRole}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#0080C5] hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmittingForgot ? 'Memverifikasi...' : 'Kirim Permintaan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;