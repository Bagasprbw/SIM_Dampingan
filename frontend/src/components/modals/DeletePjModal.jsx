import React from 'react';
import { X, Trash2, AlertCircle, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';

const DeletePjModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    const handleDelete = () => {
        // Simulasi hapus data
        Swal.fire({
            title: 'Terhapus!',
            text: 'Data PJ Dampingan telah dihapus secara permanen.',
            icon: 'success',
            confirmButtonColor: '#EF4444',
            timer: 1500,
            showConfirmButton: false
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-[460px] bg-white rounded-2xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="h-20 px-6 py-5 border-b-[0.80px] border-gray-200 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500/10 rounded-full flex justify-center items-center">
                            <AlertTriangle size={20} className="text-red-500" />
                        </div>
                        <div className="flex flex-col justify-start items-start text-left">
                            <h3 className="text-neutral-950 text-base font-bold leading-tight">Hapus Data PJ Dampingan</h3>
                            <p className="text-slate-400 text-xs font-normal leading-4">Tindakan ini tidak dapat dibatalkan</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 p-2 bg-slate-100 rounded-lg flex justify-center items-center hover:bg-slate-200 transition-colors">
                        <X size={16} className="text-slate-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col gap-5 text-left">
                    {/* Data Display Box */}
                    <div className="w-full p-4 bg-red-50 rounded-xl border-[0.80px] border-red-200 flex flex-col gap-3 text-left">
                        <p className="text-gray-700 text-xs font-normal leading-5">
                            Apakah Anda yakin ingin menghapus data pj dampingan berikut?
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                                <span className="w-24 text-gray-500 text-xs font-semibold leading-5">Nama</span>
                                <span className="text-gray-500 text-xs font-normal leading-5">:</span>
                                <span className="flex-1 text-slate-950 text-xs font-semibold leading-5">{data?.nama || "Anindhia Salsabila"}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="w-24 text-gray-500 text-xs font-semibold leading-5">Username</span>
                                <span className="text-gray-500 text-xs font-normal leading-5">:</span>
                                <span className="flex-1 text-slate-950 text-xs font-semibold leading-5">{data?.username || "anindhia.salsa"}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="w-24 text-gray-500 text-xs font-semibold leading-5">Role</span>
                                <span className="text-gray-500 text-xs font-normal leading-5">:</span>
                                <span className="flex-1 text-slate-950 text-xs font-semibold leading-5">PJ Dampingan</span>
                            </div>
                        </div>
                    </div>

                    {/* Warning Text */}
                    <div className="flex items-start gap-3">
                        <div className="w-4 h-4 mt-0.5 flex-shrink-0">
                            <AlertCircle size={16} className="text-amber-500" />
                        </div>
                        <p className="text-amber-800 text-[11px] leading-5 font-normal">
                            Seluruh data yang berkaitan dengan pj dampingan ini akan ikut terhapus secara permanen dari sistem.
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 border-t-[0.80px] border-gray-200 flex justify-end items-center gap-3">
                        <button onClick={onClose} className="w-20 h-10 bg-white rounded-[10px] border-[0.80px] border-gray-200 text-slate-400 text-xs font-semibold hover:bg-slate-50 transition-all">
                            Batal
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="h-10 px-6 bg-[#EF4444] text-white rounded-[10px] flex items-center gap-2 hover:bg-red-600 transition-all group"
                        >
                            <Trash2 size={14} className="text-white" />
                            <span className="text-xs font-semibold">Ya, Hapus</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeletePjModal;
