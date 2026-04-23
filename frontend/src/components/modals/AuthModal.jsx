import React from 'react';

// Komponen murni tampilan saja, tidak ada timer di sini
const AuthModal = ({ isOpen, type = 'success' }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-['Poppins']">
            <div className="w-[460px] px-12 py-12 bg-white rounded-[20px] flex flex-col justify-center items-center gap-6 shadow-2xl">

                {/* Icon */}
                <div className={`w-24 h-24 p-1.5 rounded-[48px] outline outline-1 outline-offset-[-1px] flex justify-center items-center ${
                    isSuccess
                        ? 'bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 outline-emerald-500'
                        : 'bg-gradient-to-b from-red-500/20 to-red-500/5 outline-red-500'
                }`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                        isSuccess ? 'bg-emerald-500 shadow-emerald-200' : 'bg-red-500 shadow-red-200'
                    }`}>
                        {isSuccess ? (
                            <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                                <path d="M3 12L11.5 20.5L29 3" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}
                    </div>
                </div>

                {/* Teks */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-slate-950 text-2xl font-semibold tracking-tight">
                        {isSuccess ? 'Login Berhasil!' : 'Login Gagal!'}
                    </h2>
                    <p className="text-zinc-600 text-base font-normal tracking-tight">
                        {isSuccess ? 'Selamat datang kembali!' : 'Username atau Password salah!'}
                    </p>
                </div>

                {/* User Pill */}
                <div className="px-4 py-1.5 bg-sky-600/10 rounded-full outline outline-1 outline-sky-600/20 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 7C8.933 7 10.5 5.433 10.5 3.5C10.5 1.567 8.933 0 7 0C5.067 0 3.5 1.567 3.5 3.5C3.5 5.433 5.067 7 7 7ZM7 8.16667C4.66667 8.16667 0 9.33333 0 11.6667V14H14V11.6667C14 9.33333 9.33333 8.16667 7 8.16667Z" fill="#0284C7"/>
                    </svg>
                    <span className="text-sky-600 text-xs font-medium tracking-tight">User</span>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
