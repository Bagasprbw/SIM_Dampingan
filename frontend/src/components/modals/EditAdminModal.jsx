import React, { useState, useEffect } from 'react';
import { X, Edit3, ChevronDown, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAdminMutations } from '../../hooks/mutations/useAdminMutation';
import { useRoles } from '../../hooks/queries/useHakAksesQuery';
import { useProvinsi, useKabupaten, useKecamatan } from '../../hooks/queries/useWilayahQuery';
import { getUser } from '../../utils/storage';

const EditAdminModal = ({ isOpen, onClose, data }) => {
    const { updateAdmin } = useAdminMutations();
    const { data: rolesData, isLoading: loadingRoles } = useRoles();
    const roles = rolesData?.data || [];
    
    const currentUser = getUser();
    const currentUserRoleName = typeof currentUser?.role === 'object' && currentUser?.role !== null ? currentUser.role.name : currentUser?.role;
    
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', 
        username: '', 
        no_telp: '',
        role_id: '',
        kode_prov: '', 
        kode_kab: '', 
        kode_kec: ''
    });

    const { data: provinsiList = [], isLoading: loadingProv } = useProvinsi();
    const { data: kabupatenList = [], isLoading: loadingKab } = useKabupaten(formData.kode_prov);
    const { data: kecamatanList = [], isLoading: loadingKec } = useKecamatan(formData.kode_kab);

    // Filter roles to only show admin roles allowed for the current logged-in user
    const adminRoles = roles.filter(role => {
        if (!['admin_provinsi', 'admin_kabupaten', 'admin_kecamatan'].includes(role.name)) {
            return false;
        }
        if (currentUserRoleName === 'admin_provinsi') {
            return ['admin_kabupaten', 'admin_kecamatan'].includes(role.name);
        }
        if (currentUserRoleName === 'admin_kabupaten') {
            return ['admin_kecamatan'].includes(role.name);
        }
        return true; // superadmin can see all admin roles
    });

    const selectedRole = adminRoles.find(r => r.id_role?.toString() === formData.role_id?.toString());
    const selectedRoleName = selectedRole ? selectedRole.name : (data?.role?.name || '');

    const isProvDisabled = currentUserRoleName === 'admin_provinsi' || currentUserRoleName === 'admin_kabupaten';

    const isKabDisabled = !formData.kode_prov || selectedRoleName === 'admin_provinsi' || currentUserRoleName === 'admin_kabupaten';
    const isKabRequired = selectedRoleName === 'admin_kabupaten' || selectedRoleName === 'admin_kecamatan';

    const isKecDisabled = !formData.kode_kab || selectedRoleName === 'admin_provinsi' || selectedRoleName === 'admin_kabupaten';
    const isKecRequired = selectedRoleName === 'admin_kecamatan';

    useEffect(() => {
        if (selectedRoleName === 'admin_provinsi') {
            if (formData.kode_kab !== '' || formData.kode_kec !== '') {
                setFormData(prev => ({
                    ...prev,
                    kode_kab: '',
                    kode_kec: ''
                }));
            }
        } else if (selectedRoleName === 'admin_kabupaten') {
            if (formData.kode_kec !== '') {
                setFormData(prev => ({
                    ...prev,
                    kode_kec: ''
                }));
            }
        }
    }, [formData.role_id, selectedRoleName]);

    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || '',
                username: data.username || '',
                no_telp: data.no_telp || '',
                role_id: data.role_id || '',
                kode_prov: data.kode_prov || '',
                kode_kab: data.kode_kab || '',
                kode_kec: data.kode_kec || ''
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value,
            ...(name === 'kode_prov' ? { kode_kab: '', kode_kec: '' } : {}),
            ...(name === 'kode_kab' ? { kode_kec: '' } : {})
        }));
    };

    if (!isOpen) return null;

    const handleSave = (e) => {
        e.preventDefault();
        setIsLoading(true);
        updateAdmin.mutate({ id: data.id_user || data.id, data: formData }, {
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
            onError: (error) => {
                setIsLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: error.response?.data?.message || 'Terjadi kesalahan saat mengubah admin.',
                    showConfirmButton: false,
                    timer: 2000,
                    customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                });
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col text-left">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
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
                <form onSubmit={handleSave} className="p-5 space-y-3 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Nama <span className="text-red-500">*</span></label>
                            <input name="name" value={formData.name} onChange={handleChange} type="text" className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] font-medium" required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Username <span className="text-red-500">*</span></label>
                            <input name="username" value={formData.username} onChange={handleChange} type="text" className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] font-medium" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">No. Telp <span className="text-red-500">*</span></label>
                            <input name="no_telp" value={formData.no_telp} onChange={handleChange} type="text" className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] font-medium" placeholder="08xxxxxxxxxx" required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Role <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <select name="role_id" value={formData.role_id} onChange={handleChange} className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none font-medium" required>
                                    <option value="">{loadingRoles ? 'Memuat...' : 'Pilih Role'}</option>
                                    {adminRoles.map(role => (
                                        <option key={role.id_role} value={role.id_role}>{role.name.replace(/_/g, ' ').toUpperCase()}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Provinsi <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <select name="kode_prov" value={formData.kode_prov} onChange={handleChange} className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none font-medium disabled:opacity-50" disabled={isProvDisabled} required>
                                    <option value="">{loadingProv ? 'Memuat...' : 'Pilih Provinsi'}</option>
                                    {provinsiList.map(p => (
                                        <option key={p.kode} value={p.kode}>{p.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Kabupaten {isKabRequired && <span className="text-red-500">*</span>}</label>
                            <div className="relative group">
                                <select name="kode_kab" value={formData.kode_kab} onChange={handleChange} className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none font-medium disabled:opacity-50" disabled={isKabDisabled} required={isKabRequired}>
                                    <option value="">{loadingKab ? 'Memuat...' : 'Pilih Kabupaten'}</option>
                                    {kabupatenList.map(k => (
                                        <option key={k.kode} value={k.kode}>{k.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#0A0F1E] text-xs font-semibold">Kecamatan {isKecRequired && <span className="text-red-500">*</span>}</label>
                        <div className="relative group">
                            <select name="kode_kec" value={formData.kode_kec} onChange={handleChange} className="w-full px-3 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none font-medium disabled:opacity-50" disabled={isKecDisabled} required={isKecRequired}>
                                <option value="">{loadingKec ? 'Memuat...' : 'Pilih Kecamatan'}</option>
                                {kecamatanList.map(k => (
                                    <option key={k.kode} value={k.kode}>{k.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                        <button type="button" onClick={onClose} className="px-6 h-10 bg-white rounded-[10px] border border-gray-200 text-slate-400 text-xs font-semibold hover:bg-gray-50 transition-all">
                            Batal
                        </button>
                        <button type="submit" disabled={isLoading} className="px-6 h-10 bg-[#0080C5] text-white rounded-lg text-xs font-semibold hover:bg-sky-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[140px]">
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                            <span>{isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAdminModal;
