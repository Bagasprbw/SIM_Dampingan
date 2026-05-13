import React, { useState, useEffect } from 'react';
import { 
    X, 
    Upload, 
    Calendar, 
    ChevronDown, 
    Edit,
    User,
    Save,
    Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useAnggotaMutations } from '../../hooks/mutations/useAnggotaMutation';
import { usePengajuanAnggotaMutations } from '../../hooks/mutations/usePengajuanAnggotaMutation';
import { useBidangs, usePekerjaans } from '../../hooks/queries/useMasterQuery';
import { useGrupDampingans } from '../../hooks/queries/useGrupDampinganQuery';

const EditDampinganModal = ({ isOpen, onClose, data, isPengajuan = false }) => {
    const { updateAnggota } = useAnggotaMutations();
    const { updatePengajuanAnggota } = usePengajuanAnggotaMutations();
    
    const { data: bidangsData } = useBidangs();
    const { data: pekerjaansData } = usePekerjaans();
    const { data: grupsData } = useGrupDampingans();

    const bidangs = bidangsData?.data || [];
    const pekerjaans = pekerjaansData?.data || [];
    const grups = grupsData?.data || [];
    const [isLoading, setIsLoading] = useState(false);
    const [gender, setGender] = useState('P');
    const [status, setStatus] = useState('aktif');
    const [formData, setFormData] = useState({
        nama: '',
        no_telepon: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        agama: '',
        pekerjaan: '',
        alamat: '',
        bidang_id: '',
        grup_dampingan_id: '',
        foto: null
    });
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (data) {
            setGender(data.jenis_kelamin || 'P');
            setStatus(data.status || 'aktif');
            setFormData({
                nama: data.name || '',
                no_telepon: data.no_telp || '',
                tempat_lahir: data.tempat_lahir || '',
                tanggal_lahir: data.tgl_lahir ? new Date(data.tgl_lahir).toISOString().split('T')[0] : '',
                agama: data.agama || '',
                pekerjaan: data.pekerjaan_id || '',
                alamat: data.alamat || '',
                bidang_id: data.bidang_id || '',
                grup_dampingan_id: data.grup_id || '',
                foto: null
            });
            if (data.foto) {
                const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
                // Jika data.foto sudah berupa URL lengkap, gunakan langsung
                const imageUrl = data.foto.startsWith('http') ? data.foto : `${baseUrl}/storage/${data.foto}`;
                setSelectedImage(imageUrl);
            }
        }
    }, [data]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
            setFormData({ ...formData, foto: e.target.files[0] });
        }
    };

    if (!isOpen) return null;

    const handleSave = () => {
        setIsLoading(true);
        const form = new FormData();
        
        form.append('name', formData.nama);
        form.append('no_telp', formData.no_telepon);
        form.append('tempat_lahir', formData.tempat_lahir);
        form.append('tgl_lahir', formData.tanggal_lahir);
        form.append('agama', formData.agama);
        form.append('alamat', formData.alamat);
        form.append('bidang_id', formData.bidang_id);
        form.append('grup_id', formData.grup_dampingan_id);
        form.append('pekerjaan_id', formData.pekerjaan);
        form.append('jenis_kelamin', gender);
        
        if (!isPengajuan) {
            form.append('status', status);
        }

        if (formData.foto) {
            form.append('foto', formData.foto);
        }

        form.append('_method', 'PUT');

        const mutation = isPengajuan ? updatePengajuanAnggota : updateAnggota;

        mutation.mutate({ id: data.id_anggota_grup || data.id, data: form }, {
            onSuccess: () => {
                setIsLoading(false);
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Perubahan data masyarakat berhasil disimpan.',
                    icon: 'success',
                    confirmButtonColor: '#0080C5',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                });
                onClose();
            },
            onError: (error) => {
                setIsLoading(false);
                const errorMsg = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan perubahan.';
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: errorMsg,
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
            <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
                
                {/* Header */}
                <div className="h-20 px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#0080C5]">
                            <Edit size={20} />
                        </div>
                        <div>
                            <h3 className="text-neutral-950 text-base font-bold leading-tight">Edit Data Dampingan</h3>
                            <p className="text-slate-400 text-xs font-normal mt-0.5">Perbarui informasi data masyarakat</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 p-2 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5 custom-scrollbar text-left">
                    
                    {/* Photo Upload Section */}
                    <div className="flex items-center gap-5">
                        <label className="w-16 h-16 rounded-full border-2 border-[#0080C5] bg-slate-50 flex items-center justify-center text-[#0080C5] relative overflow-hidden cursor-pointer">
                            {selectedImage ? (
                                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User size={24} />
                            )}
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                        <div className="space-y-1.5">
                            <label className="px-4 py-2 w-max bg-white border border-[#0080C5] border-dashed rounded-[10px] text-[#0080C5] text-xs font-bold flex items-center gap-2 hover:bg-[#0080C5]/10 transition-all cursor-pointer">
                                <Upload size={16} />
                                Ganti Foto
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                            <p className="text-slate-400 text-[10px] font-normal tracking-tight">Format: JPG, PNG. Maks. 2 MB</p>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Nama & No Telp Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Nama Lengkap</label>
                            <input 
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                type="text" 
                                className="w-full h-11 px-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">No. Telepon</label>
                            <input 
                                name="no_telepon"
                                value={formData.no_telepon}
                                onChange={handleChange}
                                type="text" 
                                className="w-full h-11 px-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Tempat & Tanggal Lahir Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Tempat Lahir</label>
                            <input 
                                name="tempat_lahir"
                                value={formData.tempat_lahir}
                                onChange={handleChange}
                                type="text" 
                                className="w-full h-11 px-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Tanggal Lahir</label>
                            <div className="relative">
                                <input 
                                    name="tanggal_lahir"
                                    value={formData.tanggal_lahir}
                                    onChange={handleChange}
                                    type="date" 
                                    className="w-full h-11 px-4 pr-10 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Jenis Kelamin & Agama Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Jenis Kelamin</label>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setGender('L')}
                                    className={`flex-1 h-11 px-3.5 rounded-[10px] border flex items-center gap-2 transition-all ${gender === 'L' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-200 text-slate-400'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-[5px] flex items-center justify-center ${gender === 'L' ? 'border-[#0080C5]' : 'border-gray-200'}`}>
                                    </div>
                                    <span className="text-xs font-semibold">Laki-laki</span>
                                </button>
                                <button 
                                    onClick={() => setGender('P')}
                                    className={`flex-1 h-11 px-3.5 rounded-[10px] border flex items-center gap-2 transition-all ${gender === 'P' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-200 text-slate-400'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-[5px] flex items-center justify-center ${gender === 'P' ? 'border-[#0080C5]' : 'border-gray-200'}`}>
                                    </div>
                                    <span className="text-xs font-semibold">Perempuan</span>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Agama</label>
                            <div className="relative group">
                                <select name="agama" value={formData.agama} onChange={handleChange} className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border border-gray-200 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                    <option value="islam">Islam</option>
                                    <option value="kristen">Kristen</option>
                                    <option value="katolik">Katolik</option>
                                    <option value="hindu">Hindu</option>
                                    <option value="buddha">Buddha</option>
                                    <option value="konghucu">Konghucu</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Pekerjaan & Status Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Pekerjaan Utama</label>
                            <div className="relative group">
                                <select 
                                    name="pekerjaan" 
                                    value={formData.pekerjaan} 
                                    onChange={handleChange} 
                                    className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border border-gray-200 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer"
                                >
                                    <option value="" disabled>Pilih pekerjaan...</option>
                                    {pekerjaans.map(p => (
                                        <option key={p.id_pekerjaan} value={p.id_pekerjaan}>{p.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Status</label>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setStatus('aktif')}
                                    className={`flex-1 h-11 px-3.5 rounded-[10px] border flex items-center gap-2 transition-all ${status === 'aktif' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-200 text-slate-400'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-[5px] flex items-center justify-center ${status === 'aktif' ? 'border-[#0080C5]' : 'border-gray-200'}`}>
                                    </div>
                                    <span className="text-xs font-semibold">Aktif</span>
                                </button>
                                <button 
                                    onClick={() => setStatus('non-aktif')}
                                    className={`flex-1 h-11 px-3.5 rounded-[10px] border flex items-center gap-2 transition-all ${status === 'non-aktif' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-200 text-slate-400'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-[5px] flex items-center justify-center ${status === 'non-aktif' ? 'border-gray-200' : 'border-gray-200'}`}>
                                    </div>
                                    <span className="text-xs font-semibold">Non-Aktif</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Alamat Full Width */}
                    <div className="space-y-1.5 text-left">
                        <label className="text-slate-950 text-xs font-semibold leading-5">Alamat</label>
                        <textarea 
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            placeholder="Masukkan alamat lengkap..."
                            className="w-full h-24 p-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all resize-none font-medium leading-relaxed"
                        ></textarea>
                    </div>

                    <hr className="border-slate-100" />
                    
                    {/* Bidang & Grup Row */}
                    {!isPengajuan && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-slate-950 text-xs font-semibold leading-5">Bidang Dampingan</label>
                                <div className="relative group">
                                    <select name="bidang_id" value={formData.bidang_id} onChange={handleChange} className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border border-gray-200 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                        <option value="">Pilih Bidang</option>
                                        {bidangs.map(b => (
                                            <option key={b.id_bidang} value={b.id_bidang}>{b.nama_bidang}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-slate-950 text-xs font-semibold leading-5">Grup Dampingan</label>
                                <div className="relative group">
                                    <select name="grup_dampingan_id" value={formData.grup_dampingan_id} onChange={handleChange} className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border border-gray-200 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                        <option value="">Pilih Grup Dampingan</option>
                                        {grups.map(g => (
                                            <option key={g.id_grup_dampingan} value={g.id_grup_dampingan}>{g.nama_grup}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="h-20 px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
                    <button 
                        onClick={onClose}
                        className="px-6 h-10 bg-white border border-gray-200 rounded-[10px] text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-all"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="h-10 px-5 bg-[#0080C5] text-white rounded-[10px] flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-xs font-semibold disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        <span>{isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditDampinganModal;
