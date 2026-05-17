import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
    Search, 
    ChevronDown, 
    Plus, 
    FileText, 
    PlayCircle, 
    Edit3, 
    Trash2,
    Loader2
} from 'lucide-react';
import PanduanModal from '../../components/modals/PanduanModal';
import DeletePanduanModal from '../../components/modals/DeletePanduanModal';
import { getUser } from '../../utils/storage';
import { ROLES } from '../../constants/roles';
import { usePanduansKelola, usePanduansView } from '../../hooks/queries/usePanduanQuery';

const PanduanPenggunaanPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedGuide, setSelectedGuide] = useState(null);

    const user = getUser();
    const isPjGrup = user?.role === ROLES.PJ_DAMPINGAN;
    const isFasilitator = user?.role === ROLES.FASILITATOR;
    const isReadOnly = isPjGrup || isFasilitator;

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const adminQuery = usePanduansKelola({ search: searchTerm, page, per_page: 10, enabled: !isReadOnly });
    const viewQuery = usePanduansView({ search: searchTerm, page, per_page: 10, enabled: isReadOnly });

    const activeQuery = isReadOnly ? viewQuery : adminQuery;
    const { data: panduanData, isLoading, isError, refetch } = activeQuery;

    const guides = panduanData?.data || [];
    const meta = panduanData?.meta || {};

    const handleViewFile = (url) => {
        if (url) window.open(url, '_blank');
    };

    const handleAdd = () => {
        setModalMode('add');
        setSelectedGuide(null);
        setIsModalOpen(true);
    };

    const handleEdit = (guide) => {
        setModalMode('edit');
        setSelectedGuide(guide);
        setIsModalOpen(true);
    };

    const handleDelete = (guide) => {
        setSelectedGuide(guide);
        setIsDeleteOpen(true);
    };

    return (
        <AdminLayout title="Panduan Penggunaan">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                
                {/* 1. Hero Banner Gradient */}
                <div className="w-full h-56 px-10 bg-gradient-to-r from-[#0057A8] via-[#0080C5] to-[#2299D8] rounded-[20px] flex justify-between items-center mb-9 shadow-lg shadow-sky-200/20">
                    <div className="max-w-xl space-y-4">
                        <div className="inline-flex px-4 py-1 bg-white/20 rounded-full border border-white/10">
                            <span className="text-white text-[10px] font-bold tracking-widest uppercase">PUSAT BANTUAN</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Panduan Penggunaan Sistem</h2>
                        <p className="text-xs text-white/80 font-normal leading-relaxed">
                            Temukan panduan lengkap dalam format PDF maupun video tutorial untuk membantu Anda memaksimalkan penggunaan sistem MPM Muhammadiyah.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        {/* Quick Access Card PDF */}
                        <div className="w-24 h-24 bg-white/10 rounded-2xl border border-white/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/20 transition-all group">
                            <FileText size={28} className="text-white group-hover:scale-110 transition-transform" />
                            <span className="text-white text-[10px] font-semibold">PDF Guide</span>
                        </div>
                        {/* Quick Access Card VIDEO */}
                        <div className="w-24 h-24 bg-white/10 rounded-2xl border border-white/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/20 transition-all group">
                            <PlayCircle size={28} className="text-white group-hover:scale-110 transition-transform" />
                            <span className="text-white text-[10px] font-semibold">Video Guide</span>
                        </div>
                    </div>
                </div>

                {/* 2. Content Section */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200">
                    
                    {/* Toolbar Area */}
                    <div className="flex justify-between items-center mb-6 px-2">
                        <div className="flex gap-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Cari Panduan....." 
                                    className="pl-11 pr-4 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-xs font-medium w-64 focus:outline-none focus:border-[#0080C5] transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {/* Role Filter */}
                            <div className="px-4 py-2.5 border border-slate-200 rounded-xl flex items-center gap-10 cursor-pointer hover:bg-slate-50 transition-all group">
                                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">Semua Role</span>
                                <ChevronDown size={18} className="text-slate-400" />
                            </div>
                        </div>

                        {/* Add Button */}
                        {!isReadOnly && (
                            <button 
                                onClick={handleAdd}
                                className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"
                            >
                                <Plus size={18} />
                                Tambah Panduan
                            </button>
                        )}
                    </div>

                    {/* Guides Table */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-red-500 mb-4">Gagal memuat panduan.</p>
                            <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                        </div>
                    ) : guides.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-slate-500">Tidak ada panduan yang tersedia.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-slate-100">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-100/50">
                                    <th className="py-3 px-4 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest w-[8%]">NO</th>
                                    <th className="py-3 px-4 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest w-[30%]">JUDUL PANDUAN</th>
                                    <th className="py-3 px-4 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest w-[20%]">ROLE</th>
                                    <th className="py-3 px-4 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest w-[25%]">TIPE</th>
                                    {!isReadOnly && <th className="py-3 px-4 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest w-[10%]">AKSI</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {guides.map((guide, idx) => (
                                    <tr key={guide.id || idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-2.5 px-4 text-center text-slate-950 text-[11px] font-semibold">{idx + 1 + (meta?.from ? meta.from - 1 : 0)}</td>
                                        <td className="py-2.5 px-4 ">
                                            <div className="space-y-0.5">
                                                <div className="text-slate-950 text-[11px] font-semibold">{guide.judul}</div>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="inline-flex px-4 py-1 bg-[#16A34A]/10 rounded-full">
                                                <span className="text-[#16A34A] text-[10px] font-bold uppercase">{guide.role_target?.name || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex justify-center gap-1.5">
                                                {guide.link_file && (
                                                    <div 
                                                        onClick={() => handleViewFile(guide.link_file)}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 rounded-full cursor-pointer hover:bg-red-500/20 transition-colors"
                                                    >
                                                        <FileText size={12} className="text-red-700 fill-red-700/20" />
                                                        <span className="text-red-700 text-[9px] font-bold uppercase tracking-tighter">PDF</span>
                                                    </div>
                                                )}
                                                {guide.link_video && (
                                                    <div 
                                                        onClick={() => handleViewFile(guide.link_video)}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#A16207]/10 rounded-full cursor-pointer hover:bg-[#A16207]/20 transition-colors"
                                                    >
                                                        <PlayCircle size={12} className="text-[#A16207] fill-[#A16207]/20" />
                                                        <span className="text-[#A16207] text-[9px] font-bold uppercase tracking-tighter">VIDEO</span>
                                                    </div>
                                                )}
                                                {!guide.link_file && !guide.link_video && (
                                                    <span className="text-slate-400 text-[10px]">-</span>
                                                )}
                                            </div>
                                        </td>
                                        {!isReadOnly && (
                                            <td className="py-2.5 px-4 ">
                                                <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleEdit(guide)}
                                                        className="p-2 bg-[#FB923C]/10 text-[#FB923C] rounded-lg hover:bg-[#FB923C] hover:text-white transition-all"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(guide)}
                                                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    )}

                    {/* Table Footer */}
                    {meta && meta.total > 0 && (
                        <div className="mt-6 px-2 flex justify-start">
                            <p className="text-slate-400 text-xs font-normal">
                                Menampilkan <span className="font-bold text-slate-950">{meta.to - meta.from + 1}</span> dari <span className="font-bold text-slate-950">{meta.total}</span> Panduan
                            </p>
                        </div>
                    )}
                </div>

                {/* Modal Component */}
                <PanduanModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    mode={modalMode}
                    initialData={selectedGuide}
                />

                {/* Delete Modal Component */}
                <DeletePanduanModal 
                    isOpen={isDeleteOpen}
                    onClose={() => setIsDeleteOpen(false)}
                    data={selectedGuide}
                />
            </div>
        </AdminLayout>
    );
};

export default PanduanPenggunaanPage;
