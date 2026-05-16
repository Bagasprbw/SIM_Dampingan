import React, { useState } from 'react';
import { X, UserPlus, Image as ImageIcon, Plus, Eye, EyeOff, Save, ChevronDown, Upload, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useFasilitatorMutations } from '../../hooks/mutations/useFasilitatorMutation';
import { useBidangs } from '../../hooks/queries/useBidangQuery';
import { useProvinsi, useKabupaten, useKecamatan } from '../../hooks/queries/useWilayahQuery';

const AddFacilitatorModal = ({ isOpen, onClose }) => {
    // Fetch Bidang Dampingan
    const { data: bidangsData, isLoading: isLoadingBidangs } = useBidangs();
    const bidangs = bidangsData?.data || [];

    const { createFasilitator } = useFasilitatorMutations();
    const [isLoading, setIsLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        name: '', 
        no_telp: '', 
        bidang_id: '', 
        username: '', 
        password: '', 
        foto: null,
        kode_prov: '',
        kode_kab: '',
        kode_kec: ''
    });

    const { data: provinsiList = [] } = useProvinsi();
    const { data: kabupatenList = [] } = useKabupaten(formData.kode_prov);
    const { data: kecamatanList = [] } = useKecamatan(formData.kode_kab);

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

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
            setFormData({ ...formData, foto: e.target.files[0] });
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const form = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== '') {
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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-[550px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
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
                <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar text-left">
                    
                    {/* Foto Section */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[#0A0F1E] text-xs font-semibold">Foto Fasilitator</label>
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#0080C5] flex items-center justify-center overflow-hidden bg-slate-50">
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon size={20} className="text-slate-300" />
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#0080C5]/5 border-2 border-[#0080C5] border-dashed rounded-xl text-[#0080C5] hover:bg-[#0080C5]/10 transition-all">
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

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#0A0F1E] text-xs font-semibold">Bidang Dampingan <span className="text-red-500">*</span></label>
                        <div className="relative group">
                            <select name="bidang_id" value={formData.bidang_id} onChange={handleChange} className="w-full px-4 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none font-medium transition-all" required>
                                <option value="">Pilih Bidang</option>
                                {bidangs?.map((b) => (
                                    <option key={b.id_bidang} value={b.id_bidang}>{b.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" />
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Wilayah Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Provinsi <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <select name="kode_prov" value={formData.kode_prov} onChange={handleChange} className="w-full px-4 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none font-medium" required>
                                    <option value="">Pilih Provinsi</option>
                                    {provinsiList.map(p => (
                                        <option key={p.kode} value={p.kode}>{p.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#0A0F1E] text-xs font-semibold">Kabupaten <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <select name="kode_kab" value={formData.kode_kab} onChange={handleChange} className="w-full px-4 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none font-medium disabled:opacity-50" disabled={!formData.kode_prov} required>
                                    <option value="">Pilih Kabupaten</option>
                                    {kabupatenList.map(k => (
                                        <option key={k.kode} value={k.kode}>{k.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#0A0F1E] text-xs font-semibold">Kecamatan <span className="text-red-500">*</span></label>
                        <div className="relative group">
                            <select name="kode_kec" value={formData.kode_kec} onChange={handleChange} className="w-full px-4 py-2.5 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] appearance-none font-medium disabled:opacity-50" disabled={!formData.kode_kab} required>
                                <option value="">Pilih Kecamatan</option>
                                {kecamatanList.map(k => (
                                    <option key={k.kode} value={k.kode}>{k.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
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
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
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
