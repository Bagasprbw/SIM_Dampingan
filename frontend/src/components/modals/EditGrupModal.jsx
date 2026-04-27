import React from 'react';
import { 
    X, 
    ChevronDown, 
    Plus, 
    Edit, 
    Save,
    Info
} from 'lucide-react';
import Swal from 'sweetalert2';

const EditGrupModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    const handleSave = () => {
        Swal.fire({
            title: 'Berhasil!',
            text: 'Perubahan data grup berhasil disimpan.',
            icon: 'success',
            confirmButtonColor: '#0080C5',
            timer: 2000,
            showConfirmButton: false,
            customClass: {
                popup: 'rounded-2xl font-["Poppins"]',
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[640px] bg-white rounded-2xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="h-20 px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0080C5]/10 rounded-full flex items-center justify-center text-[#0080C5]">
                            <Edit size={20} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-neutral-950 text-base font-bold leading-tight">Edit Grup Dampingan</h3>
                            <p className="text-slate-400 text-xs font-normal mt-0.5">Perbarui informasi grup dampingan</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 p-2 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6 max-h-[580px] overflow-y-auto space-y-5 custom-scrollbar text-left">
                    {/* Nama Grup */}
                    <div className="space-y-1.5">
                        <label className="text-slate-950 text-xs font-semibold leading-5">Nama Grup Dampingan</label>
                        <input 
                            type="text" 
                            defaultValue="Grup Dampingan Sejahtera"
                            className="w-full h-11 px-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all font-medium"
                        />
                    </div>

                    {/* Jenis & Bidang Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Jenis Grup Dampingan <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <select defaultValue="pusat" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                    <option value="pusat">Pusat</option>
                                    <option value="daerah">Daerah</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Bidang Grup Dampingan <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <select defaultValue="pertanian" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                    <option value="pertanian">Pertanian Terpadu</option>
                                    <option value="ekonomi">Perekonomian</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Provinsi & Kabupaten Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Provinsi <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <select defaultValue="jabar" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                    <option value="jabar">Jawa Barat</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Kabupaten <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <select defaultValue="bogor" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                    <option value="bogor">Bogor</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Kecamatan */}
                    <div className="space-y-1.5">
                        <label className="text-slate-950 text-xs font-semibold leading-5">Kecamatan</label>
                        <div className="relative group">
                            <select defaultValue="cibinong" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                <option value="cibinong">Cibinong</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Fasilitator */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Fasilitator</label>
                            <button className="px-3 py-1.5 bg-[#0080C5]/10 rounded-lg flex items-center gap-1.5 text-[#0080C5] hover:bg-[#0080C5]/20 transition-all">
                                <Plus size={12} strokeWidth={3} />
                                <span className="text-[10px] font-bold">Tambah Fasilitator</span>
                            </button>
                        </div>
                        <div className="relative group">
                            <select defaultValue="sucipto" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                <option value="sucipto">Sucipto</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                        </div>
                    </div>

                    {/* PJ Dampingan Section */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">PJ Dampingan</label>
                            <span className="text-slate-400 text-[10px] font-normal">(hanya satu)</span>
                        </div>
                        <div className="relative group">
                            <select defaultValue="budi" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                <option value="budi">Budi Santoso</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                        </div>
                        <p className="text-slate-400 text-[10px] font-normal flex items-start gap-1 mt-1">
                            <span className="text-[#0080C5]">*</span>
                            Hanya dapat memilih satu PJ Dampingan per grup.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="h-20 px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
                    <button 
                        onClick={onClose}
                        className="px-6 h-10 bg-white border border-gray-200 rounded-[10px] text-slate-400 text-xs font-semibold hover:bg-slate-50 transition-all"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-6 h-10 bg-[#0080C5] text-white rounded-[10px] text-xs font-semibold hover:bg-sky-700 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Save size={14} />
                        <span>Simpan Perubahan</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditGrupModal;
