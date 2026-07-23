import React, { useState, useMemo, useEffect } from 'react';
import { X, Users, ChevronDown, Plus, Check, User, Upload, Eye, EyeOff, Save, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import UsernameHint from '../common/UsernameHint';
import { useUsernameCheck } from '../../hooks/useUsernameCheck';
import { useGrupDampinganMutations } from '../../hooks/mutations/useGrupDampinganMutation';
import { useBidangs } from '../../hooks/queries/useBidangQuery';
import { useProvinsi, useKabupaten, useKecamatan } from '../../hooks/queries/useWilayahQuery';
import { useFasilitators } from '../../hooks/queries/useFasilitatorQuery';
import { getUser } from '../../utils/storage';
import { pjGrupService } from '../../services/pjGrupService';

const AddGrupModal = ({ isOpen, onClose }) => {
    const { data: bidangsData } = useBidangs();
    const bidangs = bidangsData?.data || [];
    
    const { data: fasilitatorData } = useFasilitators({ per_page: 10000 });
    const fasilitatorOptions = useMemo(() => fasilitatorData?.data || [], [fasilitatorData]);

    const { createGrupDampingan } = useGrupDampinganMutations();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    
    const currentUser = getUser();
    const currentUserRoleName = typeof currentUser?.role === 'object' && currentUser?.role !== null 
        ? currentUser.role.name 
        : currentUser?.role;

    const isProvinsiAdmin = currentUserRoleName?.toString()?.toLowerCase()?.includes('provinsi') || false;
    const isKabupatenAdmin = currentUserRoleName?.toString()?.toLowerCase()?.includes('kabupaten') || false;
    const isKecamatanAdmin = currentUserRoleName?.toString()?.toLowerCase()?.includes('kecamatan') || false;

    const [formData, setFormData] = useState({
        name: '',
        level_dampingan: '',
        bidang_ids: [],
        kode_prov: '',
        kode_kab: '',
        kode_kec: '',
        fasilitator_ids: [],
        pj_nama: '',
        pj_no_telp: '',
        pj_username: '',
        pj_password: '',
        pj_foto: null
    });

    // Reset form setiap kali modal dibuka
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                level_dampingan: '',
                bidang_ids: [],
                kode_prov: (isProvinsiAdmin || isKabupatenAdmin || isKecamatanAdmin) ? currentUser?.kode_prov || '' : '',
                kode_kab: (isKabupatenAdmin || isKecamatanAdmin) ? currentUser?.kode_kab || '' : '',
                kode_kec: isKecamatanAdmin ? currentUser?.kode_kec || '' : '',
                fasilitator_ids: [],
                pj_nama: '',
                pj_no_telp: '',
                pj_username: '',
                pj_password: '',
                pj_foto: null
            });
            setCurrentStep(1);
            setSelectedImage(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const pjUsernameStatus = useUsernameCheck(formData.pj_username, null, isOpen);

    const { data: provinsiList = [] } = useProvinsi();
    const { data: kabupatenList = [] } = useKabupaten(formData.kode_prov);
    const { data: kecamatanList = [] } = useKecamatan(formData.kode_kab);

    const [selectedImage, setSelectedImage] = useState(null);

    // Handle change for general inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'kode_prov' ? { kode_kab: '', kode_kec: '' } : {}),
            ...(name === 'kode_kab' ? { kode_kec: '' } : {})
        }));
    };

    const handleBidangToggle = (id) => {
        setFormData(prev => {
            const current = prev.bidang_ids || [];
            const isSelected = current.includes(id);
            const updated = isSelected 
                ? current.filter(item => item !== id)
                : [...current, id];
            return { ...prev, bidang_ids: updated };
        });
    };

    // Filter level_dampingan options based on user's admin level
    const availableLevels = useMemo(() => {
        if (isKecamatanAdmin) {
            return [
                { value: 'kecamatan', label: 'Kecamatan' }
            ];
        }
        if (isKabupatenAdmin) {
            return [
                { value: 'kabupaten', label: 'Kabupaten' },
                { value: 'kecamatan', label: 'Kecamatan' }
            ];
        }
        if (isProvinsiAdmin) {
            return [
                { value: 'provinsi', label: 'Provinsi' },
                { value: 'kabupaten', label: 'Kabupaten' },
                { value: 'kecamatan', label: 'Kecamatan' }
            ];
        }
        return [
            { value: 'provinsi', label: 'Provinsi' },
            { value: 'kabupaten', label: 'Kabupaten' },
            { value: 'kecamatan', label: 'Kecamatan' }
        ];
    }, [isProvinsiAdmin, isKabupatenAdmin, isKecamatanAdmin]);

    // Handle level_dampingan change
    const handleLevelChange = (e) => {
        const level = e.target.value;
        setFormData(prev => {
            const updated = {
                ...prev,
                level_dampingan: level,
                // Prune/clear fields based on new level
                ...(level === 'provinsi' ? { kode_kab: '', kode_kec: '' } : {}),
                ...(level === 'kabupaten' ? { kode_kec: '' } : {})
            };
            
            // Re-apply locked admin regions
            if (isProvinsiAdmin || isKabupatenAdmin || isKecamatanAdmin) {
                updated.kode_prov = currentUser?.kode_prov || '';
            }
            if (isKabupatenAdmin || isKecamatanAdmin) {
                updated.kode_kab = currentUser?.kode_kab || '';
            }
            if (isKecamatanAdmin) {
                updated.kode_kec = currentUser?.kode_kec || '';
            }
            return updated;
        });
    };

    // Determine region selector disabled state & style
    const isLevelSelected = !!formData.level_dampingan;
    
    const isProvDisabled = !isLevelSelected || isProvinsiAdmin || isKabupatenAdmin || isKecamatanAdmin;
    
    const isKabDisabled = !isLevelSelected || 
                          formData.level_dampingan === 'provinsi' || 
                          !formData.kode_prov || 
                          isKabupatenAdmin || 
                          isKecamatanAdmin;
                          
    const isKecDisabled = !isLevelSelected || 
                          formData.level_dampingan === 'provinsi' || 
                          formData.level_dampingan === 'kabupaten' || 
                          !formData.kode_kab || 
                          isKecamatanAdmin;

    const selectClassName = (isDisabled) => 
        `w-full h-11 pl-4 pr-10 rounded-[10px] border-2 appearance-none text-xs font-medium focus:outline-none transition-all cursor-pointer ${
            isDisabled 
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                : 'bg-white text-slate-900 border-gray-100 focus:border-[#0080C5]'
        }`;

    // Filter fasilitators by bidang & region hierarchy match
    const filteredFasilitators = useMemo(() => {
        return fasilitatorOptions.filter(f => {
            // Must match selected Bidang
            const hasMatchingBidang = formData.bidang_ids.length === 0 || f.fasilitator_bidangs?.some(fb => 
                formData.bidang_ids.includes(fb.bidang_id?.toString()) || 
                formData.bidang_ids.includes(fb.bidang?.id_bidang?.toString())
            );
            if (!hasMatchingBidang) return false;

            // Must match Region hierarchy
            const fProv = f.kode_prov || '';
            const fKab = f.kode_kab || '';
            const fKec = f.kode_kec || '';
            
            const gProv = formData.kode_prov || '';
            const gKab = formData.kode_kab || '';
            const gKec = formData.kode_kec || '';
            
            if (!gProv) return false; // Province must be selected first
            if (fProv !== gProv) return false;
            if (fKab && fKab !== gKab) return false;
            if (fKec && fKec !== gKec) return false;
            
            return true;
        });
    }, [fasilitatorOptions, formData.bidang_ids, formData.kode_prov, formData.kode_kab, formData.kode_kec]);

    // Handle multi fasilitator toggle
    const handleFasilitatorToggle = (id) => {
        setFormData(prev => {
            const current = prev.fasilitator_ids || [];
            const isSelected = current.includes(id);
            const updated = isSelected 
                ? current.filter(item => item !== id)
                : [...current, id];
            return { ...prev, fasilitator_ids: updated };
        });
    };

    // Auto-prune invalid fasilitators ketika filter berubah — pakai useEffect agar tidak crash
    const validFasilitatorIds = useMemo(() => filteredFasilitators.map(f => f.id_user), [filteredFasilitators]);
    useEffect(() => {
        setFormData(prev => {
            const pruned = prev.fasilitator_ids.filter(id => validFasilitatorIds.includes(id));
            if (pruned.length === prev.fasilitator_ids.length) return prev; // tidak ada perubahan
            return { ...prev, fasilitator_ids: pruned };
        });
    }, [validFasilitatorIds]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
            setFormData({ ...formData, pj_foto: e.target.files[0] });
        }
    };

    if (!isOpen) return null;

    const handleNext = async () => {
        if (currentStep < 2) {
            // Validation step 1
            if (!formData.name) {
                Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Nama grup dampingan wajib diisi.', confirmButtonColor: '#0080C5' });
                return;
            }
            if (!formData.level_dampingan) {
                Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Jenis grup dampingan wajib diisi.', confirmButtonColor: '#0080C5' });
                return;
            }
            if (!formData.bidang_ids || formData.bidang_ids.length === 0) {
                Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Bidang grup dampingan wajib diisi.', confirmButtonColor: '#0080C5' });
                return;
            }
            if (!formData.kode_prov) {
                Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Wilayah provinsi wajib diisi.', confirmButtonColor: '#0080C5' });
                return;
            }
            if (formData.level_dampingan === 'kabupaten' && !formData.kode_kab) {
                Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Wilayah kabupaten wajib diisi untuk jenis Kabupaten.', confirmButtonColor: '#0080C5' });
                return;
            }
            if (formData.level_dampingan === 'kecamatan' && (!formData.kode_kab || !formData.kode_kec)) {
                Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Wilayah kabupaten dan kecamatan wajib diisi untuk jenis Kecamatan.', confirmButtonColor: '#0080C5' });
                return;
            }
            setCurrentStep(currentStep + 1);
        } else {
            // Validation step 2
            if (!formData.pj_nama || !formData.pj_username || !formData.pj_password || !formData.pj_no_telp) {
                Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Mohon lengkapi data PJ Dampingan.', confirmButtonColor: '#0080C5' });
                return;
            }

            if (pjUsernameStatus === 'taken') {
                Swal.fire({ icon: 'error', title: 'Username sudah digunakan', confirmButtonColor: '#0080C5' });
                return;
            }

            setIsLoading(true);
            try {
                // TAHAP 1: Buat PJ Dampingan Terlebih Dahulu
                const pjForm = new FormData();
                pjForm.append('name', formData.pj_nama);
                pjForm.append('username', formData.pj_username);
                pjForm.append('password', formData.pj_password);
                pjForm.append('no_telp', formData.pj_no_telp);
                if (formData.pj_foto) pjForm.append('foto', formData.pj_foto);
                pjForm.append('kode_prov', formData.kode_prov);
                if (formData.kode_kab) pjForm.append('kode_kab', formData.kode_kab);
                if (formData.kode_kec) pjForm.append('kode_kec', formData.kode_kec);

                const pjResponse = await pjGrupService.create(pjForm);
                const newPjId = pjResponse.data.id_user;

                // TAHAP 2: Buat Grup Dampingan dengan ID PJ yang baru dibuat
                const grupForm = new FormData();
                grupForm.append('name', formData.name);
                grupForm.append('level_dampingan', formData.level_dampingan);
                if (formData.bidang_ids.length > 0) {
                    formData.bidang_ids.forEach(id => grupForm.append('bidang_ids[]', id));
                }
                grupForm.append('kode_prov', formData.kode_prov);
                if (formData.kode_kab) grupForm.append('kode_kab', formData.kode_kab);
                if (formData.kode_kec) grupForm.append('kode_kec', formData.kode_kec);
                grupForm.append('pengurus_id', newPjId);
                
                if (formData.fasilitator_ids.length > 0) {
                    formData.fasilitator_ids.forEach(id => grupForm.append('fasilitator_ids[]', id));
                }

                createGrupDampingan.mutate(grupForm, {
                    onSuccess: () => {
                        setIsLoading(false);
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Data Grup & PJ Dampingan berhasil ditambahkan.',
                            icon: 'success',
                            confirmButtonColor: '#0080C5',
                            timer: 2000,
                            showConfirmButton: false,
                            customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                        });
                        onClose();
                        setCurrentStep(1);
                        setFormData({
                            name: '', level_dampingan: '', bidang_ids: [], kode_prov: '', kode_kab: '', kode_kec: '', fasilitator_ids: [],
                            pj_nama: '', pj_no_telp: '', pj_username: '', pj_password: '', pj_foto: null
                        });
                        setSelectedImage(null);
                    },
                    onError: (err) => {
                        setIsLoading(false);
                        const msg = err.response?.data?.message || 'Terjadi kesalahan saat menambahkan grup dampingan.';
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal!',
                            text: msg,
                            showConfirmButton: false,
                            timer: 2000,
                            customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                        });
                    }
                });
            } catch (error) {
                setIsLoading(false);
                const msg = error.response?.data?.message || 'Gagal membuat user PJ Dampingan.';
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: msg,
                    showConfirmButton: false,
                    timer: 2000,
                    customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                });
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
        else onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[640px] bg-white rounded-2xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.30)] overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="h-20 px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0080C5]/10 rounded-full flex items-center justify-center text-[#0080C5]">
                            <Users size={20} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-neutral-950 text-base font-bold leading-tight">
                                {currentStep === 1 ? 'Tambah Grup Dampingan' : 'Tambah Data PJ Dampingan'}
                            </h3>
                            <p className="text-slate-400 text-xs font-normal mt-0.5">
                                {currentStep === 1 ? 'Lengkapi seluruh data grup dampingan' : 'Lengkapi seluruh data PJ Dampingan'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 p-2 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Stepper Indication */}
                <div className="h-14 px-6 bg-slate-50 border-b border-gray-100 flex items-center gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep > 1 ? 'bg-emerald-500 text-white' : currentStep === 1 ? 'bg-[#0080C5] text-white' : 'bg-gray-200 text-slate-400'}`}>
                            {currentStep > 1 ? <Check size={14} strokeWidth={3} /> : '1'}
                        </div>
                        <span className={`text-xs font-semibold ${currentStep > 1 ? 'text-emerald-500' : currentStep === 1 ? 'text-[#0080C5]' : 'text-slate-400'}`}>Data Grup</span>
                    </div>
                    <div className={`flex-1 h-[1.5px] transition-colors ${currentStep > 1 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                    <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === 2 ? 'bg-[#0080C5] text-white' : 'bg-gray-200 text-slate-400'}`}>
                            2
                        </div>
                        <span className={`text-xs font-semibold ${currentStep === 2 ? 'text-[#0080C5]' : 'text-slate-400'}`}>PJ Dampingan</span>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-5 max-h-[480px] overflow-y-auto space-y-3 custom-scrollbar">
                    {currentStep === 1 ? (
                        <>
                            <div className="space-y-1.5 text-left">
                                <label className="text-slate-950 text-xs font-semibold leading-5">Nama Grup Dampingan</label>
                                <input 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    type="text" 
                                    placeholder="Masukkan nama grup dampingan"
                                    className="w-full h-11 px-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Jenis Grup Dampingan <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <select name="level_dampingan" value={formData.level_dampingan} onChange={handleLevelChange} className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                            <option value="">Pilih Jenis</option>
                                            {availableLevels.map(lvl => (
                                                <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Bidang Grup Dampingan (Bisa pilih &gt; 1) <span className="text-red-500">*</span></label>
                                    <div className="border-2 border-gray-100 rounded-[10px] p-2.5 max-h-[110px] overflow-y-auto space-y-1 bg-white custom-scrollbar">
                                        {bidangs.map(b => {
                                            const isChecked = formData.bidang_ids?.includes(b.id_bidang);
                                            return (
                                                <label key={b.id_bidang} className="flex items-center gap-2.5 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-all border border-transparent hover:border-slate-100 select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked || false}
                                                        onChange={() => handleBidangToggle(b.id_bidang)}
                                                        className="w-3.5 h-3.5 text-[#0080C5] border-slate-300 rounded focus:ring-[#0080C5] cursor-pointer"
                                                    />
                                                    <span className="text-slate-900 text-xs font-medium">{b.name}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Provinsi <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <select name="kode_prov" value={formData.kode_prov} onChange={handleChange} className={selectClassName(isProvDisabled)} disabled={isProvDisabled}>
                                            <option value="">Pilih Provinsi</option>
                                            {provinsiList.map(p => (
                                                <option key={p.kode} value={p.kode}>{p.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Kabupaten <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <select name="kode_kab" value={formData.kode_kab} onChange={handleChange} className={selectClassName(isKabDisabled)} disabled={isKabDisabled}>
                                            <option value="">Pilih Kabupaten</option>
                                            {kabupatenList.map(k => (
                                                <option key={k.kode} value={k.kode}>{k.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5 text-left">
                                <label className="text-slate-950 text-xs font-semibold leading-5">Kecamatan</label>
                                <div className="relative group">
                                    <select name="kode_kec" value={formData.kode_kec} onChange={handleChange} className={selectClassName(isKecDisabled)} disabled={isKecDisabled}>
                                        <option value="">Pilih kecamatan...</option>
                                        {kecamatanList.map(k => (
                                            <option key={k.kode} value={k.kode}>{k.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="space-y-2 text-left">
                                <label className="text-slate-950 text-xs font-semibold leading-5">Fasilitator Dampingan (Bisa pilih lebih dari 1)</label>
                                {formData.bidang_ids.length === 0 || !formData.kode_prov ? (
                                    <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                                        <span className="text-slate-400 text-xs">Pilih setidaknya satu bidang dan provinsi terlebih dahulu</span>
                                    </div>
                                ) : filteredFasilitators.length === 0 ? (
                                    <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                                        <span className="text-slate-400 text-xs">Tidak ada fasilitator yang cocok dengan bidang & wilayah terpilih</span>
                                    </div>
                                ) : (
                                    <div className="border-2 border-gray-100 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1 bg-white custom-scrollbar">
                                        {filteredFasilitators.map(f => {
                                            const isChecked = formData.fasilitator_ids.includes(f.id_user);
                                            return (
                                                <label key={f.id_user} className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-all border border-transparent hover:border-slate-100">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleFasilitatorToggle(f.id_user)}
                                                        className="w-4 h-4 text-[#0080C5] border-slate-300 rounded focus:ring-[#0080C5] cursor-pointer"
                                                    />
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-slate-900 text-xs font-semibold">{f.name}</span>
                                                        <span className="text-slate-400 text-[10px]">
                                                            {[f.provinsi?.name, f.kabupaten?.name, f.kecamatan?.name].filter(Boolean).join(', ') || 'Semua Wilayah'}
                                                        </span>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="space-y-3 animate-in slide-in-from-right-4 duration-300">
                            <div className="w-full p-4 bg-slate-50 rounded-xl border border-gray-200 flex items-center gap-5">
                                <label className="w-10 h-10 bg-white rounded-full border-2 border-[#0080C5] border-dashed flex items-center justify-center text-[#0080C5] overflow-hidden relative group cursor-pointer">
                                    {selectedImage ? (
                                        <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={20} />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <Upload size={16} />
                                    </div>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                                <div className="flex-1 text-left">
                                    <h4 className="text-slate-950 text-xs font-semibold">Foto Profil</h4>
                                    <p className="text-slate-400 text-[10px] font-normal leading-4 mt-0.5">Format JPG, PNG, atau GIF. Maks. 2 MB.</p>
                                    <label className="mt-2 h-7 px-3 w-max bg-[#0080C5] text-white rounded-md flex items-center gap-1.5 hover:bg-sky-700 transition-all cursor-pointer">
                                        <Upload size={12} />
                                        <span className="text-[10px] font-semibold">Unggah Foto</span>
                                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Nama Lengkap</label>
                                    <input 
                                        name="pj_nama"
                                        value={formData.pj_nama}
                                        onChange={handleChange}
                                        type="text" 
                                        placeholder="Masukkan nama lengkap"
                                        className="w-full h-11 px-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">No. Telepon</label>
                                    <input 
                                        name="pj_no_telp"
                                        value={formData.pj_no_telp}
                                        onChange={handleChange}
                                        type="text" 
                                        placeholder="8xxxxxxxxx"
                                        className="w-full h-11 px-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Username</label>
                                    <input 
                                        name="pj_username"
                                        value={formData.pj_username}
                                        onChange={handleChange}
                                        type="text" 
                                        placeholder="Masukkan username"
                                        className="w-full h-11 px-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all font-medium"
                                    />
                                    <UsernameHint username={formData.pj_username} />
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Password</label>
                                    <div className="relative">
                                        <input 
                                            name="pj_password"
                                            value={formData.pj_password}
                                            onChange={handleChange}
                                            type={showPassword ? "text" : "password"} 
                                            placeholder="••••••••"
                                            className="w-full h-11 px-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all font-medium"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-[#0080C5] transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="h-20 px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                    <div className="px-3 py-1.5 bg-[#0080C5]/10 rounded-full">
                        <span className="text-[#0080C5] text-[10px] font-bold">Langkah {currentStep} dari 2</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleBack}
                            className="px-6 h-10 bg-white border border-gray-200 rounded-[10px] text-slate-400 text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-1.5"
                        >
                            <ChevronLeft size={14} />
                            <span>{currentStep === 1 ? 'Batal' : 'Kembali'}</span>
                        </button>
                        <button 
                            onClick={handleNext}
                            disabled={isLoading}
                            className="h-9 px-5 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold disabled:opacity-50"
                        >
                            {isLoading && currentStep === 2 ? <Loader2 size={16} className="animate-spin" /> : null}
                            <span>{currentStep === 1 ? 'Selanjutnya' : isLoading ? 'Menyimpan...' : 'Simpan Data'}</span>
                            {currentStep === 1 && !isLoading ? <ChevronRight size={14} /> : (!isLoading ? <Save size={16} /> : null)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddGrupModal;

