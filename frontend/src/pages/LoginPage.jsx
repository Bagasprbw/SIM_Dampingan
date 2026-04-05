import React, { useState } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login, loading } = useLogin(); // memanggil custom hook useLogin

    const handleSubmit = (e) => {
        e.preventDefault();
        login({ username, password });
    };

    return (
        <div className="flex h-screen bg-white font-sans">
            {/* ── Left: Login Form ── */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center px-10 md:px-20">
                <div className="max-w-md w-full mx-auto text-center">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-[#1e3a5f] rounded-full flex items-center justify-center overflow-hidden shadow-lg border-4 border-blue-100">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/id/0/07/Logo_Muhammadiyah.svg"
                                alt="Logo MPM Mentora"
                                className="w-14 h-14 object-contain filter brightness-0 invert"
                            />
                        </div>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-widest text-gray-800 mb-3">
                        LOGIN
                    </h1>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        Selamat Datang di Website Resmi MPM ‑ Mentora
                        <br />
                        Masukkan Username dan Password Anda !
                    </p>

                    <form onSubmit={handleSubmit} className="text-left space-y-5">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    id="input-username"
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all pr-12 bg-gray-50 hover:border-gray-300"
                                    required
                                />
                                <Mail
                                    size={18}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="input-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all pr-12 bg-gray-50 hover:border-gray-300"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="text-gray-600">Ingat Saya</span>
                            </label>
                            <a
                                href="#"
                                className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                            >
                                Lupa Password
                            </a>
                        </div>

                        {/* Submit */}
                        <button
                            id="btn-login"
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-[#337ab7] hover:bg-[#2d6aa0] active:bg-[#1e3a5f] text-white font-bold py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-2 uppercase tracking-widest"
                        >
                            {loading && (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            )}
                            {loading ? 'Masuk...' : 'LOGIN'}
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Right: Visual Panel ── */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#aab8c2] items-center justify-center">
                {/* Background image */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url('/src/assets/login-bg/bg.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.8,
                    }}
                />
                {/* Fallback gradient if image not found */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/70 via-[#2d6aa0]/50 to-[#aab8c2]/60" />

                {/* Geometric accents */}
                <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white/20 rounded-2xl rotate-12" />
                <div className="absolute bottom-16 left-8 w-20 h-20 border-4 border-white/20 rounded-full" />
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-4 h-48 bg-white/10 rounded-r-full" />

                {/* Text overlay */}
                <div className="relative z-10 text-center px-8 drop-shadow-2xl">
                    <p className="text-2xl italic font-semibold text-white mb-1">
                        Sistem Informasi
                    </p>
                    <h1 className="text-8xl font-black text-white tracking-tight leading-none mb-3">
                        MENTORA
                    </h1>
                    <p className="text-lg font-semibold text-white/90 tracking-wider">
                        Majelis Pemberdayaan Masyarakat
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
