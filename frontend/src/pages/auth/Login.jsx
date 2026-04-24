import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Mail } from 'lucide-react';
import Swal from 'sweetalert2';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });

    const handleLogin = (e) => {
        e.preventDefault();
        
        // Simulasi Login Berhasil sesuai desain Frame 407
        Swal.fire({
            title: 'Login Berhasil!',
            text: 'Selamat datang kembali!',
            icon: 'success',
            confirmButtonText: 'Oke',
            confirmButtonColor: '#0085CA',
            customClass: {
                popup: 'rounded-[20px]',
                title: 'text-2xl font-bold',
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 md:p-0">
            <div className="bg-white rounded-[30px] overflow-hidden shadow-2xl flex flex-col md:flex-row w-full max-w-[1200px] min-h-[700px]">
                
                {/* Left Side: Form */}
                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                    <div className="text-center mb-10">
                        {/* Logo Placeholder - You can replace src with your actual logo path */}
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-[#0085CA] rounded-full flex items-center justify-center text-white font-bold text-xl">
                                MPM
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2 uppercase tracking-wider">Login</h1>
                        <p className="text-gray-500 text-sm max-w-[300px] mx-auto">
                            Selamat Datang di Website Resmi MPM - Mentora Masukkan Username dan Password Anda!
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 outline-none focus:border-[#0085CA] focus:ring-1 focus:ring-[#0085CA] transition-all group-hover:border-gray-400"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 outline-none focus:border-[#0085CA] focus:ring-1 focus:ring-[#0085CA] transition-all group-hover:border-gray-400"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-gray-300 text-[#0085CA] focus:ring-[#0085CA]"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors font-medium">Ingat Saya</span>
                            </label>
                            <a href="#" className="text-sm text-[#0085CA] hover:underline font-semibold">Lupa Password</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#0085CA] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-[#0074b0] hover:scale-[1.01] transition-all active:scale-[0.98]"
                        >
                            LOGIN
                        </button>
                    </form>
                </div>

                {/* Right Side: Hero Image */}
                <div className="hidden md:block w-1/2 relative bg-[#0085CA]">
                    <img 
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                        alt="Mentora Hero" 
                        className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#004a70]/80 to-transparent flex flex-col justify-center items-center text-white p-12 text-center">
                        <div className="backdrop-blur-sm bg-white/10 p-10 rounded-[40px] border border-white/20 shadow-2xl transform rotate-[-2deg]">
                            <h2 className="text-4xl font-black mb-1 italic tracking-tighter">Sistem Informasi</h2>
                            <h1 className="text-7xl font-black mb-6 tracking-tighter text-[#60A5FA]">MENTORA</h1>
                            <div className="w-20 h-1 bg-white mb-6"></div>
                            <p className="text-xl font-medium tracking-wide">Majelis Pemberdayaan Masyarakat</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
