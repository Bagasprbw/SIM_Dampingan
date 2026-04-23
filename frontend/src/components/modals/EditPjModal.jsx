import React from 'react';
import { X, Edit3, Save } from 'lucide-react';
import Swal from 'sweetalert2';

const EditPjModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    const handleSave = () => {
        // Simulasi simpan data
        Swal.fire({
            title: 'Berhasil!',
            text: 'Data PJ Dampingan telah diperbarui.',
            icon: 'success',
            confirmButtonColor: '#0080C5',
            timer: 1500,
            showConfirmButton: false
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-[580px] bg-white rounded-2xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
                
                {/* Header */}
                <div className="h-20 px-6 py-5 border-b-[0.80px] border-gray-200 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-600/10 rounded-full flex justify-center items-center">
                            <Edit3 size={20} className="text-sky-600" />
                        </div>
                        <div className="flex flex-col justify-start items-start">
                            <h3 className="text-neutral-950 text-base font-bold leading-6">Edit Data PJ Dampingan</h3>
                            <p className="text-slate-400 text-xs font-normal leading-4">Perbarui informasi PJ Dampingan</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 p-2 bg-slate-100 rounded-lg flex justify-center items-center hover:bg-slate-200 transition-colors">
                        <X size={16} className="text-slate-400" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-5">
                    {/* First Row: Nama & No. Telepon */}
                    <div className="flex gap-5">
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Nama Lengkap</label>
                            <input 
                                type="text" 
                                defaultValue={data?.nama || "Budi Santoso"}
                                className="w-full px-4 py-2.5 bg-white rounded-[10px] border-[1.60px] border-gray-200 focus:border-sky-600 focus:outline-none text-slate-950 text-xs transition-all"
                                placeholder="Nama Lengkap"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">No. Telepon</label>
                            <input 
                                type="text" 
                                defaultValue="085678901234"
                                className="w-full px-4 py-2.5 bg-white rounded-[10px] border-[1.60px] border-gray-200 focus:border-sky-600 focus:outline-none text-slate-950 text-xs transition-all"
                                placeholder="No. Telepon"
                            />
                        </div>
                    </div>

                    {/* Alamat Row */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-950 text-xs font-semibold leading-5">Alamat</label>
                        <textarea 
                            defaultValue="Jonggol Kiri Utara Kanan"
                            className="w-full px-4 py-3 bg-white rounded-[10px] border-[1.60px] border-gray-200 focus:border-sky-600 focus:outline-none text-slate-400 text-xs min-h-[100px] resize-none leading-5 transition-all"
                        />
                    </div>

                    {/* Separator */}
                    <div className="w-full h-px bg-slate-100" />

                    {/* Username Row */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-950 text-xs font-semibold leading-5">Username</label>
                        <input 
                            type="text" 
                            defaultValue={data?.username || "budi.santoso"}
                            className="w-full px-4 py-2.5 bg-white rounded-[10px] border-[1.60px] border-gray-200 focus:border-sky-600 focus:outline-none text-slate-950 text-xs transition-all"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="h-20 px-6 py-4 border-t-[0.80px] border-gray-200 flex justify-end items-center gap-3 bg-white">
                    <button onClick={onClose} className="w-20 h-10 px-6 bg-white rounded-[10px] border-[0.80px] border-gray-200 text-slate-400 text-xs font-semibold hover:bg-slate-50 transition-all">
                        Batal
                    </button>
                    <button 
                        onClick={handleSave}
                        className="h-10 px-6 bg-[#0080C5] text-white rounded-[10px] flex items-center gap-2 hover:bg-[#006da8] transition-all group"
                    >
                        <Save size={14} className="text-white" />
                        <span className="text-xs font-semibold">Simpan Perubahan</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPjModal;
