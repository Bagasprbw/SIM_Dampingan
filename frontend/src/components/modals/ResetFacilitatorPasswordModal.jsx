import React from 'react';
import { X, Key, Lock } from 'lucide-react';
import Swal from 'sweetalert2';

const ResetFacilitatorPasswordModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    const handleReset = () => {
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Password fasilitator telah direset ke 12345678',
            confirmButtonColor: '#FBBF24',
            customClass: { popup: 'rounded-2xl font-["Poppins"]' }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-[460px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-left">
                        <div className="w-10 h-10 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-500">
                            <Key size={20} />
                        </div>
                        <div>
                            <h3 className="text-[#0A0F1E] text-base font-bold leading-tight">Reset Password Fasilitator</h3>
                            <p className="text-slate-400 text-[10px] font-normal mt-0.5">Password akan direset ke default</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                        <X size={16} strokeWidth={3} />
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-3 text-left">
                        <p className="text-gray-700 text-[11px] font-normal leading-relaxed">Apakah Anda yakin ingin mereset password fasilitator berikut?</p>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center"><span className="w-20 text-gray-500 font-semibold">Nama</span><span className="mx-2">:</span><span className="text-slate-950 font-bold">{data?.nama || "Ahmad Fauzi"}</span></div>
                            <div className="flex items-center"><span className="w-20 text-gray-500 font-semibold">Username</span><span className="mx-2">:</span><span className="text-slate-950 font-bold">{data?.username || "ahmad.fauzi"}</span></div>
                            <div className="flex items-center"><span className="w-20 text-gray-500 font-semibold">Role</span><span className="mx-2">:</span><span className="text-slate-950 font-bold">Fasilitator</span></div>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-3 text-left">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-[#0080C5]"><Lock size={14} /></div>
                        <div>
                            <p className="text-slate-950 text-xs font-semibold">Password baru</p>
                            <p className="text-slate-400 text-[10px]">Password akan direset menjadi: <span className="text-sky-600 font-bold">12345678</span></p>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button onClick={onClose} className="px-6 py-2 bg-white rounded-[10px] border border-gray-200 text-slate-400 text-xs font-semibold h-10">Batal</button>
                        <button onClick={handleReset} className="px-6 py-2 bg-[#FBBF24] text-white rounded-[10px] text-xs font-semibold h-10 flex items-center gap-2 hover:bg-[#F59E0B] transition-all">
                            <Key size={14} />Ya, Reset Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetFacilitatorPasswordModal;
