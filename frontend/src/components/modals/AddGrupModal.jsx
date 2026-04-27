import React, { useState } from 'react';
import { 
    X, 
    ChevronDown, 
    Plus, 
    ChevronRight, 
    Users, 
    Check, 
    Upload, 
    User, 
    ChevronLeft, 
    Save,
    Eye,
    EyeOff
} from 'lucide-react';
import Swal from 'sweetalert2';

const AddGrupModal = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleNext = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit logic
            Swal.fire({
                title: 'Berhasil!',
                text: 'Data Grup Dampingan berhasil ditambahkan.',
                icon: 'success',
                confirmButtonColor: '#0080C5',
                timer: 2000,
                showConfirmButton: false,
                customClass: {
                    popup: 'rounded-2xl font-["Poppins"]',
                }
            });
            onClose();
            setCurrentStep(1); // Reset step for next time
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
                    {/* Step 1 */}
                    <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep > 1 ? 'bg-emerald-500 text-white' : currentStep === 1 ? 'bg-[#0080C5] text-white' : 'bg-gray-200 text-slate-400'}`}>
                            {currentStep > 1 ? <Check size={14} strokeWidth={3} /> : '1'}
                        </div>
                        <span className={`text-xs font-semibold ${currentStep > 1 ? 'text-emerald-500' : currentStep === 1 ? 'text-[#0080C5]' : 'text-slate-400'}`}>Data Grup</span>
                    </div>
                    {/* Connector */}
                    <div className={`flex-1 h-[1.5px] transition-colors ${currentStep > 1 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                    {/* Step 2 */}
                    <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === 2 ? 'bg-[#0080C5] text-white' : 'bg-gray-200 text-slate-400'}`}>
                            2
                        </div>
                        <span className={`text-xs font-semibold ${currentStep === 2 ? 'text-[#0080C5]' : 'text-slate-400'}`}>PJ Dampingan</span>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-6 max-h-[480px] overflow-y-auto space-y-5 custom-scrollbar">
                    {currentStep === 1 ? (
                        <>
                            {/* Nama Grup */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-slate-950 text-xs font-semibold leading-5">Nama Grup Dampingan</label>
                                <input 
                                    type="text" 
                                    placeholder="Masukkan nama grup dampingan"
                                    className="w-full h-11 px-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
                                />
                            </div>

                            {/* Jenis & Bidang Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Jenis Grup Dampingan <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <select defaultValue="" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-400 text-xs focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                            <option value="" disabled>Pilih Jenis Grup Dampingan</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Bidang Grup Dampingan <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <select defaultValue="" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-400 text-xs focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                            <option value="" disabled>Pilih Bidang Grup Dampingan</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Provinsi & Kabupaten Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Provinsi <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <select defaultValue="" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-400 text-xs focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                            <option value="" disabled>Pilih Provinsi</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Kabupaten <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <select defaultValue="" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-400 text-xs focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                            <option value="" disabled>Pilih Kabupaten</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Kecamatan */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-slate-950 text-xs font-semibold leading-5">Kecamatan</label>
                                <div className="relative group">
                                    <select defaultValue="" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-400 text-xs focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                        <option value="" disabled>Pilih kecamatan...</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Fasilitator */}
                            <div className="space-y-2 text-left">
                                <div className="flex items-center justify-between">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Fasilitator</label>
                                    <button className="px-3 py-1.5 bg-[#0080C5]/10 rounded-lg flex items-center gap-1.5 text-[#0080C5] hover:bg-[#0080C5]/20 transition-all">
                                        <Plus size={12} strokeWidth={3} />
                                        <span className="text-[10px] font-bold">Tambah Fasilitator</span>
                                    </button>
                                </div>
                                <div className="relative group">
                                    <select defaultValue="" className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-400 text-xs focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                        <option value="" disabled>Pilih Fasilitator...</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                            {/* Upload Foto Profil */}
                            <div className="w-full p-4 bg-slate-50 rounded-xl border border-gray-200 flex items-center gap-5">
                                <div className="w-16 h-16 bg-white rounded-full border-2 border-[#0080C5] border-dashed flex items-center justify-center text-slate-300 overflow-hidden relative group cursor-pointer">
                                    <User size={32} />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <Upload size={16} />
                                    </div>
                                </div>
                                <div className="flex-1 text-left">
                                    <h4 className="text-slate-950 text-xs font-semibold">Foto Profil</h4>
                                    <p className="text-slate-400 text-[10px] font-normal leading-4 mt-0.5">Format JPG, PNG, atau GIF. Maks. 2 MB.</p>
                                    <button className="mt-2 h-7 px-3 bg-[#0080C5] text-white rounded-md flex items-center gap-1.5 hover:bg-sky-700 transition-all">
                                        <Upload size={12} />
                                        <span className="text-[10px] font-semibold">Unggah Foto</span>
                                    </button>
                                </div>
                            </div>

                            {/* Nama & No Telp Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        placeholder="Masukkan nama lengkap"
                                        className="w-full h-11 px-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">No. Telepon</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            placeholder="8xxxxxxxxx"
                                            className="w-full h-11 px-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Alamat */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-slate-950 text-xs font-semibold leading-5">Alamat</label>
                                <textarea 
                                    placeholder="Masukkan alamat lengkap..."
                                    rows="3"
                                    className="w-full px-4 py-3 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all resize-none"
                                ></textarea>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Username & Password Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Username</label>
                                    <input 
                                        type="text" 
                                        placeholder="Masukkan username"
                                        className="w-full h-11 px-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-slate-950 text-xs font-semibold leading-5">Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            placeholder="••••••••"
                                            className="w-full h-11 px-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
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
                            className="px-6 h-10 bg-[#0080C5] text-white rounded-[10px] text-xs font-semibold hover:bg-sky-700 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <span>{currentStep === 1 ? 'Selanjutnya' : 'Simpan Data'}</span>
                            {currentStep === 1 ? <ChevronRight size={14} /> : <Save size={14} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddGrupModal;
