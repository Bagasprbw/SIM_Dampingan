import React from 'react';
import { X, AlertTriangle, Trash2, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const DeleteFacilitatorModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    const handleDelete = () => {
        Swal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: 'Data fasilitator telah dihapus permanen.',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
                popup: 'rounded-2xl font-["Poppins"]',
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-[460px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h3 className="text-[#0A0F1E] text-base font-bold leading-tight">Hapus Data Fasilitator</h3>
                            <p className="text-slate-400 text-[10px] font-normal mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                        <X size={16} strokeWidth={3} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Summary Box */}
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100 space-y-3 text-left">
                        <p className="text-gray-700 text-[11px] font-normal leading-relaxed">
                            Apakah Anda yakin ingin menghapus data fasilitator berikut?
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-start text-xs">
                                <span className="w-20 text-gray-500 font-semibold">Nama</span>
                                <span className="mx-2 text-gray-500">:</span>
                                <span className="flex-1 text-slate-950 font-bold">{data?.nama || "Ahmad Fauzi"}</span>
                            </div>
                            <div className="flex items-start text-xs">
                                <span className="w-20 text-gray-500 font-semibold">Username</span>
                                <span className="mx-2 text-gray-500">:</span>
                                <span className="flex-1 text-slate-950 font-bold">{data?.username || "ahmad.fauzi"}</span>
                            </div>
                            <div className="flex items-start text-xs">
                                <span className="w-20 text-gray-500 font-semibold">Role</span>
                                <span className="mx-2 text-gray-500">:</span>
                                <span className="flex-1 text-slate-950 font-bold">Fasilitator</span>
                            </div>
                        </div>
                    </div>

                    {/* Warning Note */}
                    <div className="flex gap-2.5 p-1">
                        <div className="mt-0.5 text-amber-500 shrink-0">
                            <AlertCircle size={16} />
                        </div>
                        <p className="text-amber-800 text-[10px] font-normal leading-relaxed text-left">
                            Seluruh data yang berkaitan dengan fasilitator ini akan ikut terhapus secara permanen dari sistem.
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button onClick={onClose} className="px-6 py-2 bg-white rounded-[10px] border border-gray-200 text-slate-400 text-xs font-semibold hover:bg-gray-50 h-10 transition-all">
                            Batal
                        </button>
                        <button onClick={handleDelete} className="px-6 py-2 bg-red-500 text-white rounded-[10px] text-xs font-semibold hover:bg-red-600 h-10 flex items-center gap-2 transition-all">
                            <Trash2 size={14} />
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteFacilitatorModal;
