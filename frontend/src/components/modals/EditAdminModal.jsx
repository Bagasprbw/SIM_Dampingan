import React, { useState, useEffect } from 'react';
import { X, Edit3, ChevronDown, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAdminMutations } from '../../hooks/mutations/useAdminMutation';

const EditAdminModal = ({ isOpen, onClose, data }) => {
    const { updateAdmin } = useAdminMutations();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama: '', username: '', no_telp: '',
        alamat: '', provinsi_id: '', kabupaten_id: '', kecamatan_id: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                nama: data.nama || '',
                username: data.username || '',
                no_telp: data.telp || data.no_telp || '',
                alamat: data.alamat || '',
                provinsi_id: data.provinsi_id || '',
                kabupaten_id: data.kabupaten_id || '',
                kecamatan_id: data.kecamatan_id || ''
            });
        }
    }, [data]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!isOpen) return null;

    const handleSave = (e) => {
        e.preventDefault();
        setIsLoading(true);
        updateAdmin.mutate({ id: data.id, data: formData }, {
            onSuccess: () => {
                setIsLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Perubahan data admin telah disimpan.',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                });
                onClose();
            },
            onError: () => {
                setIsLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Terjadi kesalahan saat mengubah admin.',
                    showConfirmButton: false,
                    timer: 2000,
                    customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                });
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0080C5]/10 rounded-full flex items-center justify-center text-[#0080C5]">
                            <Edit3 size={20} />
                        </div>
                        <div>
                            <h3 className="text-[#0A0F1E] text-lg font-bold leading-tight">Edit Data Admin</h3>
                            <p className="text-slate-400 text-[10px] font-normal mt-0.5">Ubah informasi admin yang sudah ada</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                        <X size={16} strokeWidth={3} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSave} className="p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-5">
                        {/* Nama */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Nama <span className="text-red-500">*</span></label>
                            <input name="nama" value={formData.nama} onChange={handleChange} type="text" className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E]" required />
                        </div>
                        {/* Username */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Username <span className="text-red-500">*</span></label>
                            <input name="username" value={formData.username} onChange={handleChange} type="text" className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E]" required />
                        </div>
                    </div>

                    {/* No. Telp */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#0A0F1E] text-xs font-semibold">No. Telp <span className="text-red-500">*</span></label>
                        <input name="no_telp" value={formData.no_telp} onChange={handleChange} type="text" className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E]" required />
                    </div>

                    {/* Alamat */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#0A0F1E] text-xs font-semibold">Alamat <span className="text-red-500">*</span></label>
                        <textarea name="alamat" value={formData.alamat} onChange={handleChange} rows="3" className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] resize-none" required></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {/* Provinsi */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Provinsi <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select name="provinsi_id" value={formData.provinsi_id} onChange={handleChange} className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none" required>
                                    <option value="jabar">Jawa Barat</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        {/* Kabupaten */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Kabupaten <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select name="kabupaten_id" value={formData.kabupaten_id} onChange={handleChange} className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none" required>
                                    <option value="kab">Kabupaten</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Kecamatan */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#0A0F1E] text-xs font-semibold">Kecamatan <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select name="kecamatan_id" value={formData.kecamatan_id} onChange={handleChange} className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none" required>
                                <option value="kec">Kecamatan</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-white rounded-[10px] border border-gray-200 text-slate-400 text-xs font-semibold hover:bg-gray-50 transition-all h-10">
                            Batal
                        </button>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-[#0080C5] text-white rounded-[10px] text-xs font-semibold hover:bg-[#006da8] transition-all h-10 min-w-[176px] flex items-center justify-center gap-2 disabled:opacity-50">
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAdminModal;
