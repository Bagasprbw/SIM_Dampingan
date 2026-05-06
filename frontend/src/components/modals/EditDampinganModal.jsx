import React, { useState, useEffect } from 'react';
import { 
    X, 
    Upload, 
    Calendar, 
    ChevronDown, 
    Edit,
    User,
    Save
} from 'lucide-react';
import Swal from 'sweetalert2';

const EditDampinganModal = ({ isOpen, onClose, data }) => {
    const [gender, setGender] = useState('Perempuan');
    const [status, setStatus] = useState('Aktif');

    useEffect(() => {
        if (data) {
            setGender(data.gender || 'Perempuan');
            // Status default aktif untuk dummy
        }
    }, [data]);

    if (!isOpen) return null;

    const handleSave = () => {
        Swal.fire({
            title: 'Berhasil!',
            text: 'Perubahan data masyarakat berhasil disimpan.',
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
                        <div className="w-16 h-16 rounded-full border-2 border-[#0080C5] bg-slate-50 flex items-center justify-center text-slate-400 relative">
                            <User size={24} />
                        </div>
                        <div className="space-y-1.5">
                            <button className="px-4 py-2 bg-white border border-[#0080C5] border-dashed rounded-[10px] text-[#0080C5] text-xs font-bold flex items-center gap-2 hover:bg-[#0080C5]/10 transition-all">
                                <Upload size={16} />
                                Ganti Foto
                            </button>
                            <p className="text-slate-400 text-[10px] font-normal tracking-tight">Format: JPG, PNG. Maks. 2 MB</p>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Nama & No Telp Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Nama Lengkap</label>
                            <input 
                                type="text" 
                                defaultValue={data?.nama || "Siti Rahayu"}
                                className="w-full h-11 px-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">No. Telepon</label>
                            <input 
                                type="text" 
                                defaultValue="082345678901"
                                className="w-full h-11 px-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Tempat & Tanggal Lahir Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Tempat Lahir</label>
                            <input 
                                type="text" 
                                defaultValue="Bandung"
                                className="w-full h-11 px-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Tanggal Lahir</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    defaultValue="15 / 06 / 1995"
                                    className="w-full h-11 px-4 pr-10 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all font-medium"
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
                                <select defaultValue="islam" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border border-gray-200 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
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
                                type="text" 
                                defaultValue="Petani"
                                className="w-full h-11 px-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all font-medium"
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
                    <div className="space-y-1.5 text-left">
                        <label className="text-slate-950 text-xs font-semibold leading-5">Alamat</label>
                        <textarea 
                            placeholder="Masukkan alamat lengkap..."
                            className="w-full h-24 p-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-900 transition-all resize-none font-medium leading-relaxed"
                        ></textarea>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Bidang & Grup Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Bidang Dampingan</label>
                            <div className="relative group">
                                <select defaultValue="perekonomian" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border border-gray-200 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                    <option value="perekonomian">Perekonomian</option>
                                    <option value="1">Opsi 1</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Grup Dampingan</label>
                            <div className="relative group">
                                <select defaultValue="grup_sejahtera" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border border-gray-200 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                    <option value="grup_sejahtera">Grup Dampingan Sejahtera</option>
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
                        className="px-6 h-10 bg-white border border-gray-200 rounded-[10px] text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-all"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleSave}
                        className="h-10 px-5 bg-[#0080C5] text-white rounded-[10px] flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-xs font-semibold"
                    >
                        <Save size={16} />
                        <span>Simpan Perubahan</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditDampinganModal;
