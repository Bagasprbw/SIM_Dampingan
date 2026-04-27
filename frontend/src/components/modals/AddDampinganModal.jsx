import React, { useState } from 'react';
import { 
    X, 
    Upload, 
    Calendar, 
    ChevronDown, 
    UserPlus,
    Camera
} from 'lucide-react';
import Swal from 'sweetalert2';

const AddDampinganModal = ({ isOpen, onClose }) => {
    const [gender, setGender] = useState('Laki-laki');
    const [status, setStatus] = useState('Aktif');

    if (!isOpen) return null;

    const handleSave = () => {
        Swal.fire({
            title: 'Berhasil!',
            text: 'Data masyarakat berhasil ditambahkan.',
            icon: 'success',
            confirmButtonColor: '#0080C5',
            timer: 2000,
            showConfirmButton: false,
            customClass: {
                popup: 'rounded-2xl font-["Poppins"]',
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[580px] bg-white rounded-2xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden animate-in fade-in zoom-in duration-200">
                
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
                <div className="p-6 max-h-[600px] overflow-y-auto space-y-5 custom-scrollbar text-left">
                    
                    {/* Photo Upload Section */}
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#0080C5] bg-slate-50 flex items-center justify-center text-slate-400 relative">
                            <Camera size={24} />
                        </div>
                        <div className="space-y-1.5">
                            <button className="px-4 py-2 bg-[#0080C5]/5 border-2 border-[#0080C5] rounded-[10px] text-[#0080C5] text-xs font-bold flex items-center gap-2 hover:bg-[#0080C5]/10 transition-all">
                                <Upload size={14} />
                                Upload Foto
                            </button>
                            <p className="text-slate-400 text-[10px] font-normal tracking-tight">Format: JPG, PNG. Maks. 2 MB</p>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Nama & No Telp Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Nama <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                placeholder="Masukkan nama lengkap"
                                className="w-full h-11 px-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">No. Telp <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                placeholder="Contoh: 08xxxxxxxxxx"
                                className="w-full h-11 px-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
                            />
                        </div>
                    </div>

                    {/* Tempat & Tanggal Lahir Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Tempat Lahir</label>
                            <input 
                                type="text" 
                                placeholder="Masukkan tempat lahir.."
                                className="w-full h-11 px-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Tanggal Lahir</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Masukkan Tanggal lahir.."
                                    className="w-full h-11 px-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
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
                                    className={`flex-1 h-11 px-3.5 rounded-[10px] border-2 flex items-center gap-2 transition-all ${gender === 'Laki-laki' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-100 text-slate-400'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${gender === 'Laki-laki' ? 'border-[#0080C5]' : 'border-gray-200'}`}>
                                        {gender === 'Laki-laki' && <div className="w-2 h-2 bg-[#0080C5] rounded-full"></div>}
                                    </div>
                                    <span className="text-xs font-semibold">Laki-laki</span>
                                </button>
                                <button 
                                    onClick={() => setGender('Perempuan')}
                                    className={`flex-1 h-11 px-3.5 rounded-[10px] border-2 flex items-center gap-2 transition-all ${gender === 'Perempuan' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-100 text-slate-400'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${gender === 'Perempuan' ? 'border-[#0080C5]' : 'border-gray-200'}`}>
                                        {gender === 'Perempuan' && <div className="w-2 h-2 bg-[#0080C5] rounded-full"></div>}
                                    </div>
                                    <span className="text-xs font-semibold">Perempuan</span>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Agama</label>
                            <div className="relative group">
                                <select defaultValue="" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-400 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                    <option value="" disabled>Pilih Agama..</option>
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
                            <div className="relative group">
                                <select defaultValue="" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-400 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                    <option value="" disabled>Pilih Pekerjaan Utama..</option>
                                    <option value="petani">Petani</option>
                                    <option value="buruh">Buruh</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Status</label>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setStatus('Aktif')}
                                    className={`flex-1 h-11 px-3.5 rounded-[10px] border-2 flex items-center gap-2 transition-all ${status === 'Aktif' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-100 text-slate-400'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${status === 'Aktif' ? 'border-[#0080C5]' : 'border-gray-200'}`}>
                                        {status === 'Aktif' && <div className="w-2 h-2 bg-[#0080C5] rounded-full"></div>}
                                    </div>
                                    <span className="text-xs font-semibold">Aktif</span>
                                </button>
                                <button 
                                    onClick={() => setStatus('Non-Aktif')}
                                    className={`flex-1 h-11 px-3.5 rounded-[10px] border-2 flex items-center gap-2 transition-all ${status === 'Non-Aktif' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-100 text-slate-400'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${status === 'Non-Aktif' ? 'border-gray-200' : 'border-gray-200'}`}>
                                        {status === 'Non-Aktif' && <div className="w-2 h-2 bg-[#0080C5] rounded-full"></div>}
                                    </div>
                                    <span className="text-xs font-semibold">Non-Aktif</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Alamat Full Width */}
                    <div className="space-y-1.5">
                        <label className="text-slate-950 text-xs font-semibold leading-5">Alamat <span className="text-red-500">*</span></label>
                        <textarea 
                            placeholder="Masukkan alamat lengkap"
                            className="w-full h-28 p-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all resize-none"
                        ></textarea>
                    </div>

                    {/* Bidang & Grup Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Bidang Dampingan</label>
                            <div className="relative group">
                                <select defaultValue="" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-400 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                    <option value="" disabled>Pilih Bidang Dampingan..</option>
                                    <option value="1">Opsi 1</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Grup Dampingan</label>
                            <div className="relative group">
                                <select defaultValue="" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-400 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                    <option value="" disabled>Pilih Grup Dampingan..</option>
                                    <option value="1">Opsi 1</option>
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
                        className="px-6 h-10 bg-white border border-gray-200 rounded-[10px] text-slate-400 text-xs font-semibold hover:bg-slate-50 transition-all"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-8 h-10 bg-[#0080C5] text-white rounded-[10px] text-xs font-semibold hover:bg-sky-700 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Upload size={14} />
                        <span>Simpan Data</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddDampinganModal;
