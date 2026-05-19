import React, { useState, useEffect, useRef } from 'react';
import { X, UserPlus, Image as ImageIcon, Plus, Eye, EyeOff, Save, ChevronDown, Upload, Loader2, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import { useFasilitatorMutations } from '../../hooks/mutations/useFasilitatorMutation';
import { useBidangs } from '../../hooks/queries/useBidangQuery';
import { useProvinsi, useKabupaten, useKecamatan } from '../../hooks/queries/useWilayahQuery';
import { getUser } from '../../utils/storage';

const AddFacilitatorModal = ({ isOpen, onClose }) => {
    // Fetch Bidang Dampingan
    const { data: bidangsData, isLoading: isLoadingBidangs } = useBidangs();
    // Handle both response shapes: { data: [...] } or [...]
    const bidangs = Array.isArray(bidangsData?.data) ? bidangsData.data
        : Array.isArray(bidangsData) ? bidangsData : [];

    const { createFasilitator } = useFasilitatorMutations();
    const [isLoading, setIsLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showBidangDropdown, setShowBidangDropdown] = useState(false);
    
    const dropdownRef = useRef(null);

    const currentUser = getUser();
    const currentUserRoleName = typeof currentUser?.role === 'object' && currentUser?.role !== null ? currentUser.role.name : currentUser?.role;

    const [formData, setFormData] = useState({
        name: '', 
        no_telp: '', 
        bidang_ids: [], 
        username: '', 
        password: '', 
        foto: null,
        kode_prov: currentUserRoleName === 'admin_provinsi' || currentUserRoleName === 'admin_kabupaten' || currentUserRoleName === 'admin_kecamatan' ? currentUser?.kode_prov || '' : '',
        kode_kab: currentUserRoleName === 'admin_kabupaten' || currentUserRoleName === 'admin_kecamatan' ? currentUser?.kode_kab || '' : '',
        kode_kec: currentUserRoleName === 'admin_kecamatan' ? currentUser?.kode_kec || '' : ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '', 
                no_telp: '', 
                bidang_ids: [], 
                username: '', 
                password: '', 
                foto: null,
                kode_prov: currentUserRoleName === 'admin_provinsi' || currentUserRoleName === 'admin_kabupaten' || currentUserRoleName === 'admin_kecamatan' ? currentUser?.kode_prov || '' : '',
                kode_kab: currentUserRoleName === 'admin_kabupaten' || currentUserRoleName === 'admin_kecamatan' ? currentUser?.kode_kab || '' : '',
                kode_kec: currentUserRoleName === 'admin_kecamatan' ? currentUser?.kode_kec || '' : ''
            });
            setSelectedImage(null);
            setShowBidangDropdown(false);
        }
    }, [isOpen]);

    // Handle clicking outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowBidangDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const { data: provinsiList = [] } = useProvinsi();
    const { data: kabupatenList = [] } = useKabupaten(formData.kode_prov);
    const { data: kecamatanList = [] } = useKecamatan(formData.kode_kab);

    const isProvDisabled = currentUserRoleName === 'admin_provinsi' || currentUserRoleName === 'admin_kabupaten' || currentUserRoleName === 'admin_kecamatan';
    const isKabDisabled = !formData.kode_prov || currentUserRoleName === 'admin_kabupaten' || currentUserRoleName === 'admin_kecamatan';
    const isKecDisabled = !formData.kode_kab || currentUserRoleName === 'admin_kecamatan';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value,
            ...(name === 'kode_prov' ? { kode_kab: '', kode_kec: '' } : {}),
            ...(name === 'kode_kab' ? { kode_kec: '' } : {})
        }));
    };

    const handleBidangToggle = (bidangId) => {
        setFormData(prev => {
            const isSelected = prev.bidang_ids.includes(bidangId);
            if (isSelected) {
                return { ...prev, bidang_ids: prev.bidang_ids.filter(id => id !== bidangId) };
            } else {
                return { ...prev, bidang_ids: [...prev.bidang_ids, bidangId] };
            }
        });
    };

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
            setFormData({ ...formData, foto: e.target.files[0] });
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        if (formData.bidang_ids.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Perhatian',
                text: 'Silakan pilih minimal satu bidang dampingan.',
                confirmButtonColor: '#FBBF24',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' }
            });
            return;
        }

        setIsLoading(true);

        const form = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'bidang_ids') {
                formData.bidang_ids.forEach(id => form.append('bidang_ids[]', id));
            } else if (formData[key] !== null && formData[key] !== '') {
                form.append(key, formData[key]);
            }
        });

        createFasilitator.mutate(form, {
            onSuccess: () => {
                setIsLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data fasilitator baru telah ditambahkan.',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                });
                onClose();
            },
            onError: (err) => {
                setIsLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: err.response?.data?.message || 'Terjadi kesalahan saat menambahkan fasilitator.',
                    showConfirmButton: false,
                    timer: 2000,
                    customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                });
            }
        });
    };

    const getSelectedBidangNames = () => {
        if (formData.bidang_ids.length === 0) return 'Pilih Bidang (Bisa lebih dari 1)';
        const selected = bidangs.filter(b => formData.bidang_ids.includes(b.id_bidang));
        return selected.map(b => b.name).join(', ');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-[550px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0080C5]/10 rounded-full flex items-center justify-center text-[#0080C5]">
                            <UserPlus size={20} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-[#0A0F1E] text-lg font-bold leading-tight">Tambah Data Fasilitator</h3>
                            <p className="text-slate-400 text-[10px] font-normal mt-0.5">Lengkapi seluruh data fasilitator</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                        <X size={16} strokeWidth={3} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar text-left grow">
                    
                    {/* Foto Section */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[#0A0F1E] text-xs font-semibold">Foto Fasilitator</label>
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#0080C5] flex items-center justify-center overflow-hidden bg-slate-50 shrink-0">
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon size={20} className="text-slate-300" />
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#0080C5]/5 border-2 border-[#0080C5] border-dashed rounded-xl text-[#0080C5] hover:bg-[#0080C5]/10 transition-all w-fit">
                                    <Upload size={14} />
                                    <span className="text-xs font-bold">Upload Foto</span>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                                <p className="text-slate-400 text-[9px]">JPG/PNG, Maks. 2MB</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Nama Lengkap <span className="text-red-500">*</span></label>
                            <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Nama lengkap" className="w-full px-4 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] font-medium" required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">No. Telepon <span className="text-red-500">*</span></label>
                            <input name="no_telp" value={formData.no_telp} onChange={handleChange} type="text" placeholder="08xxxxxxxxxx" className="w-full px-4 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] font-medium" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5" ref={dropdownRef}>
                        <label className="text-[#0A0F1E] text-xs font-semibold">Bidang Dampingan <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <div 
                                onClick={() => setShowBidangDropdown(!showBidangDropdown)}
                                className="w-full px-4 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] text-xs font-medium min-h-[42px] cursor-pointer flex items-center justify-between"
                            >
                                <span className={formData.bidang_ids.length === 0 ? "text-slate-400" : "text-[#0A0F1E] truncate pr-4"}>
                                    {getSelectedBidangNames()}
                                </span>
                                <ChevronDown size={16} className={`text-slate-400 transition-transform ${showBidangDropdown ? 'rotate-180' : ''}`} />
                            </div>
                            
                            {showBidangDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto py-2 px-1 custom-scrollbar">
                                    {isLoadingBidangs ? (
                                        <div className="p-3 text-center text-xs text-slate-400">Loading...</div>
                                    ) : bidangs.length === 0 ? (
                                        <div className="p-3 text-center text-xs text-slate-400">Belum ada bidang</div>
                                    ) : (
                                        bidangs.map((b) => (
                                            <div 
                                                key={b.id_bidang} 
                                                onClick={() => handleBidangToggle(b.id_bidang)}
                                                className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors select-none"
                                            >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${formData.bidang_ids.includes(b.id_bidang) ? 'bg-[#0080C5] border-[#0080C5]' : 'border-gray-300'}`}>
                                                    {formData.bidang_ids.includes(b.id_bidang) && <Check size={12} className="text-white" strokeWidth={3} />}
                                                </div>
                                                <span className="text-xs text-[#0A0F1E] font-medium">{b.name}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Wilayah Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Provinsi <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <select name="kode_prov" value={formData.kode_prov} onChange={handleChange} className="w-full px-4 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none font-medium disabled:opacity-50 disabled:bg-slate-50" disabled={isProvDisabled} required>
                                    <option value="">Pilih Provinsi</option>
                                    {provinsiList.map(p => (
                                        <option key={p.kode} value={p.kode}>{p.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Kabupaten <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <select name="kode_kab" value={formData.kode_kab} onChange={handleChange} className="w-full px-4 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none font-medium disabled:opacity-50 disabled:bg-slate-50" disabled={isKabDisabled} required>
                                    <option value="">Pilih Kabupaten</option>
                                    {kabupatenList.map(k => (
                                        <option key={k.kode} value={k.kode}>{k.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#0A0F1E] text-xs font-semibold">Kecamatan</label>
                        <div className="relative group">
                            <select name="kode_kec" value={formData.kode_kec} onChange={handleChange} className="w-full px-4 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none font-medium disabled:opacity-50 disabled:bg-slate-50" disabled={isKecDisabled}>
                                <option value="">Pilih Kecamatan (Opsional)</option>
                                {kecamatanList.map(k => (
                                    <option key={k.kode} value={k.kode}>{k.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Username <span className="text-red-500">*</span></label>
                            <input name="username" value={formData.username} onChange={handleChange} type="text" placeholder="Username" className="w-full px-4 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] font-medium" required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input name="password" value={formData.password} onChange={handleChange} type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full px-4 py-2.5 pr-10 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] font-medium" required />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white shrink-0">
                    <button type="button" onClick={onClose} className="px-6 h-10 bg-white border border-gray-200 rounded-[10px] text-slate-400 text-xs font-semibold hover:bg-slate-50 transition-all">
                        Batal
                    </button>
                    <button onClick={handleSave} disabled={isLoading} type="button" className="px-8 h-10 bg-[#0080C5] text-white rounded-lg text-xs font-semibold hover:bg-sky-700 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 min-w-[120px] justify-center">
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        <span>{isLoading ? 'Menyimpan...' : 'Simpan Data'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddFacilitatorModal;
