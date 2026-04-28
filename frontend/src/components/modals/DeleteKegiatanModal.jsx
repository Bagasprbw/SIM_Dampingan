import React from 'react';
import { AlertCircle, Trash2, X, AlertTriangle } from 'lucide-react';

const DeleteKegiatanModal = ({ isOpen, onClose, onConfirm, data }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-['Poppins']">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="px-6 pt-8 pb-6 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-[#0A0F1E] tracking-tight">Hapus Kegiatan</h2>
                            <p className="text-[#9298B0] text-xs font-medium">Tindakan ini tidak dapat dibatalkan</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    <p className="text-gray-600 text-[13px] font-medium text-left">
                        Apakah Anda yakin ingin menghapus kegiatan berikut?
                    </p>

                    {/* Activity Info Box */}
                    <div className="bg-[#FFF5F5] border border-[#FECACA] rounded-2xl p-5 text-left">
                        <div className="grid grid-cols-[130px_10px_1fr] gap-y-3 text-[13px]">
                            <span className="text-[#9298B0] font-medium">Judul Kegiatan</span>
                            <span className="text-[#9298B0]">:</span>
                            <span className="text-[#0A0F1E] font-bold">{data?.judul || 'Pelatihan Pengolahan Hasil Tani'}</span>

                            <span className="text-[#9298B0] font-medium">Bidang</span>
                            <span className="text-[#9298B0]">:</span>
                            <span className="text-[#0A0F1E] font-bold">{data?.kategori || 'Pertanian'}</span>

                            <span className="text-[#9298B0] font-medium">Tanggal</span>
                            <span className="text-[#9298B0]">:</span>
                            <span className="text-[#0A0F1E] font-bold">{data?.tanggal || '10 Apr 2026'}</span>

                            <span className="text-[#9298B0] font-medium">Waktu</span>
                            <span className="text-[#9298B0]">:</span>
                            <span className="text-[#0A0F1E] font-bold">{data?.waktu || '08:00 – 12:00'}</span>

                            <span className="text-[#9298B0] font-medium">Lokasi</span>
                            <span className="text-[#9298B0]">:</span>
                            <span className="text-[#0A0F1E] font-bold">{data?.lokasi || 'Balai Desa Maju, Kec. Margahayu'}</span>

                            <span className="text-[#9298B0] font-medium">Grup Dampingan</span>
                            <span className="text-[#9298B0]">:</span>
                            <span className="text-[#0A0F1E] font-bold">{data?.grup || 'Kelompok Tani Makmur'}</span>
                        </div>
                    </div>

                    {/* Permanent Warning */}
                    <div className="flex gap-3 text-left">
                        <AlertTriangle className="text-[#F59E0B] shrink-0" size={18} />
                        <p className="text-[#92400E] text-[11px] font-medium leading-relaxed">
                            Seluruh data yang berkaitan dengan kegiatan ini akan ikut terhapus secara permanen dari sistem.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-8 flex items-center justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="h-11 px-6 bg-white border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="h-11 px-6 bg-[#EF4444] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95"
                    >
                        <Trash2 size={16} />
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteKegiatanModal;
