import React, { useState } from 'react';
import { X, UserPlus, Eye, EyeOff, ChevronDown, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAdminMutations } from '../../hooks/mutations/useAdminMutation';

const AddAdminModal = ({ isOpen, onClose }) => {
    const { createAdmin } = useAdminMutations();
    const [isLoading, setIsLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [formData, setFormData] = useState({
        nama: '', username: '', password: '', no_telp: '',
        role: '', alamat: '', provinsi_id: '', kabupaten_id: '', kecamatan_id: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!isOpen) return null;

    const handleSave = (e) => {
        e.preventDefault();
        setIsLoading(true);
        createAdmin.mutate(formData, {
            onSuccess: () => {
                setIsLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data admin baru telah ditambahkan.',
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
                    text: 'Terjadi kesalahan saat menambahkan admin.',
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
                            <UserPlus size={20} />
                        </div>
                        <div>
                            <h3 className="text-[#0A0F1E] text-lg font-bold leading-tight">Tambah Data Admin</h3>
                            <p className="text-slate-400 text-[10px] font-normal mt-0.5">Isi formulir berikut untuk menambahkan admin baru</p>
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
                            <input name="nama" value={formData.nama} onChange={handleChange} type="text" placeholder="Masukkan nama lengkap" className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-300" required />
                        </div>
                        {/* Username */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Username <span className="text-red-500">*</span></label>
                            <input name="username" value={formData.username} onChange={handleChange} type="text" placeholder="Masukkan username" className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-300" required />
                        </div>
                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input name="password" value={formData.password} onChange={handleChange} type={showPass ? "text" : "password"} placeholder="Masukkan password" size="sm" className="w-full px-3 py-2.5 pr-10 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-300" required />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        {/* Konfirmasi Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Konfirmasi Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input type={showConfirmPass ? "text" : "password"} placeholder="Ulangi password" size="sm" className="w-full px-3 py-2.5 pr-10 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-300" required />
                                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        {/* No. Telp */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">No. Telp <span className="text-red-500">*</span></label>
                            <input name="no_telp" value={formData.no_telp} onChange={handleChange} type="text" placeholder="Contoh: 08xxxxxxxxxx" className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-300" required />
                        </div>
                        {/* Role */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Role <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none" required>
                                    <option value="">Pilih Role</option>
                                    <option value="admin_provinsi">Admin Provinsi</option>
                                    <option value="admin_kabupaten">Admin Kabupaten</option>
                                    <option value="admin_kecamatan">Admin Kecamatan</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Alamat */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#0A0F1E] text-xs font-semibold">Alamat <span className="text-red-500">*</span></label>
                        <textarea name="alamat" value={formData.alamat} onChange={handleChange} rows="3" placeholder="Masukkan alamat lengkap" className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-300 resize-none" required></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {/* Provinsi */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Provinsi <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select name="provinsi_id" value={formData.provinsi_id} onChange={handleChange} className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none" required>
                                    <option value="">Pilih Provinsi</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        {/* Kabupaten */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Kabupaten <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select name="kabupaten_id" value={formData.kabupaten_id} onChange={handleChange} className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none" required>
                                    <option value="">Pilih Kabupaten</option>
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
                                <option value="">Pilih Kecamatan</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-white rounded-[10px] border border-gray-200 text-slate-400 text-xs font-semibold hover:bg-gray-50 transition-all h-10">
                            Batal
                        </button>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-[#0080C5] text-white rounded-[10px] text-xs font-semibold hover:bg-[#006da8] transition-all h-10 flex items-center gap-2 disabled:opacity-50">
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAdminModal;
