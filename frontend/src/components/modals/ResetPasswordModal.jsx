import React from 'react';
import { X, Key, Lock } from 'lucide-react';
import Swal from 'sweetalert2';

const ResetPasswordModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    const handleReset = () => {
        Swal.fire({
            icon: 'success',
            title: 'Berhasil direset!',
            text: 'Password admin telah dikembalikan ke default: 12345678',
            showConfirmButton: true,
            confirmButtonColor: '#FBBF24',
            customClass: {
                popup: 'rounded-2xl font-["Poppins"]',
                confirmButton: 'rounded-xl px-6 py-2.5 text-sm font-semibold'
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[460px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-500">
                            <Key size={20} />
                        </div>
                        <div>
                            <h3 className="text-[#0A0F1E] text-base font-bold leading-tight">Reset Password Admin</h3>
                            <p className="text-slate-400 text-[10px] font-normal mt-0.5">Password akan direset ke default</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                        <X size={16} strokeWidth={3} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Summary Box */}
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-3">
                        <p className="text-gray-700 text-[11px] font-normal leading-relaxed">
                            Apakah Anda yakin ingin mereset password admin berikut?
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-start text-xs">
                                <span className="w-20 text-gray-500 font-semibold">Nama</span>
                                <span className="mx-2 text-gray-500">:</span>
                                <span className="flex-1 text-[#0A0F1E] font-bold">{data?.nama || "Jawa Barat"}</span>
                            </div>
                            <div className="flex items-start text-xs">
                                <span className="w-20 text-gray-500 font-semibold">Username</span>
                                <span className="mx-2 text-gray-500">:</span>
                                <span className="flex-1 text-[#0A0F1E] font-bold">{data?.username || "prov.jawabarat"}</span>
                            </div>
                            <div className="flex items-start text-xs">
                                <span className="w-20 text-gray-500 font-semibold">Role</span>
                                <span className="mx-2 text-gray-500">:</span>
                                <span className="flex-1 text-[#0A0F1E] font-bold">{data?.role || "Admin Provinsi"}</span>
                            </div>
                        </div>
                    </div>

                    {/* New Password Info Box */}
                    <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-[#0080C5]">
                            <Lock size={14} />
                        </div>
                        <div>
                            <p className="text-[#0A0F1E] text-xs font-semibold">Password baru</p>
                            <p className="text-slate-400 text-[10px] font-normal">
                                Password akan direset menjadi: <span className="text-[#0080C5] font-bold">12345678</span>
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button onClick={onClose} className="px-6 py-2 bg-white rounded-[10px] border border-gray-200 text-slate-400 text-xs font-semibold hover:bg-gray-50 transition-all h-10">
                            Batal
                        </button>
                        <button onClick={handleReset} className="px-6 py-2 bg-[#FBBF24] text-white rounded-[10px] text-xs font-semibold hover:bg-[#F59E0B] transition-all h-10 flex items-center gap-2">
                            <Key size={14} />
                            Ya, Reset Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordModal;
