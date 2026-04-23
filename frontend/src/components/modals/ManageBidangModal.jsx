import React from 'react';
import { X, Plus } from 'lucide-react';

const ManageBidangModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const bidangList = [
        'Asongan', 'Buruh', 'Daerah 3T', 'Difabel', 'Nelayan', 'Pedagang', 'Pemulung', 'Perekonomian'
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4 text-left">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="px-7 pt-6 pb-4 flex items-center justify-between">
                    <h3 className="text-slate-950 text-xl font-bold tracking-tight">Kelola Bidang Dampingan</h3>
                    <button onClick={onClose} className="text-violet-600 hover:bg-violet-50 p-2 rounded-lg transition-colors">
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                {/* Input Section */}
                <div className="px-7 py-4 flex items-center gap-3">
                    <div className="flex-1">
                        <input 
                            type="text" 
                            placeholder="Nama bidang baru" 
                            className="w-full px-4 py-3 bg-white rounded-2xl border border-indigo-200 focus:border-indigo-400 focus:outline-none text-sm text-[#0A0F1E] placeholder:text-gray-400"
                        />
                    </div>
                    <button className="px-6 py-3 bg-[#0080C5] text-white rounded-2xl text-sm font-semibold flex items-center gap-2 hover:bg-[#006da8] transition-all">
                        <Plus size={16} />
                        Tambah
                    </button>
                </div>

                <div className="mx-7 h-px bg-slate-100 mt-2"></div>

                {/* Table Header */}
                <div className="mt-2 bg-slate-50 border-b border-slate-100 flex items-center px-7 py-3">
                    <span className="flex-1 text-slate-950 text-xs font-semibold uppercase tracking-wider">Nama Bidang</span>
                    <span className="w-20 text-center text-slate-950 text-xs font-semibold uppercase tracking-wider text-left">Aksi</span>
                </div>

                {/* Bidang List */}
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {bidangList.map((bidang, idx) => (
                        <div key={idx} className="px-7 py-3.5 border-b border-slate-100 flex items-center hover:bg-slate-50/50 transition-colors">
                            <span className="flex-1 text-slate-950 text-sm font-normal">{bidang}</span>
                            <button className="w-20 text-center text-red-500 text-xs font-semibold hover:underline">Hapus</button>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-7 py-4 bg-gray-50 border-t border-slate-100 flex items-center text-left">
                    <p className="text-slate-400 text-xs font-normal">
                        Total <span className="text-slate-950 font-semibold">{bidangList.length}</span> bidang dampingan
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ManageBidangModal;
