import React, { useState, useEffect, useMemo } from 'react';
import { 
    X, 
    ChevronDown, 
    Plus, 
    Edit, 
    Save,
    Info,
    Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useGrupDampinganMutations } from '../../hooks/mutations/useGrupDampinganMutation';
import { useBidangs } from '../../hooks/queries/useBidangQuery';
import { useProvinsi, useKabupaten, useKecamatan } from '../../hooks/queries/useWilayahQuery';
import { useFasilitators } from '../../hooks/queries/useFasilitatorQuery';
import { getUser } from '../../utils/storage';

const EditGrupModal = ({ isOpen, onClose, data }) => {
    const { data: bidangsData } = useBidangs();
    const bidangs = bidangsData?.data || [];
    
    const { data: fasilitatorData } = useFasilitators();

    const { updateGrupDampingan } = useGrupDampinganMutations();
    const [isLoading, setIsLoading] = useState(false);
    
    const currentUser = getUser();
    const currentUserRoleName = typeof currentUser?.role === 'object' && currentUser?.role !== null 
        ? currentUser.role.name 
        : currentUser?.role;

    const isProvinsiAdmin = currentUserRoleName?.toString().toLowerCase().includes('provinsi');
    const isKabupatenAdmin = currentUserRoleName?.toString().toLowerCase().includes('kabupaten');
    const isKecamatanAdmin = currentUserRoleName?.toString().toLowerCase().includes('kecamatan');

    const [formData, setFormData] = useState({
        name: '',
        level_dampingan: '',
        bidang_id: '',
        kode_prov: '',
        kode_kab: '',
        kode_kec: '',
        pengurus_id: '',
        fasilitator_ids: []
    });

    const { data: provinsiList = [] } = useProvinsi();
    const { data: kabupatenList = [] } = useKabupaten(formData.kode_prov);
    const { data: kecamatanList = [] } = useKecamatan(formData.kode_kab);

    useEffect(() => {
        if (data) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                name: data.name || '',
                level_dampingan: data.level_dampingan || '',
                bidang_id: data.bidang_id || '',
                kode_prov: data.kode_prov || '',
                kode_kab: data.kode_kab || '',
                kode_kec: data.kode_kec || '',
                pengurus_id: data.pengurus_id || '',
                fasilitator_ids: data.grup_fasilitators?.map(gf => gf.fasilitator_id || gf.fasilitator?.id_user).filter(Boolean) || []
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
        const fasilitatorOptions = fasilitatorData?.data || [];
        return fasilitatorOptions.filter(f => {
            // Must match selected Bidang
            const hasMatchingBidang = !formData.bidang_id || f.fasilitator_bidangs?.some(fb => 
                fb.bidang_id?.toString() === formData.bidang_id?.toString() || 
                fb.bidang?.id_bidang?.toString() === formData.bidang_id?.toString()
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
    }, [fasilitatorData, formData.bidang_id, formData.kode_prov, formData.kode_kab, formData.kode_kec]);

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

    const handleSave = () => {
        // Validation checks
        if (!formData.name) {
            Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Nama grup dampingan wajib diisi.', confirmButtonColor: '#0080C5' });
            return;
        }
        if (!formData.level_dampingan) {
            Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Jenis grup dampingan wajib diisi.', confirmButtonColor: '#0080C5' });
            return;
        }
        if (!formData.bidang_id) {
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

        // Prune any selected fasilitator IDs that are no longer valid under the current filters
        const validIds = filteredFasilitators.map(f => f.id_user);
        const prunedFasilitatorIds = (formData.fasilitator_ids || []).filter(id => validIds.includes(id));
        const submissionData = {
            ...formData,
            fasilitator_ids: prunedFasilitatorIds
        };

        setIsLoading(true);
        updateGrupDampingan.mutate({ id: data.id_grup_dampingan || data.id, data: submissionData }, {
            onSuccess: () => {
                setIsLoading(false);
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Perubahan data grup berhasil disimpan.',
                    icon: 'success',
                    confirmButtonColor: '#0080C5',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                });
                onClose();
            },
            onError: (err) => {
                setIsLoading(false);
                const msg = err.response?.data?.message || 'Terjadi kesalahan saat memperbarui grup dampingan.';
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
    };

    if (!isOpen) return null;

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
                <div className="p-5 max-h-[580px] overflow-y-auto space-y-3 custom-scrollbar text-left">
                    {/* Nama Grup */}
                    <div className="space-y-1.5">
                        <label className="text-slate-950 text-xs font-semibold leading-5">Nama Grup Dampingan</label>
                        <input 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text" 
                            className="w-full h-11 px-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all font-medium"
                        />
                    </div>

                    {/* Jenis & Bidang Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
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
                        <div className="space-y-1.5">
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

                    {/* Provinsi & Kabupaten Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
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
                        <div className="space-y-1.5">
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

                    {/* Kecamatan */}
                    <div className="space-y-1.5">
                        <label className="text-slate-950 text-xs font-semibold leading-5">Kecamatan</label>
                        <div className="relative group">
                            <select name="kode_kec" value={formData.kode_kec} onChange={handleChange} className={selectClassName(isKecDisabled)} disabled={isKecDisabled}>
                                <option value="">Pilih Kecamatan</option>
                                {kecamatanList.map(k => (
                                    <option key={k.kode} value={k.kode}>{k.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Fasilitator Dampingan Checkbox List */}
                    <div className="space-y-2">
                        <label className="text-slate-950 text-xs font-semibold leading-5">Fasilitator Dampingan (Bisa pilih lebih dari 1)</label>
                        {!formData.bidang_id || !formData.kode_prov ? (
                            <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                                <span className="text-slate-400 text-xs">Pilih bidang dan provinsi terlebih dahulu</span>
                            </div>
                        ) : filteredFasilitators.length === 0 ? (
                            <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                                <span className="text-slate-400 text-xs">Tidak ada fasilitator yang cocok dengan bidang & wilayah terpilih</span>
                            </div>
                        ) : (
                            <div className="border-2 border-gray-100 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1 bg-white custom-scrollbar">
                                {filteredFasilitators.map(f => {
                                    const isChecked = formData.fasilitator_ids?.includes(f.id_user);
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
                </div>

                {/* Footer */}
                <div className="h-20 px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="px-6 h-10 bg-white border border-gray-200 rounded-[10px] text-slate-400 text-xs font-semibold hover:bg-slate-50 transition-all"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="h-9 px-5 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        <span>{isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditGrupModal;

