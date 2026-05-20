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
        <div className="h-screen w-full bg-[#f8f9fa] lg:bg-white flex flex-col lg:flex-row overflow-hidden font-['Poppins']">

            {/* ── HERO IMAGE SECTION ── */}
            <div className="relative w-full h-[40vh] min-h-[300px] lg:h-screen lg:w-[450px] xl:w-[665px] lg:order-2 shrink-0 overflow-hidden">
                <img
                    src="/images/mentora-hero.png"
                    alt="Mentora"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* ── FORM SECTION ── */}
            <div className="flex-1 flex flex-col items-center justify-start lg:justify-center relative z-10 bg-white lg:order-1 px-6 
                rounded-t-[30px] lg:rounded-none -mt-8 lg:mt-0 pt-6 lg:pt-0 pb-10 overflow-y-auto w-full shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:shadow-none">
                
                <div className="w-full max-w-[420px] flex flex-col min-h-full">
                    
                    {/* Mobile drag indicator */}
                    <div className="w-full flex justify-center mb-8 lg:hidden">
                        <div className="w-[40px] h-[5px] bg-gray-300 rounded-full"></div>
                    </div>

                    {/* Header Section */}
                    <div className="flex flex-col items-center gap-3 mb-8">
                        <h1 className="text-[#1E1E1E] text-[24px] md:text-[30px] font-bold leading-normal tracking-wide">LOGIN</h1>
                        <p className="text-[#636364] text-[13px] md:text-[14px] font-normal text-center tracking-[0.42px] leading-relaxed max-w-[300px] md:max-w-none">
                            Selamat Datang di Website Resmi MPM - Mentora<br className="hidden md:block" />
                            <span className="md:hidden"> </span>Masukkan Username dan Password Anda !
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">

                        {/* Username */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#1E1E1E] text-[14px] md:text-[15px] font-semibold md:font-medium tracking-[0.45px]">Username</label>
                            <div className="relative h-[50px] md:h-[54px]">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full h-full border border-black/25 rounded-[10px] px-[18px] text-[15px] md:text-[16px] font-medium tracking-[0.48px] outline-none focus:border-[#0080C5] placeholder:text-[#C5C6C7] transition-all bg-white"
                                    required
                                />
                                <div className="absolute right-[17px] top-1/2 -translate-y-1/2 text-[#C5C6C7]">
                                    <Mail size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#1E1E1E] text-[14px] md:text-[15px] font-semibold md:font-medium tracking-[0.45px]">Password</label>
                            <div className="relative h-[50px] md:h-[54px]">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-full border border-black/25 rounded-[10px] px-[18px] text-[15px] md:text-[16px] font-medium tracking-[0.48px] outline-none focus:border-[#0080C5] placeholder:text-[#C5C6C7] transition-all bg-white"
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
                                <div className="w-[18px] h-[18px] md:w-[19px] md:h-[21px] border-2 border-[#CFCFCF] rounded-sm md:rounded-none flex items-center justify-center relative transition-all group-hover:border-[#0080C5]">
                                    <input
                                        type="checkbox"
                                        className="hidden peer"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <div className="w-full h-full bg-[#0080C5] opacity-0 peer-checked:opacity-100 transition-all flex items-center justify-center rounded-sm md:rounded-none">
                                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                            <path d="M1 5L4.33333 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                                <span className="text-[#1E1E1E] md:text-black text-[13px] md:text-[15px] font-semibold md:font-medium tracking-[0.45px]">Ingat Saya</span>
                            </label>
                            <a href="#" className="text-[#0080C5] text-[13px] md:text-[15px] font-semibold md:font-medium tracking-[0.45px]">Lupa Password</a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-[46px] md:h-[48px] w-full mt-4 bg-[#0080C5] text-white rounded-xl md:rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[15px] font-semibold tracking-wide"
                        >
                            {loading ? 'MOHON TUNGGU...' : 'LOGIN'}
                        </button>

                        <div className="mt-auto pt-8 flex justify-center pb-4">
                            <span className="text-[#C5C6C7] text-[11px] md:text-[12px] font-medium text-center">
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
