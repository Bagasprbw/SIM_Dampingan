import React from 'react';
import { X, Phone, MapPin, User, Users } from 'lucide-react';

const PjDetailModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    const initials = data?.nama?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AS';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4 text-left">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-[500px] bg-white rounded-2xl shadow-[0px_20px_60px_0px_rgba(0,0,0,0.18)] overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="w-full h-[5px] bg-white" />
                
                {/* Profile Header */}
                <div className="p-6 border-b-[0.80px] border-slate-100 flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-sky-700 to-sky-500 rounded-full flex justify-center items-center text-white text-xl font-bold">
                            {initials}
                        </div>
                        <div className="w-3.5 h-3.5 absolute bottom-0 right-0 bg-green-500 rounded-full border-[2.40px] border-white" />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-0.5 text-left">
                        <h3 className="text-slate-950 text-base font-bold leading-6">{data?.nama || "Anindhia Salsabila"}</h3>
                        <p className="text-slate-400 text-xs font-normal leading-5">@{data?.username || "anindhia.salsa"}</p>
                        <div className="mt-2 px-2.5 py-0.5 bg-sky-600/10 rounded-full flex justify-start items-center">
                            <span className="text-sky-600 text-xs font-semibold leading-4">PJ Dampingan</span>
                        </div>
                    </div>
                </div>

                {/* Info Rows */}
                <div className="flex flex-col">
                    <div className="px-6 py-4 border-b-[0.80px] border-slate-100 flex items-center gap-4">
                        <div className="w-9 h-9 bg-sky-600/5 rounded-[10px] flex justify-center items-center">
                            <Phone size={16} className="text-sky-600" />
                        </div>
                        <div className="flex-1 flex justify-between items-center text-left">
                            <span className="text-slate-950 text-sm font-bold leading-5">Nomor Telepon</span>
                            <span className="text-[#00A3A3] text-sm font-medium leading-5">085239881565</span>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-b-[0.80px] border-slate-100 flex items-center gap-4 text-left text-left">
                        <div className="w-9 h-9 bg-sky-600/5 rounded-[10px] flex justify-center items-center">
                            <MapPin size={16} className="text-sky-600" />
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                            <span className="text-slate-950 text-sm font-bold leading-5 text-left">Alamat</span>
                            <span className="text-gray-600 text-sm font-normal leading-5 text-left">Jebres, Surakarta</span>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-b-[0.80px] border-slate-100 flex items-center gap-4 text-left text-left">
                        <div className="w-9 h-9 bg-sky-600/5 rounded-[10px] flex justify-center items-center">
                            <User size={16} className="text-sky-600" />
                        </div>
                        <div className="flex-1 flex justify-between items-center text-left text-left">
                            <span className="text-slate-950 text-sm font-bold leading-5 text-left">Fasilitator</span>
                            <span className="text-slate-950 text-sm font-medium leading-5 text-left">Budi Santoso</span>
                        </div>
                    </div>

                    <div className="px-6 py-4 flex items-center gap-4 text-left text-left">
                        <div className="w-9 h-9 bg-sky-600/5 rounded-[10px] flex justify-center items-center">
                            <Users size={16} className="text-sky-600" />
                        </div>
                        <div className="flex-1 flex justify-between items-center text-left text-left">
                            <span className="text-slate-950 text-sm font-bold leading-5 text-left">Grup Dampingan</span>
                            <div className="px-2.5 py-1 bg-sky-600/10 rounded-full text-left text-left">
                                <span className="text-sky-600 text-xs font-semibold leading-4">Srawung Batik Laweyan</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t-[0.80px] border-slate-100 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-red-500 text-white rounded-[10px] text-sm font-semibold hover:bg-red-600 transition-all shadow-md shadow-red-100"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PjDetailModal;
