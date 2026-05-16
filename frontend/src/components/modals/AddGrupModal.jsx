import React, { useState } from 'react';
import { X, Users, ChevronDown, Plus, Check, User, Upload, Eye, EyeOff, Save, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { useGrupDampinganMutations } from '../../hooks/mutations/useGrupDampinganMutation';
import { useBidangs } from '../../hooks/queries/useBidangQuery';
import { useProvinsi, useKabupaten, useKecamatan } from '../../hooks/queries/useWilayahQuery';
import { useFasilitators } from '../../hooks/queries/useFasilitatorQuery';

import { pjGrupService } from '../../services/pjGrupService';

const AddGrupModal = ({ isOpen, onClose }) => {
    const { data: bidangsData } = useBidangs();
    const bidangs = bidangsData?.data || [];
    
    const { data: fasilitatorData } = useFasilitators();
    const fasilitatorOptions = fasilitatorData?.data || [];

    const { createGrupDampingan } = useGrupDampinganMutations();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        level_dampingan: '',
        bidang_id: '',
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

    const { data: provinsiList = [] } = useProvinsi();
    const { data: kabupatenList = [] } = useKabupaten(formData.kode_prov);
    const { data: kecamatanList = [] } = useKecamatan(formData.kode_kab);

    const [selectedImage, setSelectedImage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
            setFormData({ ...formData, pj_foto: e.target.files[0] });
        }
    };

    if (!isOpen) return null;

    const handleNext = async () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        } else {
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
                pjForm.append('kode_kab', formData.kode_kab);
                if (formData.kode_kec) pjForm.append('kode_kec', formData.kode_kec);

                const pjResponse = await pjGrupService.create(pjForm);
                const newPjId = pjResponse.data.id_user;

                // TAHAP 2: Buat Grup Dampingan dengan ID PJ yang baru dibuat
                const grupForm = new FormData();
                grupForm.append('name', formData.name);
                grupForm.append('level_dampingan', formData.level_dampingan);
                grupForm.append('bidang_id', formData.bidang_id);
                grupForm.append('kode_prov', formData.kode_prov);
                grupForm.append('kode_kab', formData.kode_kab);
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
                            name: '', level_dampingan: '', bidang_id: '', kode_prov: '', kode_kab: '', kode_kec: '', fasilitator_ids: [],
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Jenis Grup Dampingan <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <select name="level_dampingan" value={formData.level_dampingan} onChange={handleChange} className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                            <option value="">Pilih Jenis</option>
                                            <option value="pusat">Pusat</option>
                                            <option value="provinsi">Provinsi</option>
                                            <option value="kabupaten">Kabupaten</option>
                                            <option value="kecamatan">Kecamatan</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Bidang Grup Dampingan <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <select name="bidang_id" value={formData.bidang_id} onChange={handleChange} className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                            <option value="">Pilih Bidang</option>
                                            {bidangs.map(b => (
                                                <option key={b.id_bidang} value={b.id_bidang}>{b.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Provinsi <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <select name="kode_prov" value={formData.kode_prov} onChange={handleChange} className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
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
                                        <select name="kode_kab" value={formData.kode_kab} onChange={handleChange} className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer" disabled={!formData.kode_prov}>
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
                                    <select name="kode_kec" value={formData.kode_kec} onChange={handleChange} className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer" disabled={!formData.kode_kab}>
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
                                <div className="flex items-center justify-between">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Fasilitator</label>
                                    <button type="button" className="px-3 py-1.5 bg-[#0080C5]/10 rounded-lg flex items-center gap-1.5 text-[#0080C5] hover:bg-[#0080C5]/20 transition-all">
                                        <Plus size={12} strokeWidth={3} />
                                        <span className="text-[10px] font-bold">Tambah Fasilitator</span>
                                    </button>
                                </div>
                                <div className="relative group">
                                    <select 
                                        name="fasilitator_ids" 
                                        value={formData.fasilitator_ids[0] || ''} 
                                        onChange={(e) => setFormData({...formData, fasilitator_ids: [e.target.value]})} 
                                        className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer"
                                    >
                                        <option value="">Pilih Fasilitator...</option>
                                        {fasilitatorOptions.map(f => (
                                            <option key={f.id_user} value={f.id_user}>{f.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                </div>
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

                            <div className="grid grid-cols-2 gap-4">
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

                            <div className="grid grid-cols-2 gap-4">
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

