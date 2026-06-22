import React, { useState } from 'react';
import { 
    X, 
    FilePlus, 
    Edit2, 
    Link, 
    FileText, 
    PlayCircle, 
    Plus, 
    Save,
    Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useRoles } from '../../hooks/queries/useHakAksesQuery';
import { usePanduanMutation } from '../../hooks/mutations/usePanduanMutation';

const PanduanModal = ({ isOpen, onClose, mode = 'add', initialData = null }) => {
    const { data: rolesData, isLoading: loadingRoles } = useRoles();
    const roles = rolesData?.data || [];
    
    const { createPanduan, updatePanduan } = usePanduanMutation();
    const isSaving = createPanduan.isPending || updatePanduan.isPending;
    const [formData, setFormData] = useState({
        judul: '',
        role_target: '',
        link_file: '',
        link_video: ''
    });

    const [prevIsOpen, setPrevIsOpen] = useState(false);
    const [prevMode, setPrevMode] = useState('add');
    const [prevInitialData, setPrevInitialData] = useState(null);

    if (isOpen !== prevIsOpen || mode !== prevMode || initialData !== prevInitialData) {
        setPrevIsOpen(isOpen);
        setPrevMode(mode);
        setPrevInitialData(initialData);
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    judul: initialData.judul || '',
                    role_target: initialData.role_target?.id_role || initialData.role_target || '',
                    link_file: initialData.link_file || '',
                    link_video: initialData.link_video || ''
                });
            } else {
                setFormData({ judul: '', role_target: '', link_file: '', link_video: '' });
            }
        }
    }

    const handleSave = () => {
        // Validasi
        if (!formData.judul || !formData.role_target || !formData.link_file || !formData.link_video) {
            Swal.fire({
                icon: 'error',
                title: 'Data Tidak Lengkap',
                text: 'Harap isi semua kolom yang diperlukan.',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' }
            });
            return;
        }

        const action = mode === 'add' 
            ? createPanduan.mutateAsync(formData)
            : updatePanduan.mutateAsync({ id: initialData.id_paduan, data: formData });

        action.then(() => {
            onClose();
            // Tampilkan Alert Sukses ala Figma (Rounded 48px)
            Swal.fire({
                html: `
                    <div class="flex flex-col items-center gap-6 py-4">
                        <div class="w-24 h-24 bg-emerald-500/10 rounded-[48px] flex items-center justify-center outline outline-1 outline-emerald-500">
                            <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            </div>
                        </div>
                        <div class="space-y-2 text-center">
                            <h2 class="text-lg font-bold text-slate-950 font-['Poppins'] tracking-tight">
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
        }).catch((err) => {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' }
            });
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-['Poppins']">
            <div className="bg-white w-full max-w-[500px] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                
                {/* Header Section */}
                <div className="bg-gradient-to-r from-[#0080C5] to-[#0099E6] p-5 text-white relative">
                    <button 
                        onClick={onClose}
                        className="absolute right-6 top-6 p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="flex items-center gap-5 mb-4">
                        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/10">
                            {mode === 'add' ? <FilePlus size={20} /> : <Edit2 size={20} />}
                        </div>
                        <div className="space-y-0.5">
                            <h2 className="text-base font-bold tracking-tight">
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
                <div className="p-5 space-y-4 text-left max-h-[65vh] overflow-y-auto custom-scrollbar">
                    {/* Judul Panduan */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">
                            JUDUL PANDUAN <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="Contoh: Panduan Login & Registrasi"
                            className="w-full px-4 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0080C5] transition-all"
                            value={formData.judul}
                            onChange={(e) => setFormData({...formData, judul: e.target.value})}
                        />
                    </div>

                    {/* Role Pengguna */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">
                            ROLE PENGGUNA <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select 
                                className="w-full px-4 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-medium appearance-none focus:outline-none focus:border-[#0080C5] transition-all disabled:opacity-50"
                                value={formData.role_target}
                                onChange={(e) => setFormData({...formData, role_target: e.target.value})}
                                disabled={loadingRoles}
                            >
                                <option value="" disabled>{loadingRoles ? 'Memuat Role...' : 'Pilih Role..'}</option>
                                {roles.map(role => (
                                    <option key={role.id_role} value={role.id_role}>
                                        {role.name.replace(/_/g, ' ').toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDown size={18} className="text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* URL Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                                    value={formData.link_file}
                                    onChange={(e) => setFormData({...formData, link_file: e.target.value})}
                                />
                            </div>
                            <p className={`text-[10px] font-medium ${mode === 'edit' && formData.link_file ? 'text-green-500' : 'text-slate-400'}`}>
                                {mode === 'edit' && formData.link_file ? 'Link PDF Tersedia' : 'Link file PDF panduan'}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                                <PlayCircle size={14} /> URL VIDEO <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Link size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input 
                                    type="text" 
                                    placeholder="https://youtube.com/..."
                                    className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0080C5] transition-all"
                                    value={formData.link_video}
                                    onChange={(e) => setFormData({...formData, link_video: e.target.value})}
                                />
                            </div>
                            <p className={`text-[10px] font-medium ${mode === 'edit' && formData.link_video ? 'text-green-500' : 'text-slate-400'}`}>
                                {mode === 'edit' && formData.link_video ? 'Link YouTube Tersedia' : 'Link YouTube atau video lainnya'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-slate-100 flex gap-3.5 bg-white">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-4 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-950 hover:bg-slate-50 transition-all"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-[2] py-4 bg-[#0080C5] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-3 hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 active:scale-95 duration-75 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : mode === 'add' ? <Plus size={18} /> : <Save size={18} />}
                        {isSaving ? 'Menyimpan...' : mode === 'add' ? 'Tambah Panduan' : 'Simpan Perubahan'}
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
