import React, { useState } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import AuthModal from '../../components/modals/AuthModal';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, type: 'success' });

    const { login, commitLogin, loading } = useLogin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login({ username, password });
            if (user) {
                setModal({ isOpen: true, type: 'success' });
                setTimeout(() => {
                    commitLogin();
                    navigate('/dashboard');
                }, 3000);
            }
        } catch (error) {
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
                    src="/images/mentora-hero.png"
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
                            <a href="#" className="text-[#0080C5] text-[13px] lg:text-[15px] font-semibold lg:font-medium tracking-[0.45px]">
                                Lupa Password
                            </a>
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
        </div>
    );
};

export default LoginPage;