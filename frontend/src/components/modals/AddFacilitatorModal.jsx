import React, { useState } from 'react';
import { X, UserPlus, Image as ImageIcon, Plus, Eye, EyeOff, Save, ChevronDown, Upload } from 'lucide-react';
import Swal from 'sweetalert2';

const AddFacilitatorModal = ({ isOpen, onClose }) => {
    const [showPass, setShowPass] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Data fasilitator baru telah ditambahkan.',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
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
            <div className="relative w-full max-w-[580px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0080C5]/10 rounded-full flex items-center justify-center text-[#0080C5]">
                            <UserPlus size={20} />
                        </div>
                        <div>
                            <h3 className="text-[#0A0F1E] text-lg font-bold leading-tight">Tambah Data Fasilitator</h3>
                            <p className="text-slate-400 text-[10px] font-normal mt-0.5">Lengkapi seluruh data fasilitator</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                        <X size={16} strokeWidth={3} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    
                    {/* Foto Fasilitator */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[#0A0F1E] text-xs font-semibold">Foto Fasilitator</label>
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#0080C5] flex items-center justify-center overflow-hidden bg-slate-50">
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon size={28} className="text-slate-300" />
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-[#0080C5]/5 border-2 border-[#0080C5] border-dashed rounded-xl text-[#0080C5] hover:bg-[#0080C5]/10 transition-all">
                                    <Upload size={16} />
                                    <span className="text-xs font-bold">Upload Foto</span>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                                <p className="text-slate-400 text-[10px]">Format: JPG, PNG. Maks. 2 MB</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="grid grid-cols-2 gap-5">
                        {/* Nama Lengkap */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Nama Lengkap <span className="text-red-500">*</span></label>
                            <input type="text" placeholder="Masukkan nama lengkap" className="w-full px-4 py-2.5 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-300" required />
                        </div>
                        {/* No. Telepon */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">No. Telepon <span className="text-red-500">*</span></label>
                            <input type="text" placeholder="08xxxxxxxxxx" className="w-full px-4 py-2.5 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-300" required />
                        </div>
                    </div>

                    {/* Alamat */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#0A0F1E] text-xs font-semibold">Alamat <span className="text-red-500">*</span></label>
                        <textarea rows="3" placeholder="Masukkan alamat lengkap..." className="w-full px-4 py-2.5 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-300 resize-none" required></textarea>
                    </div>

                    {/* Bidang Dampingan */}
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Bidang Dampingan <span className="text-red-500">*</span></label>
                            <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0080C5]/10 text-[#0080C5] rounded-lg hover:bg-[#0080C5]/20 transition-all">
                                <Plus size={12} />
                                <span className="text-[10px] font-bold">Tambah Bidang</span>
                            </button>
                        </div>
                        <div className="relative">
                            <select className="w-full px-4 py-2.5 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none" required>
                                <option value="">Pilih bidang dampingan...</option>
                                <option value="ekonomi">Perekonomian</option>
                                <option value="buruh">Buruh</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="grid grid-cols-2 gap-5 pb-2">
                        {/* Username */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Username <span className="text-red-500">*</span></label>
                            <input type="text" placeholder="Masukkan username" className="w-full px-4 py-2.5 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-300" required />
                        </div>
                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full px-4 py-2.5 pr-10 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-300" required />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-white rounded-[10px] border border-gray-200 text-slate-400 text-xs font-semibold hover:bg-gray-50 transition-all h-10">
                        Batal
                    </button>
                    <button onClick={handleSave} type="button" className="px-6 py-2 bg-[#0080C5] text-white rounded-[10px] text-xs font-semibold hover:bg-[#006da8] transition-all h-10 flex items-center gap-2">
                        <Save size={16} />
                        Simpan Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddFacilitatorModal;
