import React from 'react';
import { 
    X, 
    Calendar, 
    MapPin, 
    Clock, 
    FileText, 
    Download,
    Users,
    UserCheck,
    CheckCircle2
} from 'lucide-react';

const DetailKegiatanModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-['Poppins']">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                
                {/* Header Section (Blue Gradient) */}
                <div className="bg-gradient-to-r from-[#0080C5] to-[#0099E6] px-6 py-5 relative">
                    <button 
                        onClick={onClose}
                        className="absolute right-6 top-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex items-center gap-5 mb-4">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-tight">Laporan Kegiatan</h2>
                            <p className="text-white/70 text-sm font-medium">Detail lengkap laporan kegiatan dampingan</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl flex items-center gap-2 text-white text-xs font-bold">
                            <Calendar size={14} />
                            <span>15 November 2024</span>
                        </div>
                        <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl flex items-center gap-2 text-white text-xs font-bold">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            <span>Pertanian Terpadu</span>
                        </div>
                        <div className="px-4 py-2 bg-[#22C55E]/30 backdrop-blur-md rounded-xl flex items-center gap-2 text-[#86EFAC] text-xs font-bold border border-[#86EFAC]/20">
                            <CheckCircle2 size={14} />
                            <span>Terlaksana</span>
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-5 max-h-[65vh] overflow-y-auto text-left custom-scrollbar">
                    {/* Title and Meta */}
                    <div className="mb-10">
                        <h1 className="text-lg font-bold text-[#0A0F1E] mb-4 leading-tight">
                            {data?.judul || "Pelatihan Wirausaha Mandiri Bagi Komunitas Difabel Sleman"}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-[#9298B0]">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <MapPin size={18} className="text-[#0080C5]" />
                                <span>Balai Desa Mlati, Sleman, Yogyakarta</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium border-l border-gray-200 pl-6">
                                <Clock size={18} className="text-[#0080C5]" />
                                <span>08.00 – 12.00 WIB</span>
                            </div>
                        </div>
                    </div>

                    {/* Roles Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                        <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-100 flex flex-col gap-2">
                            <span className="text-[#9298B0] text-[10px] font-bold uppercase tracking-widest">GRUP DAMPINGAN</span>
                            <span className="text-[#0A0F1E] text-sm font-bold">Grup Dampingan Sejahtera</span>
                        </div>
                        <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-100 flex flex-col gap-2">
                            <span className="text-[#9298B0] text-[10px] font-bold uppercase tracking-widest">FASILITATOR</span>
                            <span className="text-[#0A0F1E] text-sm font-bold">Ahmad Rifa'i, S.Pd</span>
                        </div>
                        <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-100 flex flex-col gap-2">
                            <span className="text-[#9298B0] text-[10px] font-bold uppercase tracking-widest">PJ DAMPINGAN</span>
                            <span className="text-[#0A0F1E] text-sm font-bold">Budi Santoso</span>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="mb-10 py-4 border-y border-gray-100">
                        <h4 className="text-sm font-bold text-[#0A0F1E] mb-4">Deskripsi Kegiatan</h4>
                        <p className="text-[#374151] text-sm leading-relaxed font-medium">
                            Kegiatan pelatihan wirausaha mandiri ini bertujuan untuk meningkatkan kemampuan dan kemandirian ekonomi anggota komunitas difabel di wilayah Sleman. Peserta mendapatkan materi tentang pengembangan usaha kecil, manajemen keuangan sederhana, serta strategi pemasaran produk secara digital maupun konvensional.
                        </p>
                    </div>

                    {/* Documentation Section */}
                    <div>
                        <div className="flex justify-between items-center mb-5">
                            <h4 className="text-sm font-bold text-[#0A0F1E]">Dokumentasi Kegiatan</h4>
                            <span className="text-[#0080C5] text-[11px] font-bold">2 foto</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="h-56 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                <img 
                                    src="https://placehold.co/600x400/F0F2F8/9298B0?text=Dokumentasi+1" 
                                    className="w-full h-full object-cover" 
                                    alt="Dokumentasi 1"
                                />
                            </div>
                            <div className="h-56 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                <img 
                                    src="https://placehold.co/600x400/F0F2F8/9298B0?text=Dokumentasi+2" 
                                    className="w-full h-full object-cover" 
                                    alt="Dokumentasi 2"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="px-6 py-4 bg-[#F8FAFC] flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-100">
                    <span className="text-[#9298B0] text-[11px] font-medium italic">
                        Dibuat pada: 15 November 2024 · 13:24 WIB
                    </span>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none h-11 px-6 bg-white border border-gray-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                            <Download size={16} />
                            Unduh PDF
                        </button>
                        <button 
                            onClick={onClose}
                            className="flex-1 md:flex-none h-11 px-6 bg-[#0080C5] text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-600/20 hover:bg-sky-700 transition-all"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailKegiatanModal;
