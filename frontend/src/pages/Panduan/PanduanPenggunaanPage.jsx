import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
    Search, 
    ChevronDown, 
    Plus, 
    FileText, 
    PlayCircle, 
    Edit3, 
    Trash2,
    Loader2,
    X,
    Download
} from 'lucide-react';
import PanduanModal from '../../components/modals/PanduanModal';
import DeletePanduanModal from '../../components/modals/DeletePanduanModal';
import { getUser } from '../../utils/storage';
import { ROLES } from '../../constants/roles';
import { usePanduansKelola, usePanduansView } from '../../hooks/queries/usePanduanQuery';
import { hasPermission } from '../../utils/permissionUtils';
import Swal from 'sweetalert2';

const PanduanPenggunaanPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedGuide, setSelectedGuide] = useState(null);

    // States for floating Document / Video viewer modal
    const [viewerType, setViewerType] = useState(null); // 'pdf' | 'video'
    const [viewerUrl, setViewerUrl] = useState('');
    const [viewerTitle, setViewerTitle] = useState('');

    const user = getUser();
    const isReadOnly = !hasPermission('kelola_panduan');

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const adminQuery = usePanduansKelola({ search: searchTerm, page, per_page: 10, enabled: !isReadOnly });
    const viewQuery = usePanduansView({ search: searchTerm, page, per_page: 10, enabled: isReadOnly });

    const activeQuery = isReadOnly ? viewQuery : adminQuery;
    const { data: panduanData, isLoading, isError, refetch } = activeQuery;

    const guides = panduanData?.data || [];
    const meta = panduanData?.meta || {};

    // Helper: Convert Google Drive Link to Direct Embed Preview
    const getGoogleDriveEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('/preview') || url.includes('/embed')) return url;
        
        if (url.includes('drive.google.com')) {
            const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                return `https://drive.google.com/file/d/${match[1]}/preview`;
            }
            const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
            }
        }
        return url;
    };

    // Helper: Convert Google Drive Link to Direct Download URL
    const getGoogleDriveDownloadUrl = (url) => {
        if (!url) return '';
        if (url.includes('drive.google.com')) {
            const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                return `https://drive.google.com/uc?export=download&id=${match[1]}`;
            }
            const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
            }
        }
        return url; // Fallback
    };

    // Helper: Convert YouTube Link to Direct Embed
    const getVideoEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('/embed/')) return url;

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            let videoId = '';
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            if (match && match[2].length === 11) {
                videoId = match[2];
            }
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            }
        }
        
        if (url.includes('drive.google.com')) {
            return getGoogleDriveEmbedUrl(url);
        }
        
        return url;
    };

    const handleViewPdf = (url, title = 'Panduan PDF') => {
        if (!url) {
            Swal.fire({
                title: 'Informasi',
                text: 'Panduan PDF belum diunggah oleh admin.',
                icon: 'info',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' }
            });
            return;
        }
        setViewerUrl(url);
        setViewerTitle(title);
        setViewerType('pdf');
    };

    const handleViewVideo = (url, title = 'Panduan Video') => {
        if (!url) {
            Swal.fire({
                title: 'Informasi',
                text: 'Panduan Video belum diunggah oleh admin.',
                icon: 'info',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' }
            });
            return;
        }
        setViewerUrl(url);
        setViewerTitle(title);
        setViewerType('video');
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
            {/* ================= DESKTOP VIEW ================= */}
            <div className="hidden lg:block font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                {/* 1. Hero Banner Gradient */}
                <div className="w-full h-56 px-10 bg-gradient-to-r from-[#0057A8] via-[#0080C5] to-[#2299D8] rounded-[20px] flex flex-row justify-between items-center mb-9 shadow-lg shadow-sky-200/20">
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
                        <div 
                            onClick={() => {
                                if (isLoading) return;
                                const matched = guides.find(g => g.link_file);
                                handleViewPdf(matched?.link_file || '', matched?.judul || 'Panduan PDF Utama');
                            }}
                            className={`w-24 h-24 bg-white/10 rounded-2xl border border-white/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/20 transition-all group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <Loader2 className="text-white animate-spin" size={28} />
                            ) : (
                                <FileText size={28} className="text-white group-hover:scale-110 transition-transform" />
                            )}
                            <span className="text-white text-[10px] font-semibold">PDF Guide</span>
                        </div>
                        {/* Quick Access Card VIDEO */}
                        <div 
                            onClick={() => {
                                if (isLoading) return;
                                const matched = guides.find(g => g.link_video);
                                handleViewVideo(matched?.link_video || '', matched?.judul || 'Panduan Video Utama');
                            }}
                            className={`w-24 h-24 bg-white/10 rounded-2xl border border-white/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/20 transition-all group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <Loader2 className="text-white animate-spin" size={28} />
                            ) : (
                                <PlayCircle size={28} className="text-white group-hover:scale-110 transition-transform" />
                            )}
                            <span className="text-white text-[10px] font-semibold">Video Guide</span>
                        </div>
                    </div>
                </div>

                {/* 2. Content Section */}
                {!isReadOnly && (
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200">
                        {/* Toolbar Area */}
                        <div className="flex flex-row justify-between items-center mb-6">
                            <div className="flex flex-row gap-4">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="Cari Panduan....." 
                                        className="w-64 pl-11 pr-4 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0080C5] transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="px-4 py-2.5 border border-slate-200 rounded-xl flex items-center justify-between gap-10 cursor-pointer hover:bg-slate-50 transition-all group">
                                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">Semua Role</span>
                                    <ChevronDown size={18} className="text-slate-400" />
                                </div>
                            </div>

                            <button 
                                onClick={handleAdd}
                                className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"
                            >
                                <Plus size={18} />
                                Tambah Panduan
                            </button>
                        </div>

                        {/* Desktop Table */}
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                            </div>
                        ) : isError ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl">
                                <p className="text-red-500 mb-4">Gagal memuat panduan.</p>
                                <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg text-[13px] font-semibold">Coba Lagi</button>
                            </div>
                        ) : guides.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl">
                                <p className="text-slate-500 text-[13px] font-medium">Tidak ada panduan yang tersedia.</p>
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
                                            <th className="py-3 px-4 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest w-[10%]">AKSI</th>
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
                                                                onClick={() => handleViewPdf(guide.link_file, guide.judul)}
                                                                className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 rounded-full cursor-pointer hover:bg-red-500/20 transition-colors"
                                                            >
                                                                <FileText size={12} className="text-red-700 fill-red-700/20" />
                                                                <span className="text-red-700 text-[9px] font-bold uppercase tracking-tighter">PDF</span>
                                                            </div>
                                                        )}
                                                        {guide.link_video && (
                                                            <div 
                                                                onClick={() => handleViewVideo(guide.link_video, guide.judul)}
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {/* Table Footer */}
                        {meta && meta.total > 0 && (
                            <div className="mt-6 flex justify-start">
                                <p className="text-slate-400 text-xs font-normal">
                                    Menampilkan <span className="font-bold text-slate-950">{meta.to - meta.from + 1}</span> dari <span className="font-bold text-slate-950">{meta.total}</span> Panduan
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ================= MOBILE VIEW ================= */}
            <div className="lg:hidden font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left pb-24">
                {/* Mobile Hero Banner */}
                <div className="w-full pt-6 pb-8 px-5 bg-gradient-to-br from-[#0080C5] to-[#0057A8] rounded-[24px] flex flex-col mb-4 shadow-lg shadow-sky-200/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl -ml-10 -mb-10"></div>
                    
                    <div className="relative z-10 flex flex-col items-start space-y-4">
                        <div className="inline-flex px-3 py-1 bg-white/20 rounded-full border border-white/10">
                            <span className="text-white text-[10px] font-bold tracking-widest uppercase">PUSAT BANTUAN</span>
                        </div>
                        
                        <div>
                            <h2 className="text-[20px] font-bold text-white tracking-tight leading-snug">Panduan Penggunaan Sistem</h2>
                            <p className="text-[12px] text-white/90 font-normal leading-relaxed mt-2">
                                Temukan panduan lengkap dalam format PDF maupun video tutorial untuk membantu Anda memaksimalkan penggunaan sistem MPM Muhammadiyah.
                            </p>
                        </div>

                        <div className="flex gap-3 w-full mt-2">
                            <div 
                                onClick={() => {
                                    if (isLoading) return;
                                    const matched = guides.find(g => g.link_file);
                                    handleViewPdf(matched?.link_file || '', matched?.judul || 'Panduan PDF Utama');
                                }}
                                className={`flex-1 py-3 bg-white rounded-xl border border-white/20 flex flex-row items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-sm ${isLoading ? 'opacity-50' : ''}`}
                            >
                                {isLoading ? (
                                    <Loader2 className="text-[#0080C5] animate-spin" size={18} />
                                ) : (
                                    <FileText size={18} className="text-[#0080C5]" />
                                )}
                                <span className="text-[#0080C5] text-[13px] font-bold">PDF Guide</span>
                            </div>
                            <div 
                                onClick={() => {
                                    if (isLoading) return;
                                    const matched = guides.find(g => g.link_video);
                                    handleViewVideo(matched?.link_video || '', matched?.judul || 'Panduan Video Utama');
                                }}
                                className={`flex-1 py-3 bg-white rounded-xl border border-white/20 flex flex-row items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-sm ${isLoading ? 'opacity-50' : ''}`}
                            >
                                {isLoading ? (
                                    <Loader2 className="text-[#0080C5] animate-spin" size={18} />
                                ) : (
                                    <PlayCircle size={18} className="text-[#0080C5]" />
                                )}
                                <span className="text-[#0080C5] text-[13px] font-bold">Video Guide</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                {!isReadOnly && (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Cari Panduan..." 
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 shadow-sm rounded-[16px] text-[13px] font-medium focus:outline-none focus:border-[#0080C5] transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="px-3 py-3 bg-white border border-slate-200 rounded-[16px] flex items-center gap-2 shadow-sm shrink-0">
                                <span className="text-[13px] font-semibold text-slate-800">Role</span>
                                <ChevronDown size={16} className="text-slate-400" />
                            </div>
                        </div>

                        <button 
                            onClick={handleAdd}
                            className="w-full h-[44px] bg-[#0080C5] text-white rounded-[16px] flex items-center justify-center gap-2 font-bold text-[14px] shadow-md active:scale-95 transition-transform"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            Tambah Panduan
                        </button>

                        <div className="flex flex-col gap-3 mt-1">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-10">
                                    <Loader2 className="animate-spin text-[#0080C5]" size={30} />
                                </div>
                            ) : isError ? (
                                <div className="flex flex-col items-center justify-center py-10 bg-white rounded-[20px] shadow-sm border border-slate-100">
                                    <p className="text-red-500 mb-4 text-xs">Gagal memuat panduan.</p>
                                    <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg text-xs font-semibold">Coba Lagi</button>
                                </div>
                            ) : guides.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 bg-white rounded-[20px] shadow-sm border border-slate-100">
                                    <p className="text-slate-500 text-[13px] font-medium">Tidak ada panduan tersedia.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {guides.map((guide, idx) => (
                                        <div key={guide.id || idx} className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100 flex flex-row gap-3 relative overflow-hidden">
                                            {/* Number */}
                                            <div className="w-[38px] h-[38px] bg-[#0080C5]/10 rounded-2xl flex items-center justify-center shrink-0">
                                                <span className="text-[#0080C5] text-[14px] font-bold">
                                                    {idx + 1 + (meta?.from ? meta.from - 1 : 0)}
                                                </span>
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex flex-col flex-1 min-w-0 pb-1">
                                                <h3 className="text-[#0A0F1E] text-[14px] font-bold leading-snug truncate">
                                                    {guide.judul}
                                                </h3>
                                                
                                                <div 
                                                    className="flex items-center gap-1 mt-1 cursor-pointer w-fit"
                                                    onClick={() => {
                                                        if (guide.link_file) handleViewPdf(guide.link_file, guide.judul);
                                                        else if (guide.link_video) handleViewVideo(guide.link_video, guide.judul);
                                                    }}
                                                >
                                                    <FileText size={12} className="text-[#0080C5]" />
                                                    <span className="text-[#0080C5] text-[11px] font-bold">Lihat file !</span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <div className="px-2.5 py-0.5 bg-[#16A34A]/10 rounded-full">
                                                        <span className="text-[#16A34A] text-[10px] font-bold capitalize">{guide.role_target?.name || '-'}</span>
                                                    </div>
                                                    {guide.link_file && (
                                                        <div className="px-2.5 py-0.5 bg-red-500/10 rounded-full flex items-center gap-1">
                                                            <FileText size={10} className="text-red-500" />
                                                            <span className="text-red-500 text-[10px] font-bold">PDF</span>
                                                        </div>
                                                    )}
                                                    {guide.link_video && (
                                                        <div className="px-2.5 py-0.5 bg-[#FB923C]/10 rounded-full flex items-center gap-1">
                                                            <PlayCircle size={10} className="text-[#FB923C]" />
                                                            <span className="text-[#FB923C] text-[10px] font-bold">VIDEO</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <p className="text-slate-400 text-[11px] leading-relaxed mt-2 line-clamp-2">
                                                    {guide.deskripsi || 'Panduan langkah demi langkah untuk menggunakan sistem...'}
                                                </p>
                                            </div>
                                            
                                            {/* Actions (Right Side Vertical Stack) */}
                                            <div className="flex flex-col gap-2 shrink-0">
                                                <button 
                                                    onClick={() => handleEdit(guide)}
                                                    className="w-8 h-8 flex items-center justify-center bg-[#FB923C]/10 text-[#FB923C] rounded-full active:scale-95 transition-all"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(guide)}
                                                    className="w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-500 rounded-full active:scale-95 transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                <button 
                                                    className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full active:scale-95 transition-all"
                                                >
                                                    <ChevronDown size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {meta && meta.total > 0 && (
                                <div className="mt-4 flex justify-center bg-white rounded-full py-2.5 shadow-sm border border-slate-100">
                                    <p className="text-slate-400 text-[12px] font-medium">
                                        Menampilkan {meta.to - meta.from + 1} dari {meta.total} Panduan
                                    </p>
                                </div>
                            )}
                        </div>
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

            {/* Viewer Modal - Render conditionally based on viewerType */}
            {viewerType && (
                <>
                    {/* Desktop Viewer Modal */}
                    <div className="hidden lg:flex fixed inset-0 z-[120] items-center justify-center font-['Poppins'] p-4 animate-in fade-in duration-200">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setViewerType(null); setViewerUrl(''); }}></div>
                        <div className="relative w-full max-w-5xl bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 duration-200 border border-white/20">
                            <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${viewerType === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                                        {viewerType === 'pdf' ? <FileText size={16} /> : <PlayCircle size={16} />}
                                    </div>
                                    <div className="text-left min-w-0">
                                        <h4 className="text-slate-900 text-sm font-bold truncate max-w-md">
                                            {viewerTitle}
                                        </h4>
                                        <p className="text-slate-400 text-[10px] truncate">
                                            {viewerType === 'pdf' ? 'Dokumen PDF Reader' : 'Video Player Tutorial'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {viewerType === 'pdf' && (
                                        <a 
                                            href={getGoogleDriveDownloadUrl(viewerUrl)} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="h-8 px-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all shadow-sm shrink-0"
                                        >
                                            <Download size={13} />
                                            <span>Unduh PDF</span>
                                        </a>
                                    )}
                                    <button 
                                        onClick={() => {
                                            setViewerType(null);
                                            setViewerUrl('');
                                        }} 
                                        className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors shrink-0"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 bg-slate-900 relative">
                                {viewerType === 'pdf' ? (
                                    <iframe src={getGoogleDriveEmbedUrl(viewerUrl)} className="w-full h-full border-none" allow="autoplay" title={viewerTitle}></iframe>
                                ) : (
                                    <iframe src={getVideoEmbedUrl(viewerUrl)} className="w-full h-full border-none" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={viewerTitle}></iframe>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Viewer Modal (Bottom Sheet) */}
                    <div className="flex lg:hidden fixed inset-0 z-[120] items-end justify-center font-['Poppins'] animate-in fade-in duration-200">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setViewerType(null); setViewerUrl(''); }}></div>
                        <div className="relative w-full bg-white rounded-t-[24px] shadow-2xl overflow-hidden flex flex-col h-[90vh] animate-in slide-in-from-bottom duration-300">
                            <div className="w-full flex justify-center pt-3 pb-2 bg-white shrink-0" onClick={() => { setViewerType(null); setViewerUrl(''); }}>
                                <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
                            </div>
                            <div className="px-5 pb-3 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${viewerType === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                                        {viewerType === 'pdf' ? <FileText size={16} /> : <PlayCircle size={16} />}
                                    </div>
                                    <div className="text-left min-w-0">
                                        <h4 className="text-slate-900 text-[13px] font-bold truncate max-w-[180px]">
                                            {viewerTitle}
                                        </h4>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {viewerType === 'pdf' && (
                                        <a 
                                            href={getGoogleDriveDownloadUrl(viewerUrl)} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="w-8 h-8 bg-red-50 text-red-600 hover:bg-red-100 rounded-full flex items-center justify-center transition-all shrink-0"
                                        >
                                            <Download size={14} />
                                        </a>
                                    )}
                                    <button 
                                        onClick={() => {
                                            setViewerType(null);
                                            setViewerUrl('');
                                        }} 
                                        className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 bg-slate-900 relative">
                                {viewerType === 'pdf' ? (
                                    <iframe src={getGoogleDriveEmbedUrl(viewerUrl)} className="w-full h-full border-none" allow="autoplay" title={viewerTitle}></iframe>
                                ) : (
                                    <iframe src={getVideoEmbedUrl(viewerUrl)} className="w-full h-full border-none" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={viewerTitle}></iframe>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default PanduanPenggunaanPage;
