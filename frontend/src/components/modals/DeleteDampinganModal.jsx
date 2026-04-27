import React from 'react';
import { 
    X, 
    AlertTriangle, 
    Trash2, 
    AlertCircle 
} from 'lucide-react';
import Swal from 'sweetalert2';

const DeleteDampinganModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    const handleDelete = () => {
        Swal.fire({
            title: 'Terhapus!',
            text: 'Data masyarakat telah berhasil dihapus.',
            icon: 'success',
            confirmButtonColor: '#EF4444',
            timer: 1500,
            showConfirmButton: false,
            customClass: {
                popup: 'rounded-2xl font-["Poppins"]',
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center font-['Poppins'] p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[460px] bg-white rounded-2xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="h-20 px-6 border-b border-gray-100 flex items-center justify-between bg-white text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h3 className="text-neutral-950 text-base font-bold leading-tight">Hapus Data Dampingan</h3>
                            <p className="text-slate-400 text-xs font-normal mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 p-2 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-5 text-left">
                    {/* Confirmation Box */}
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100 space-y-3">
                        <p className="text-slate-700 text-xs font-normal leading-5">
                            Apakah Anda yakin ingin menghapus data masyarakat berikut?
                        </p>
                        
                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <span className="w-28 text-slate-500 text-xs font-semibold leading-5">Nama</span>
                                <span className="text-slate-500 text-xs">:</span>
                                <span className="flex-1 text-slate-950 text-xs font-semibold leading-5">{data?.nama || 'Siti Rahayu'}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="w-28 text-slate-500 text-xs font-semibold leading-5">No. Telepon</span>
                                <span className="text-slate-500 text-xs">:</span>
                                <span className="flex-1 text-slate-950 text-xs font-semibold leading-5">082345678901</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="w-28 text-slate-500 text-xs font-semibold leading-5">Grup Dampingan</span>
                                <span className="text-slate-500 text-xs">:</span>
                                <span className="flex-1 text-slate-950 text-xs font-semibold leading-5">Grup Dampingan Sejahtera</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="w-28 text-slate-500 text-xs font-semibold leading-5">Peran</span>
                                <span className="text-slate-500 text-xs">:</span>
                                <span className="flex-1 text-slate-950 text-xs font-semibold leading-5">Anggota</span>
                            </div>
                        </div>
                    </div>

                    {/* Warning Note */}
                    <div className="flex gap-3">
                        <div className="mt-0.5">
                            <AlertCircle size={16} className="text-amber-500" />
                        </div>
                        <p className="text-amber-800 text-xs font-normal leading-5">
                            Seluruh data yang berkaitan dengan masyarakat ini akan ikut terhapus secara permanen dari sistem.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button 
                            onClick={onClose}
                            className="px-6 h-10 bg-white border border-gray-200 rounded-[10px] text-slate-400 text-xs font-semibold hover:bg-slate-50 transition-all"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="px-6 h-10 bg-red-500 text-white rounded-[10px] text-xs font-semibold hover:bg-red-600 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Trash2 size={14} />
                            <span>Ya, Hapus</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteDampinganModal;
