import React from 'react';
import { X, Key, Lock } from 'lucide-react';
import Swal from 'sweetalert2';

const ResetPjPasswordModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    const handleReset = () => {
        Swal.fire({
            title: 'Berhasil!',
            text: 'Password PJ Dampingan telah direset ke default.',
            icon: 'success',
            confirmButtonColor: '#FBBF24',
            timer: 1500,
            showConfirmButton: false
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4 text-left">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-[460px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="h-20 px-6 py-5 border-b-[0.80px] border-gray-200 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-400/20 rounded-full flex justify-center items-center">
                            <Key size={20} className="text-amber-400" />
                        </div>
                        <div className="flex flex-col justify-start items-start">
                            <h3 className="text-neutral-950 text-base font-bold leading-6">Reset Password PJ Dampingan</h3>
                            <p className="text-slate-400 text-xs font-normal leading-4">Password akan direset ke default</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 p-2 bg-slate-100 rounded-lg flex justify-center items-center hover:bg-slate-200 transition-colors">
                        <X size={16} className="text-slate-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col gap-5">
                    {/* Info Box */}
                    <div className="w-full p-4 bg-amber-50 rounded-xl border-[0.80px] border-amber-200 flex flex-col gap-3">
                        <p className="text-gray-700 text-xs font-normal leading-5">
                            Apakah Anda yakin ingin mereset password pj dampingan berikut?
                        </p>
                        <div className="flex flex-col gap-2 text-left">
                            <div className="flex items-start gap-2 text-left">
                                <span className="w-24 text-gray-500 text-xs font-semibold leading-5 text-left">Nama</span>
                                <span className="text-gray-500 text-xs font-normal leading-5 text-left">:</span>
                                <span className="flex-1 text-slate-950 text-xs font-semibold leading-5 text-left">{data?.nama || "Anindhia Salsabila"}</span>
                            </div>
                            <div className="flex items-start gap-2 text-left text-left">
                                <span className="w-24 text-gray-500 text-xs font-semibold leading-5 text-left">Username</span>
                                <span className="text-gray-500 text-xs font-normal leading-5 text-left text-left text-left">:</span>
                                <span className="flex-1 text-slate-950 text-xs font-semibold leading-5 text-left">{data?.username || "anindhia.salsa"}</span>
                            </div>
                            <div className="flex items-start gap-2 text-left text-left">
                                <span className="w-24 text-gray-500 text-xs font-semibold leading-5 text-left">Role</span>
                                <span className="text-gray-500 text-xs font-normal leading-5 text-left">:</span>
                                <span className="flex-1 text-slate-950 text-xs font-semibold leading-5 text-left">PJ Dampingan</span>
                            </div>
                        </div>
                    </div>

                    {/* New Password Info */}
                    <div className="w-full p-4 bg-slate-100 rounded-xl flex items-center gap-3 text-left">
                        <div className="w-8 h-8 bg-white rounded-full shadow-sm flex justify-center items-center">
                            <Lock size={14} className="text-sky-600" />
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0.5 text-left">
                            <h4 className="text-slate-950 text-xs font-semibold leading-5">Password baru</h4>
                            <p className="text-slate-400 text-[11px] font-normal leading-4">
                                Password akan direset menjadi: <span className="text-sky-600 font-bold">12345678</span>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t-[0.80px] border-gray-200 flex justify-end items-center gap-3">
                        <button onClick={onClose} className="w-20 h-10 px-6 bg-white rounded-[10px] border-[0.80px] border-gray-200 text-slate-400 text-xs font-semibold hover:bg-slate-50 transition-all">
                            Batal
                        </button>
                        <button 
                            onClick={handleReset}
                            className="h-10 px-6 bg-[#FBBF24] text-white rounded-[10px] flex items-center gap-2 hover:bg-amber-500 transition-all group"
                        >
                            <Key size={14} className="text-white" />
                            <span className="text-xs font-semibold">Ya, Reset Password</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPjPasswordModal;
