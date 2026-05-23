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
                // Tampilkan modal sukses
                setModal({ isOpen: true, type: 'success' });

                // Setelah 3 detik: simpan token → redirect ke dashboard
                setTimeout(() => {
                    commitLogin();
                    navigate('/dashboard');
                }, 3000);
            }
        } catch (error) {
            // Tampilkan modal gagal
            setModal({ isOpen: true, type: 'error' });

            // Setelah 5 detik: tutup modal, user bisa coba lagi
            setTimeout(() => {
                setModal({ isOpen: false, type: 'error' });
            }, 5000);
        }
    };

    return (
        <div className="h-screen w-full bg-white flex overflow-hidden font-['Poppins']">

            {/* ── SISI KIRI: FORM LOGIN ── */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 bg-white lg:bg-slate-50 px-6 overflow-hidden">
                <div className="w-full max-w-[420px] lg:max-w-[460px] flex flex-col lg:bg-white lg:p-10 lg:rounded-[32px] lg:shadow-xl lg:shadow-slate-200/50 lg:border lg:border-slate-100 transition-all duration-300">

                    {/* Header Section */}
                    <div className="flex flex-col items-center gap-3 mb-8 lg:mb-10">
                        <img
                            src="/images/logo-mpm.png"
                            alt="Logo MPM"
                            className="w-[48px] lg:w-[56px] h-auto object-contain lg:mb-2"
                        />
                        <h1 className="text-[#1E1E1E] text-[30px] lg:text-[32px] font-semibold lg:font-bold leading-normal tracking-wide">LOGIN</h1>
                        <p className="text-[#636364] text-[14px] font-normal text-center tracking-[0.42px] leading-relaxed">
                            Selamat Datang di Website Resmi MPM - Mentora<br/>
                            Masukkan Username dan Password Anda !
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Username */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#1E1E1E] text-[15px] lg:text-[14px] font-medium lg:font-bold tracking-[0.45px] lg:tracking-normal">Username</label>
                            <div className="relative h-[54px] lg:h-[50px]">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full h-full border border-black/25 lg:border-slate-200 lg:hover:border-slate-300 rounded-[10px] lg:rounded-[12px] px-[18px] lg:px-4 text-[16px] lg:text-[14px] font-medium tracking-[0.48px] lg:tracking-normal outline-none focus:border-[#0080C5] lg:focus:ring-4 lg:focus:ring-[#0080C5]/10 placeholder:text-[#C5C6C7] lg:placeholder:text-slate-400 transition-all lg:bg-slate-50 lg:focus:bg-white"
                                    required
                                />
                                <div className="absolute right-[17px] lg:right-4 top-1/2 -translate-y-1/2 text-[#C5C6C7] lg:text-slate-400">
                                    <Mail size={20} className="lg:w-[18px] lg:h-[18px]" />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#1E1E1E] text-[15px] lg:text-[14px] font-medium lg:font-bold tracking-[0.45px] lg:tracking-normal">Password</label>
                            <div className="relative h-[54px] lg:h-[50px]">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-full border border-black/25 lg:border-slate-200 lg:hover:border-slate-300 rounded-[10px] lg:rounded-[12px] px-[18px] lg:px-4 text-[16px] lg:text-[14px] font-medium tracking-[0.48px] lg:tracking-normal outline-none focus:border-[#0080C5] lg:focus:ring-4 lg:focus:ring-[#0080C5]/10 placeholder:text-[#C5C6C7] lg:placeholder:text-slate-400 transition-all lg:bg-slate-50 lg:focus:bg-white"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-[17px] lg:right-4 top-1/2 -translate-y-1/2 text-[#C5C6C7] lg:text-slate-400 hover:text-[#0080C5] transition-colors"
                                >
                                    {showPassword ? <Eye size={20} className="lg:w-[18px] lg:h-[18px]" /> : <EyeOff size={20} className="lg:w-[18px] lg:h-[18px]" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Lupa Password */}
                        <div className="flex items-center justify-between lg:mt-2">
                            <label className="flex items-center gap-[7px] lg:gap-2 cursor-pointer group">
                                <div className="w-[19px] h-[21px] lg:w-[18px] lg:h-[18px] border-2 border-[#CFCFCF] lg:border-slate-300 lg:rounded-md flex items-center justify-center relative transition-all group-hover:border-[#0080C5]">
                                    <input
                                        type="checkbox"
                                        className="hidden peer"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <div className="w-full h-full bg-[#0080C5] opacity-0 peer-checked:opacity-100 transition-all flex items-center justify-center lg:rounded-md">
                                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" className="lg:w-[10px] lg:h-[8px]">
                                            <path d="M1 5L4.33333 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                                <span className="text-black lg:text-slate-600 text-[14px] md:text-[15px] lg:text-[13px] font-medium lg:font-semibold tracking-[0.45px] lg:tracking-normal">Ingat Saya</span>
                            </label>
                            <a href="#" className="text-[#0080C5] text-[14px] md:text-[15px] lg:text-[13px] font-medium lg:font-semibold tracking-[0.45px] lg:tracking-normal hover:text-sky-700 transition-colors">Lupa Password</a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-9 lg:h-[48px] lg:mt-4 px-4 bg-[#0080C5] text-white rounded-lg lg:rounded-xl flex items-center justify-center gap-2 hover:bg-sky-700 lg:hover:bg-sky-600 lg:hover:shadow-lg lg:hover:shadow-[#0080C5]/30 lg:hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-sm text-[13px] lg:text-[14px] font-semibold lg:font-bold lg:tracking-wider disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                            {loading ? 'MOHON TUNGGU...' : 'LOGIN'}
                        </button>
                    </form>
                </div>
            </div>

            {/* ── SISI KANAN: HERO IMAGE ── */}
            <div className="hidden lg:block relative w-[450px] xl:w-[665px] h-screen overflow-hidden">
                <img
                    src="/images/mentora-hero.png"
                    alt="Mentora"
                    className="w-full h-full object-cover"
                />
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
