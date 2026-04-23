import React from 'react';
import { X, Phone, MapPin, Layers, Users } from 'lucide-react';

const FacilitatorDetailModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    const initials = data?.nama?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AS';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Profile Header */}
                <div className="p-6 pb-4 border-b border-slate-50 flex items-start gap-4 text-left">
                    <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#0080C5] to-[#006da8] rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-md">
                            {initials}
                        </div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 mt-1">
                        <h3 className="text-slate-950 text-base font-bold leading-tight">{data?.nama || "Anindhia Salsabila"}</h3>
                        <p className="text-slate-400 text-xs mt-1">@{data?.username || "anindhia.salsa"}</p>
                        <div className="mt-2 inline-flex px-2.5 py-0.5 bg-sky-600/10 rounded-full">
                            <span className="text-sky-600 text-[10px] font-bold">Fasilitator</span>
                        </div>
                    </div>
                </div>

                {/* Info List */}
                <div className="p-2">
                    <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-4 group">
                        <div className="w-9 h-9 bg-sky-600/5 rounded-[10px] flex items-center justify-center text-sky-600">
                            <Phone size={16} />
                        </div>
                        <div className="flex-1 flex justify-between items-center text-left">
                            <span className="text-slate-950 text-sm font-bold">Nomor Telepon</span>
                            <span className="text-[#00A3A3] text-sm font-medium">085239881565</span>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-4">
                        <div className="w-9 h-9 bg-sky-600/5 rounded-[10px] flex items-center justify-center text-sky-600">
                            <MapPin size={16} />
                        </div>
                        <div className="flex-1 flex justify-between items-center text-left text-left">
                            <span className="text-slate-950 text-sm font-bold">Alamat</span>
                            <span className="text-slate-500 text-sm font-normal">Jebres, Surakarta</span>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-4">
                        <div className="w-9 h-9 bg-sky-600/5 rounded-[10px] flex items-center justify-center text-sky-600 text-left">
                            <Layers size={16} />
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                            <span className="text-slate-950 text-sm font-bold">Bidang Dampingan</span>
                            <div className="flex gap-2 text-left">
                                <span className="px-3 py-1 bg-sky-600/10 rounded-full text-sky-600 text-[10px] font-bold">Perekonomian</span>
                                <span className="px-3 py-1 bg-sky-600/10 rounded-full text-sky-600 text-[10px] font-bold">Buruh</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 flex items-center gap-4">
                        <div className="w-9 h-9 bg-sky-600/5 rounded-[10px] flex items-center justify-center text-sky-600 text-left">
                            <Users size={16} />
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                            <span className="text-slate-950 text-sm font-bold text-left">Grup Dampingan</span>
                            <div className="flex gap-2 text-left">
                                <span className="px-3 py-1 bg-[#00967D]/10 rounded-full text-[#00967D] text-[10px] font-bold text-left">Srawung Batik Laweyan</span>
                                <span className="px-3 py-1 bg-[#00967D]/10 rounded-full text-[#00967D] text-[10px] font-bold text-left">KOKAP</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-white">
                    <button onClick={onClose} className="px-6 py-2 bg-red-500 text-white rounded-[10px] text-sm font-semibold hover:bg-red-600 transition-all">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FacilitatorDetailModal;
