import React, { useState } from 'react';
import { 
    X, 
    Upload, 
    Calendar, 
    ChevronDown, 
    UserPlus,
    Camera,
    Save,
    Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useAnggotaMutations } from '../../hooks/mutations/useAnggotaMutation';

const AddDampinganModal = ({ isOpen, onClose }) => {
    const { createAnggota } = useAnggotaMutations();
    const [isLoading, setIsLoading] = useState(false);
    const [gender, setGender] = useState('Laki-laki');
    const [status, setStatus] = useState('Aktif');
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
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== '') {
                form.append(key, formData[key]);
            }
        });
        form.append('jenis_kelamin', gender);
        form.append('status_aktif', status === 'Aktif' ? 1 : 0);

        createAnggota.mutate(form, {
            onSuccess: () => {
                setIsLoading(false);
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Data masyarakat berhasil ditambahkan.',
                    icon: 'success',
                    confirmButtonColor: '#0080C5',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                });
                onClose();
                setFormData({
                    nama: '', no_telepon: '', tempat_lahir: '', tanggal_lahir: '', agama: '',
                    pekerjaan: '', alamat: '', bidang_id: '', grup_dampingan_id: '', foto: null
                });
                setSelectedImage(null);
            },
            onError: () => {
                setIsLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Terjadi kesalahan saat menambahkan data masyarakat.',
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
            <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="h-20 px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0080C5]/10 rounded-full flex items-center justify-center text-[#0080C5]">
                            <UserPlus size={20} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-neutral-950 text-base font-bold leading-tight">Tambah Data Dampingan</h3>
                            <p className="text-slate-400 text-xs font-normal mt-0.5">Lengkapi seluruh data masyarakat</p>
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
                        <label className="w-16 h-16 rounded-full border-2 border-dashed border-[#0080C5] bg-slate-50 flex items-center justify-center text-[#0080C5] relative overflow-hidden cursor-pointer">
                            {selectedImage ? (
                                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <UserPlus size={24} />
                            )}
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                        <div className="space-y-1.5">
                            <label className="px-4 py-2 w-max bg-white border border-[#0080C5] border-dashed rounded-[10px] text-[#0080C5] text-xs font-bold flex items-center gap-2 hover:bg-[#0080C5]/10 transition-all cursor-pointer">
                                <Upload size={16} />
                                Upload Foto
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
                                placeholder="Masukkan nama lengkap"
                                className="w-full h-11 px-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">No. Telepon</label>
                            <input 
                                name="no_telepon"
                                value={formData.no_telepon}
                                onChange={handleChange}
                                type="text" 
                                placeholder="08xxxxxxxxxx"
                                className="w-full h-11 px-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
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
                                placeholder="Masukkan tempat lahir"
                                className="w-full h-11 px-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
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
                                    className="w-full h-11 px-4 pr-10 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
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
                                    onClick={() => setGender('Laki-laki')}
                                    className={`flex-1 h-11 px-3.5 rounded-[10px] border flex items-center gap-2 transition-all ${gender === 'Laki-laki' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-200 text-slate-400'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-[5px] flex items-center justify-center ${gender === 'Laki-laki' ? 'border-[#0080C5]' : 'border-gray-200'}`}>
                                    </div>
                                    <span className="text-xs font-semibold">Laki-laki</span>
                                </button>
                                <button 
                                    onClick={() => setGender('Perempuan')}
                                    className={`flex-1 h-11 px-3.5 rounded-[10px] border flex items-center gap-2 transition-all ${gender === 'Perempuan' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-200 text-slate-400'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-[5px] flex items-center justify-center ${gender === 'Perempuan' ? 'border-[#0080C5]' : 'border-gray-200'}`}>
                                    </div>
                                    <span className="text-xs font-semibold">Perempuan</span>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Agama</label>
                            <div className="relative group">
                                <select name="agama" value={formData.agama} onChange={handleChange} className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border border-gray-200 appearance-none text-slate-400 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                    <option value="" disabled>Pilih agama...</option>
                                    <option value="islam">Islam</option>
                                    <option value="kristen">Kristen</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Pekerjaan & Status Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Pekerjaan Utama</label>
                            <input 
                                name="pekerjaan"
                                value={formData.pekerjaan}
                                onChange={handleChange}
                                type="text" 
                                placeholder="Masukkan pekerjaan utama"
                                className="w-full h-11 px-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Status</label>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setStatus('Aktif')}
                                    className={`flex-1 h-11 px-3.5 rounded-[10px] border flex items-center gap-2 transition-all ${status === 'Aktif' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-200 text-slate-400'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-[5px] flex items-center justify-center ${status === 'Aktif' ? 'border-[#0080C5]' : 'border-gray-200'}`}>
                                    </div>
                                    <span className="text-xs font-semibold">Aktif</span>
                                </button>
                                <button 
                                    onClick={() => setStatus('Non-Aktif')}
                                    className={`flex-1 h-11 px-3.5 rounded-[10px] border flex items-center gap-2 transition-all ${status === 'Non-Aktif' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-200 text-slate-400'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-[5px] flex items-center justify-center ${status === 'Non-Aktif' ? 'border-gray-200' : 'border-gray-200'}`}>
                                    </div>
                                    <span className="text-xs font-semibold">Non-Aktif</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Alamat Full Width */}
                    <div className="space-y-1.5">
                        <label className="text-slate-950 text-xs font-semibold leading-5">Alamat</label>
                        <textarea 
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            placeholder="Masukkan alamat lengkap..."
                            className="w-full h-24 p-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all resize-none"
                        ></textarea>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Bidang & Grup Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Bidang Dampingan</label>
                            <div className="relative group">
                                <select name="bidang_id" value={formData.bidang_id} onChange={handleChange} className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border border-gray-200 appearance-none text-slate-400 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                    <option value="" disabled>Pilih bidang dampingan...</option>
                                    <option value="1">Pertanian</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Grup Dampingan</label>
                            <div className="relative group">
                                <select name="grup_dampingan_id" value={formData.grup_dampingan_id} onChange={handleChange} className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border border-gray-200 appearance-none text-slate-400 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                    <option value="" disabled>Pilih grup dampingan...</option>
                                    <option value="1">Kelompok Tani</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                            </div>
                        </div>
                    </div>
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
                        <span>{isLoading ? 'Mengajukan...' : 'Ajukan Data'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddDampinganModal;
