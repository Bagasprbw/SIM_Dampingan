import React, { useState, useEffect } from 'react';
import { X, Edit3, Image as ImageIcon, Plus, Save, ChevronDown, Upload } from 'lucide-react';
import Swal from 'sweetalert2';

const EditFacilitatorModal = ({ isOpen, onClose, data }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [bidangTags, setBidangTags] = useState(['Perekonomian', 'Buruh']);

    useEffect(() => {
        if (data) {
            // Logika untuk mengisi data ke form jika diperlukan
            // Untuk saat ini kita pakai data dummy dari Figma
        }
    }, [data]);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const removeTag = (tagToRemove) => {
        setBidangTags(bidangTags.filter(tag => tag !== tagToRemove));
    };

    const handleSave = (e) => {
        e.preventDefault();
        Swal.fire({
            icon: 'success',
            title: 'Perubahan Disimpan!',
            text: 'Informasi fasilitator telah berhasil diperbarui.',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
                popup: 'rounded-2xl font-["Poppins"]',
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-[580px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0080C5]/10 rounded-full flex items-center justify-center text-[#0080C5]">
                            <Edit3 size={20} />
                        </div>
                        <div>
                            <h3 className="text-[#0A0F1E] text-lg font-bold leading-tight">Edit Data Fasilitator</h3>
                            <p className="text-slate-400 text-[10px] font-normal mt-0.5">Perbarui informasi fasilitator</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                        <X size={16} strokeWidth={3} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar text-left">
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
                                    <span className="text-xs font-bold">Ganti Foto</span>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                                <p className="text-slate-400 text-[10px]">Format: JPG, PNG. Maks. 2 MB</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Nama Lengkap</label>
                            <input type="text" defaultValue={data?.nama || "Ahmad Fauzi"} className="w-full px-4 py-2.5 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] font-medium" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">No. Telepon</label>
                            <input type="text" defaultValue="081234567890" className="w-full px-4 py-2.5 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] font-medium" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#0A0F1E] text-xs font-semibold">Alamat</label>
                        <textarea rows="3" className="w-full px-4 py-2.5 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] resize-none font-medium"></textarea>
                    </div>

                    {/* Bidang Dampingan with Tags */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Bidang Dampingan</label>
                            <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0080C5]/10 text-[#0080C5] rounded-lg hover:bg-[#0080C5]/20 transition-all">
                                <Plus size={12} />
                                <span className="text-[10px] font-bold">Tambah Bidang</span>
                            </button>
                        </div>
                        <div className="relative">
                            <select className="w-full px-4 py-2.5 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-400 appearance-none">
                                <option value="">Pilih bidang dampingan...</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        {/* Tags Display */}
                        <div className="flex flex-wrap gap-2 pt-1">
                            {bidangTags.map((tag, idx) => (
                                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-[#0080C5]/10 border border-[#0080C5]/20 rounded-full text-[#0080C5] text-[10px] font-bold">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="w-4 h-4 bg-[#0080C5]/20 rounded-full flex items-center justify-center hover:bg-[#0080C5]/30 transition-colors">
                                        <X size={10} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="flex flex-col gap-1.5 pb-2">
                        <label className="text-[#0A0F1E] text-xs font-semibold">Username</label>
                        <input type="text" defaultValue={data?.username || "ahmad.fauzi"} className="w-full px-4 py-2.5 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] font-medium" />
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
                    <button onClick={onClose} className="px-6 py-2 bg-white rounded-[10px] border border-gray-200 text-slate-400 text-xs font-semibold hover:bg-gray-50 h-10 transition-all">
                        Batal
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 bg-[#0080C5] text-white rounded-[10px] text-xs font-semibold hover:bg-[#006da8] h-10 flex items-center gap-2 shadow-sm transition-all">
                        <Save size={16} />
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditFacilitatorModal;
