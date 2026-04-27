import React from 'react';
import { 
    X, 
    User,
    CheckCircle2
} from 'lucide-react';

const DetailDampinganModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    // Helper untuk baris detail
    const DetailRow = ({ label, value, isLast = false, valueColor = "text-slate-950", isStatus = false }) => (
        <div className={`flex border-b border-gray-200 last:border-0 h-12 items-stretch ${isLast ? 'border-b-0' : ''}`}>
            <div className="w-[210px] bg-neutral-50 border-r border-gray-200 px-5 flex items-center shrink-0">
                <span className="text-gray-700 text-xs font-semibold">{label}</span>
            </div>
            <div className="flex-1 px-5 flex items-center overflow-hidden">
                <span className={`text-xs font-normal truncate ${isStatus ? 'text-green-500 font-semibold' : valueColor}`}>
                    {value || '-'}
                </span>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center font-['Poppins'] p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[580px] bg-white rounded-2xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
                
                {/* Header Profile Section */}
                <div className="h-28 px-6 pt-6 pb-5 border-b border-gray-200 flex items-center justify-between bg-white relative">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 bg-blue-100 rounded-full border-2 border-sky-600 flex items-center justify-center text-sky-600 overflow-hidden shrink-0">
                            <User size={32} />
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <h3 className="text-neutral-950 text-xl font-bold leading-tight">
                                {data?.nama || "Siti Rahayu"}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 bg-[#0080C5]/10 rounded-full text-[#0080C5] text-[10px] font-bold">
                                    Anggota
                                </span>
                                <span className="text-slate-400 text-xs font-normal tracking-tight">
                                    340406030002
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 p-2 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors absolute top-6 right-6"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Info Table Container */}
                <div className="px-6 py-6 overflow-y-auto max-h-[500px] custom-scrollbar">
                    <div className="rounded-xl border border-gray-200 overflow-hidden flex flex-col bg-white">
                        <DetailRow label="Tempat, Tanggal Lahir" value="Bandung, 15-06-1995" />
                        <DetailRow label="Jenis Kelamin" value={data?.gender || "Perempuan"} />
                        <DetailRow label="Agama" value="Islam" />
                        <DetailRow label="Pekerjaan Utama" value="Petani" />
                        <DetailRow label="No. Telepon" value="082345678901" valueColor="text-sky-600" />
                        <DetailRow label="Alamat" value="Jl. Cihampelas No. 88, Bandung" />
                        <DetailRow label="Status" value="Aktif" isStatus={true} />
                        <DetailRow label="Bidang Dampingan" value={data?.bidang || "Perekonomian"} />
                        <DetailRow label="Grup Dampingan" value={data?.grup || "Grup Dampingan Sejahtera"} />
                        <DetailRow label="Peran" value="Anggota" isLast={true} />
                    </div>
                </div>

                {/* Footer */}
                <div className="h-20 px-6 py-4 border-t border-gray-200 flex items-center justify-end bg-white">
                    <button 
                        onClick={onClose}
                        className="px-8 h-10 bg-[#EF4444] text-white rounded-[10px] text-sm font-semibold hover:bg-red-600 transition-all shadow-sm"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailDampinganModal;
