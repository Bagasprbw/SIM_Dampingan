import React, { useState, useEffect } from 'react';
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
import { usePjGrups } from '../../hooks/queries/usePjGrupQuery';
import { useProvinsi, useKabupaten, useKecamatan } from '../../hooks/queries/useWilayahQuery';
import { useFasilitators } from '../../hooks/queries/useFasilitatorQuery';

const EditGrupModal = ({ isOpen, onClose, data }) => {
    const { data: bidangsData } = useBidangs();
    const bidangs = bidangsData?.data || [];
    
    const { data: pjData } = usePjGrups();
    const pjOptions = pjData?.data || [];

    const { data: fasilitatorData } = useFasilitators();
    const fasilitatorOptions = fasilitatorData?.data || [];

    const { updateGrupDampingan } = useGrupDampinganMutations();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        level_dampingan: '',
        bidang_id: '',
        kode_prov: '',
        kode_kab: '',
        kode_kec: '',
        pengurus_id: ''
    });

    const { data: provinsiList = [], isLoading: loadingProv } = useProvinsi();
    const { data: kabupatenList = [], isLoading: loadingKab } = useKabupaten(formData.kode_prov);
    const { data: kecamatanList = [], isLoading: loadingKec } = useKecamatan(formData.kode_kab);

    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || '',
                level_dampingan: data.level_dampingan || '',
                bidang_id: data.bidang_id || '',
                kode_prov: data.kode_prov || '',
                kode_kab: data.kode_kab || '',
                kode_kec: data.kode_kec || '',
                pengurus_id: data.pengurus_id || ''
            });
        }
    }, [data]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!isOpen) return null;

    const handleSave = () => {
        setIsLoading(true);
        updateGrupDampingan.mutate({ id: data.id_grup_dampingan || data.id, data: formData }, {
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
            onError: () => {
                setIsLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Terjadi kesalahan saat memperbarui grup dampingan.',
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
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
                        <div className="space-y-1.5">
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

                    {/* Kecamatan */}
                    <div className="space-y-1.5">
                        <label className="text-slate-950 text-xs font-semibold leading-5">Kecamatan</label>
                        <div className="relative group">
                            <select name="kode_kec" value={formData.kode_kec} onChange={handleChange} className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer" disabled={!formData.kode_kab}>
                                <option value="">Pilih Kecamatan</option>
                                {kecamatanList.map(k => (
                                    <option key={k.kode} value={k.kode}>{k.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* PJ Dampingan Section */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">PJ Dampingan</label>
                            <span className="text-slate-400 text-[10px] font-normal">(hanya satu)</span>
                        </div>
                        <div className="relative group">
                            <select name="pengurus_id" value={formData.pengurus_id} onChange={handleChange} className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                <option value="">Pilih PJ</option>
                                {pjOptions.map(p => (
                                    <option key={p.id_user} value={p.id_user}>{p.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                        </div>
                        <p className="text-slate-400 text-[10px] font-normal flex items-start gap-1 mt-1">
                            <span className="text-[#0080C5]">*</span>
                            Hanya dapat memilih satu PJ Dampingan per grup.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="h-20 px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
                    <button 
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

