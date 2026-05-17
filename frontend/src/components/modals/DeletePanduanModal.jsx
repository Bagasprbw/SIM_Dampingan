import React from 'react';
import { 
    X, 
    AlertCircle, 
    AlertTriangle, 
    Trash2, 
    FileText, 
    PlayCircle,
    Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { usePanduanMutation } from '../../hooks/mutations/usePanduanMutation';

const DeletePanduanModal = ({ isOpen, onClose, data }) => {
    const { deletePanduan } = usePanduanMutation();

    if (!isOpen || !data) return null;

    const handleDelete = () => {
        deletePanduan.mutateAsync(data.id_paduan).then(() => {
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
                            <h2 class="text-lg font-bold text-slate-950 font-['Poppins'] tracking-tight">Berhasil Dihapus!</h2>
                            <p class="text-slate-500 text-base font-['Poppins']">Panduan telah dihapus secara permanen dari sistem.</p>
                        </div>
                    </div>
                `,
                showConfirmButton: false,
                timer: 2000,
                width: '460px',
                padding: '3rem',
                customClass: {
                    popup: 'rounded-[48px] shadow-2xl border-none'
                }
            });
        }).catch((err) => {
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menghapus',
                text: err.response?.data?.message || 'Terjadi kesalahan saat menghapus data.',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' }
            });
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-['Poppins']">
            <div className="bg-white w-full max-w-[540px] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                
                {/* Header Section */}
                <div className="p-5 pb-6 flex justify-between items-start">
                    <div className="flex gap-5">
                        <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                            <AlertCircle size={20} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-base font-bold text-slate-900 tracking-tight text-left">Hapus Panduan</h2>
                            <p className="text-xs text-slate-400 font-medium text-left tracking-tight">Tindakan ini tidak dapat dibatalkan</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Section */}
                <div className="px-6 space-y-4">
                    {/* Summary Box */}
                    <div className="p-5 bg-[#FFF5F5] rounded-[24px] border border-[#FECACA] space-y-4">
                        <p className="text-xs font-medium text-slate-600 text-left">Apakah Anda yakin ingin menghapus panduan berikut?</p>
                        
                        <div className="space-y-3">
                            <div className="flex items-start text-xs font-medium">
                                <span className="w-20 text-slate-400">Judul</span>
                                <span className="w-4 text-slate-400">:</span>
                                <span className="flex-1 text-slate-900 font-bold">{data.judul}</span>
                            </div>
                            <div className="flex items-center text-xs font-medium">
                                <span className="w-20 text-slate-400">Role</span>
                                <span className="w-4 text-slate-400">:</span>
                                <span className="flex-1 text-slate-900 font-bold">{data.role_target?.name || '-'}</span>
                            </div>
                            <div className="flex items-center text-xs font-medium">
                                <span className="w-20 text-slate-400">File</span>
                                <span className="w-4 text-slate-400">:</span>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 rounded-full">
                                        <FileText size={12} className="text-red-500" />
                                        <span className="text-red-500 text-[10px] font-bold uppercase">PDF</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 rounded-full">
                                        <PlayCircle size={12} className="text-orange-500" />
                                        <span className="text-orange-500 text-[10px] font-bold uppercase">Video</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Warning */}
                    <div className="flex gap-3 p-4 bg-orange-50/30 rounded-2xl border border-orange-100">
                        <div className="mt-0.5 text-orange-500">
                            <AlertTriangle size={18} />
                        </div>
                        <p className="text-[11px] font-medium text-[#92400E] leading-relaxed text-left">
                            Panduan yang dihapus tidak dapat dikembalikan dan tidak akan dapat diakses oleh pengguna manapun.
                        </p>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="p-5 pt-6 flex gap-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-4 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleDelete}
                        disabled={deletePanduan.isPending}
                        className="flex-1 py-4 bg-[#EF4444] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-lg shadow-red-100 active:scale-95 duration-75 disabled:opacity-50"
                    >
                        {deletePanduan.isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        {deletePanduan.isPending ? 'Menghapus...' : 'Ya, Hapus'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DeletePanduanModal;
