import React, { useState, useEffect } from 'react';
import { 
    X, 
    FilePlus, 
    Edit2, 
    Link, 
    FileText, 
    PlayCircle, 
    Plus, 
    Save 
} from 'lucide-react';
import Swal from 'sweetalert2';

const PanduanModal = ({ isOpen, onClose, mode = 'add', initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        role: '',
        pdfUrl: '',
        videoUrl: '',
        desc: ''
    });

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData(initialData);
        } else {
            setFormData({ title: '', role: '', pdfUrl: '', videoUrl: '', desc: '' });
        }
    }, [mode, initialData, isOpen]);

    const handleSave = () => {
        // Simulasi simpan data
        onClose();
        
        // Tampilkan Alert Sukses ala Figma (Rounded 48px)
        Swal.fire({
            html: `
                <div class="flex flex-col items-center gap-6 py-4">
                    <div class="w-24 h-24 bg-emerald-500/10 rounded-[48px] flex items-center justify-center outline outline-1 outline-emerald-500">
                        <div class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        </div>
                    </div>
                    <div class="space-y-2 text-center">
                        <h2 class="text-2xl font-bold text-slate-950 font-['Poppins'] tracking-tight">
                            ${mode === 'add' ? 'Panduan Ditambahkan!' : 'Perubahan Disimpan!'}
                        </h2>
                        <p class="text-slate-500 text-base font-['Poppins']">
                            Data panduan berhasil ${mode === 'add' ? 'ditambahkan ke sistem' : 'diperbarui di sistem'}.
                        </p>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: false,
            width: '460px',
            padding: '3rem',
            background: '#ffffff',
            customClass: {
                popup: 'rounded-[48px] shadow-2xl border-none'
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-['Poppins']">
            <div className="bg-white w-full max-w-[580px] rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                
                {/* Header Section */}
                <div className="bg-gradient-to-r from-[#0080C5] to-[#0099E6] p-8 text-white relative">
                    <button 
                        onClick={onClose}
                        className="absolute right-6 top-6 p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/10">
                            {mode === 'add' ? <FilePlus size={28} /> : <Edit2 size={28} />}
                        </div>
                        <div className="space-y-0.5">
                            <h2 className="text-xl font-bold tracking-tight">
                                {mode === 'add' ? 'Tambah Panduan Baru' : 'Edit Panduan'}
                            </h2>
                            <p className="text-xs text-white/80 font-normal">
                                {mode === 'add' ? 'Isi formulir untuk menambah panduan baru' : 'Perbarui informasi panduan pengguna'}
                            </p>
                        </div>
                    </div>

                    {/* Badge Row */}
                    <div className="flex gap-2.5">
                        <div className="px-3 py-1.5 bg-white/20 rounded-full border border-white/10 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Super Admin</span>
                        </div>
                        <div className="px-3 py-1.5 bg-white/20 rounded-full border border-white/10 flex items-center gap-2">
                            <FileText size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">PDF Guide</span>
                        </div>
                        <div className="px-3 py-1.5 bg-white/20 rounded-full border border-white/10 flex items-center gap-2">
                            <PlayCircle size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Video Guide</span>
                        </div>
                    </div>
                </div>

                {/* Body Form */}
                <div className="p-8 space-y-6 text-left">
                    {/* Judul Panduan */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">
                            JUDUL PANDUAN <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="Contoh: Panduan Login & Registrasi"
                            className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0080C5] transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    {/* Role Pengguna */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">ROLE PENGGUNA</label>
                        <div className="relative">
                            <select 
                                className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-medium appearance-none focus:outline-none focus:border-[#0080C5] transition-all"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="" disabled>Pilih Role..</option>
                                <option value="Admin">Admin</option>
                                <option value="Fasilitator">Fasilitator</option>
                                <option value="PJ Dampingan">PJ Dampingan</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDown size={18} className="text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* URL Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                                <FileText size={14} /> URL PDF
                            </label>
                            <div className="relative">
                                <Link size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input 
                                    type="text" 
                                    placeholder="https://drive.google.com/..."
                                    className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0080C5] transition-all"
                                    value={formData.pdfUrl}
                                    onChange={(e) => setFormData({...formData, pdfUrl: e.target.value})}
                                />
                            </div>
                            <p className={`text-[10px] font-medium ${mode === 'edit' && formData.pdfUrl ? 'text-green-500' : 'text-slate-400'}`}>
                                {mode === 'edit' && formData.pdfUrl ? 'Link PDF Tersedia' : 'Link file PDF panduan'}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                                <PlayCircle size={14} /> URL VIDEO
                            </label>
                            <div className="relative">
                                <Link size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input 
                                    type="text" 
                                    placeholder="https://youtube.com/..."
                                    className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0080C5] transition-all"
                                    value={formData.videoUrl}
                                    onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                                />
                            </div>
                            <p className={`text-[10px] font-medium ${mode === 'edit' && formData.videoUrl ? 'text-green-500' : 'text-slate-400'}`}>
                                {mode === 'edit' && formData.videoUrl ? 'Link YouTube Tersedia' : 'Link YouTube atau video lainnya'}
                            </p>
                        </div>
                    </div>

                    {/* Deskripsi Area */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">DESKRIPSI</label>
                        <div className="relative">
                            <textarea 
                                placeholder="Tulis deskripsi singkat tentang isi panduan ini..."
                                className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-medium h-32 focus:outline-none focus:border-[#0080C5] transition-all resize-none"
                                value={formData.desc}
                                onChange={(e) => setFormData({...formData, desc: e.target.value})}
                                maxLength={200}
                            />
                            <span className="absolute bottom-4 right-5 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                {formData.desc.length}/200
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 border-t border-slate-100 flex gap-3.5 bg-white">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-4 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-950 hover:bg-slate-50 transition-all"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleSave}
                        className="flex-[2] py-4 bg-[#0080C5] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-3 hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 active:scale-95 duration-75"
                    >
                        {mode === 'add' ? <Plus size={18} /> : <Save size={18} />}
                        {mode === 'add' ? 'Tambah Panduan' : 'Simpan Perubahan'}
                    </button>
                </div>

            </div>
        </div>
    );
};

// Helper for select arrow
const ChevronDown = ({ size, className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m6 9 6 6 6-6"/>
    </svg>
);

export default PanduanModal;
