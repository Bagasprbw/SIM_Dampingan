import React, { useState } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import AuthModal from '../components/modals/AuthModal';

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
        <div className="min-h-screen w-full bg-white flex overflow-hidden font-['Poppins']">

            {/* ── SISI KIRI: FORM LOGIN ── */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 bg-white overflow-y-auto py-10 px-6">
                <div className="w-full max-w-[517px] flex flex-col my-auto">

                    {/* Header Section */}
                    <div className="flex flex-col items-center gap-[20px] md:gap-[30px] mb-[40px] md:mb-[60px]">
                        <img
                            src="/images/logo-mpm.png"
                            alt="Logo MPM"
                            className="w-[50px] md:w-[59px] h-auto object-contain"
                        />
                        <h1 className="text-[#1E1E1E] text-[28px] md:text-[36px] font-semibold leading-normal">LOGIN</h1>
                        <p className="text-[#636364] text-[16px] md:text-[20px] font-normal text-center tracking-[0.60px] leading-relaxed">
                            Selamat Datang di Website Resmi MPM - Mentora<br/>
                            Masukkan Username dan Password Anda !
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] md:gap-[30px]">

                        {/* Username */}
                        <div className="flex flex-col gap-[12px] md:gap-[18px]">
                            <label className="text-[#1E1E1E] text-[16px] md:text-[18px] font-medium tracking-[0.54px]">Username</label>
                            <div className="relative h-[55px] md:h-[66.29px]">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full h-full border border-black/25 rounded-[10px] px-[18px] text-[18px] md:text-[20px] font-medium tracking-[0.60px] outline-none focus:border-[#0080C5] placeholder:text-[#C5C6C7] transition-all"
                                    required
                                />
                                <div className="absolute right-[17px] top-1/2 -translate-y-1/2 text-[#C5C6C7]">
                                    <Mail size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-[12px] md:gap-[18px]">
                            <label className="text-[#1E1E1E] text-[16px] md:text-[18px] font-medium tracking-[0.54px]">Password</label>
                            <div className="relative h-[55px] md:h-[66.29px]">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-full border border-black/25 rounded-[10px] px-[18px] text-[18px] md:text-[20px] font-medium tracking-[0.60px] outline-none focus:border-[#0080C5] placeholder:text-[#C5C6C7] transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-[17px] top-1/2 -translate-y-1/2 text-[#C5C6C7] hover:text-[#0080C5] transition-colors"
                                >
                                    {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Lupa Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-[7px] cursor-pointer group">
                                <div className="w-[19px] h-[21px] border-2 border-[#CFCFCF] flex items-center justify-center relative transition-all group-hover:border-[#0080C5]">
                                    <input
                                        type="checkbox"
                                        className="hidden peer"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <div className="w-full h-full bg-[#0080C5] opacity-0 peer-checked:opacity-100 transition-all flex items-center justify-center">
                                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                            <path d="M1 5L4.33333 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                                <span className="text-black text-[14px] md:text-[15px] font-medium tracking-[0.45px]">Ingat Saya</span>
                            </label>
                            <a href="#" className="text-[#0080C5] text-[14px] md:text-[15px] font-medium tracking-[0.45px]">Lupa Password</a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[55px] md:h-[66.29px] bg-[#0080C5] rounded-[10px] flex items-center justify-center text-white text-[18px] md:text-[20px] font-medium tracking-[0.60px] shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 mt-[10px] md:mt-[20px]"
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
                    style={{ boxShadow: '0px 4px 16.6px black, 0px 4px 9.2px rgba(0, 0, 0, 0.25) inset' }}
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
