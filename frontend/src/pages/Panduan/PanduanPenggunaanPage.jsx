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
            <div className="p-4 lg:p-0 lg:pt-[107px] font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left flex flex-col">
                
                {/* 1. Hero Banner Gradient */}
                <div className="relative w-full overflow-hidden px-4 py-4 lg:px-[37px] lg:py-[32px] bg-gradient-to-br from-[#0080C5] to-[#005FA3] lg:bg-gradient-to-r lg:from-[#0057A8] lg:via-[#0080C5] lg:to-[#2299D8] rounded-[16px] lg:rounded-[20px] flex flex-col lg:flex-row justify-center lg:justify-between items-start lg:items-center mb-4 lg:mb-0 shadow-sm lg:shadow-none gap-4 lg:gap-[414px] lg:w-[1102px] lg:h-[224.4px] lg:mx-auto">
                    {/* Decorative Circles */}
                    <div className="absolute w-32 h-32 bg-white/10 rounded-full -top-10 -right-4 lg:w-48 lg:h-48 lg:-top-16 lg:-right-8"></div>
                    <div className="absolute w-20 h-20 bg-white/10 rounded-full top-36 right-16 lg:w-32 lg:h-32 lg:top-auto lg:bottom-4 lg:right-48"></div>

                    <div className="relative z-10 max-w-xl lg:max-w-none lg:w-[403px] space-y-2 lg:space-y-[19px] text-left flex flex-col items-start lg:justify-start lg:h-[159.7px]">
                        <div className="inline-flex px-2.5 py-1 lg:px-[10px] lg:py-[10px] bg-white/20 lg:bg-white/20 rounded-[10px] lg:rounded-[20px] lg:h-[24.5px] items-center justify-center">
                            <span className="text-white text-[10px] lg:text-[11px] font-semibold lg:font-bold tracking-wide lg:tracking-[0.01em] lg:leading-[16px]">PUSAT BANTUAN</span>
                        </div>
                        <h2 className="text-[17px] lg:text-[24px] font-bold text-white tracking-tight lg:tracking-[0.01em] leading-tight lg:leading-[36px]">Panduan Penggunaan Sistem</h2>
                        <p className="text-[11px] lg:text-[13px] text-white/80 lg:text-white font-normal leading-[15px] lg:leading-[20px] max-w-[300px] lg:max-w-none lg:tracking-[0.01em]">
                            Temukan panduan lengkap dalam format PDF maupun video tutorial untuk membantu Anda memaksimalkan penggunaan sistem MPM Muhammadiyah.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-row gap-2 justify-start w-full lg:w-auto mt-2 lg:mt-0 lg:gap-[15px]">
                        {/* Quick Access Card PDF */}
                        <div 
                            onClick={() => {
                                if (isLoading) return;
                                const matched = guides.find(g => g.link_file);
                                handleViewPdf(matched?.link_file || '', matched?.judul || 'Panduan PDF Utama');
                            }}
                            className={`flex items-center px-3 py-2.5 lg:p-[21px_21px_22px_22px] bg-white lg:bg-[#0057a8]/15 border-0 lg:border lg:border-white rounded-[14px] lg:rounded-[16px] cursor-pointer hover:bg-slate-50 lg:hover:bg-[#0057a8]/25 transition-all gap-2 lg:gap-[10px] shadow-sm lg:shadow-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} lg:flex-row lg:justify-between lg:w-[100px] lg:h-[100px] lg:flex-col lg:items-center`}
                        >
                            <div className="flex flex-row lg:flex-col items-center justify-center gap-2 lg:gap-[8px]">
                                {isLoading ? (
                                    <Loader2 className="text-[#0080C5] lg:text-white animate-spin lg:w-[32px] lg:h-[32px]" size={16} />
                                ) : (
                                    <FileText size={16} strokeWidth={2} className="text-[#0080C5] lg:text-white lg:w-[32px] lg:h-[32px]" />
                                )}
                                <span className="text-[#0080C5] lg:text-white text-[12px] lg:text-[11px] font-bold lg:font-semibold lg:tracking-[0.01em]">PDF Guide</span>
                            </div>
                        </div>
                        {/* Quick Access Card VIDEO */}
                        <div 
                            onClick={() => {
                                if (isLoading) return;
                                const matched = guides.find(g => g.link_video);
                                handleViewVideo(matched?.link_video || '', matched?.judul || 'Panduan Video Utama');
                            }}
                            className={`flex items-center px-3 py-2.5 lg:p-[21px_21px_22px_22px] bg-white lg:bg-[#0057a8]/15 border-0 lg:border lg:border-white rounded-[14px] lg:rounded-[16px] cursor-pointer hover:bg-slate-50 lg:hover:bg-[#0057a8]/25 transition-all gap-2 lg:gap-[10px] shadow-sm lg:shadow-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} lg:flex-row lg:justify-between lg:w-[100px] lg:h-[100px] lg:flex-col lg:items-center`}
                        >
                            <div className="flex flex-row lg:flex-col items-center justify-center gap-2 lg:gap-[8px]">
                                {isLoading ? (
                                    <Loader2 className="text-[#0080C5] lg:text-white animate-spin lg:w-[32px] lg:h-[32px]" size={16} />
                                ) : (
                                    <PlayCircle size={16} strokeWidth={2} className="text-[#0080C5] lg:text-white lg:w-[32px] lg:h-[32px]" />
                                )}
                                <span className="text-[#0080C5] lg:text-white text-[12px] lg:text-[11px] font-bold lg:font-semibold lg:tracking-[0.01em]">Video Guide</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Content Section */}
                {!isReadOnly && (
                    <div className="bg-transparent lg:bg-white rounded-none lg:rounded-[20px] p-0 lg:p-[24px_0_22px] shadow-none lg:shadow-none border-0 lg:border-none lg:w-[1102px] lg:mx-auto lg:mt-[38px] flex flex-col lg:items-center">
                        
                        {/* Toolbar Area */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-[16px] gap-4 lg:w-[1059px] lg:h-[40px]">
                            <div className="flex flex-row gap-2 w-full lg:w-[417.4px] lg:gap-[17px]">
                                {/* Search Bar */}
                                <div className="relative flex-1 lg:w-[220px]">
                                    <Search className="absolute left-3 lg:left-[15px] top-1/2 -translate-y-1/2 text-[#9298B0]" size={15} />
                                    <input 
                                        type="text" 
                                        placeholder="Cari Panduan....." 
                                        className="w-full pl-9 lg:pl-[44px] pr-3 py-2 bg-white lg:bg-white border-[1.6px] lg:border-[2px] border-[#E5E7EB] rounded-[14px] lg:rounded-[10px] text-[12px] lg:text-[13px] text-[#9298B0] font-normal focus:outline-none focus:border-[#0080C5] transition-all h-[41px] lg:h-[40px]"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                {/* Role Filter */}
                                <div className="px-2.5 lg:px-[10px] py-2 bg-white border-[0.8px] lg:border border-[#E5E7EB] rounded-[14px] lg:rounded-[10px] flex items-center justify-between gap-1.5 lg:gap-[39px] cursor-pointer hover:bg-slate-50 transition-all w-auto lg:w-[180.4px] shrink-0 h-[41px] lg:h-[40px]">
                                    <span className="text-[11px] lg:text-[13px] font-semibold text-[#0A0F1E] lg:text-[#9298B0] lg:tracking-[0.01em] text-center">Semua Role</span>
                                    <ChevronDown size={13} className="text-[#9298B0] lg:w-[20px] lg:h-[20px]" />
                                </div>
                            </div>

                            {/* Add Button */}
                            {!isReadOnly && (
                                <button 
                                    onClick={handleAdd}
                                    className="w-auto lg:w-[183.39px] h-[38px] lg:h-[39.5px] px-4 bg-[#0080C5] text-white rounded-[14px] lg:rounded-[10px] flex items-center justify-center gap-2 hover:bg-sky-700 transition-all text-[12px] lg:text-[13px] font-semibold lg:tracking-[0.01em] shrink-0 lg:mt-0 mt-2"
                                >
                                    <Plus size={14} strokeWidth={2.5} className="lg:w-[24px] lg:h-[24px]" />
                                    Tambah Panduan
                                </button>
                            )}
                        </div>

                        {/* Guides Table / List */}
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                            </div>
                        ) : isError ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl mx-0">
                                <p className="text-red-500 mb-4">Gagal memuat panduan.</p>
                                <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg text-[13px] font-semibold">Coba Lagi</button>
                            </div>
                        ) : guides.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl mx-0">
                                <p className="text-slate-500 text-[13px] font-medium">Tidak ada panduan yang tersedia.</p>
                            </div>
                        ) : (
                            <>
                                {/* MOBILE LIST VIEW */}
                                <div className="flex flex-col gap-2 lg:hidden px-0">
                                    {guides.map((guide, idx) => (
                                        <div key={guide.id || idx} className="bg-white rounded-[16px] p-3 shadow-sm border-[0.8px] border-[#F0F2F8] flex items-start gap-3">
                                            {/* Number */}
                                            <div className="w-7 h-7 bg-[#0080C5]/10 rounded-[10px] flex items-center justify-center shrink-0">
                                                <span className="text-[#0080C5] text-[11px] font-bold">
                                                    {idx + 1 + (meta?.from ? meta.from - 1 : 0)}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col flex-1 gap-1.5 min-w-0">
                                                <h3 className="text-[#0A0F1E] text-[13px] font-bold leading-[20px] truncate">
                                                    {guide.judul}
                                                </h3>
                                                
                                                <div 
                                                    className="flex items-center gap-1 cursor-pointer"
                                                    onClick={() => guide.link_file ? handleViewPdf(guide.link_file, guide.judul) : guide.link_video ? handleViewVideo(guide.link_video, guide.judul) : null}
                                                >
                                                    <FileText size={11} className="text-[#0080C5]" />
                                                    <span className="text-[#0080C5] text-[11px] font-semibold">Lihat file !</span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                                    <div className="inline-flex px-2 py-0.5 bg-[#10B981]/10 rounded-full">
                                                        <span className="text-[#10B981] text-[10px] font-semibold">{guide.role_target?.name || '-'}</span>
                                                    </div>
                                                    {guide.link_file && (
                                                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EF4444]/10 rounded-full">
                                                            <FileText size={9} className="text-[#EF4444]" />
                                                            <span className="text-[#EF4444] text-[10px] font-semibold">PDF</span>
                                                        </div>
                                                    )}
                                                    {guide.link_video && (
                                                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F97316]/10 rounded-full">
                                                            <PlayCircle size={9} className="text-[#F97316]" />
                                                            <span className="text-[#F97316] text-[10px] font-semibold">VIDEO</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {!isReadOnly && (
                                                <div className="flex flex-col gap-1.5 shrink-0">
                                                    <button 
                                                        onClick={() => handleEdit(guide)}
                                                        className="w-7 h-7 flex items-center justify-center bg-[#F97316]/10 text-[#F97316] rounded-[10px] hover:bg-[#F97316] hover:text-white transition-all"
                                                    >
                                                        <Edit3 size={13} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(guide)}
                                                        className="w-7 h-7 flex items-center justify-center bg-[#EF4444]/10 text-[#EF4444] rounded-[10px] hover:bg-[#EF4444] hover:text-white transition-all"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* DESKTOP TABLE VIEW */}
                                <div className="hidden lg:block overflow-hidden lg:w-[1102px]">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-[#F0F2F8] h-[44.9px]">
                                                <th className="px-4 text-center w-[75.18px] border-l border-white"><span className="text-[11px] font-bold text-[#9298B0] tracking-[0.01em]">NO</span></th>
                                                <th className="px-4 text-center w-[259.3px]"><span className="text-[11px] font-bold text-[#9298B0] tracking-[0.01em]">JUDUL PANDUAN</span></th>
                                                <th className="px-4 text-center w-[193.34px]"><span className="text-[11px] font-bold text-[#9298B0] tracking-[0.01em]">ROLE</span></th>
                                                <th className="px-4 text-center w-[136.79px]"><span className="text-[11px] font-bold text-[#9298B0] tracking-[0.01em]">TIPE</span></th>
                                                <th className="px-4 text-center w-[295.08px]"><span className="text-[11px] font-bold text-[#9298B0] tracking-[0.01em]">DESKRIPSI</span></th>
                                                {!isReadOnly && <th className="px-4 text-center w-[140.74px]"><span className="text-[11px] font-bold text-[#9298B0] tracking-[0.01em]">AKSI</span></th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-transparent">
                                            {guides.map((guide, idx) => (
                                                <tr key={guide.id || idx} className="hover:bg-slate-50/50 transition-colors h-[76.3px] bg-white border-b border-[#9298B0]">
                                                    <td className="px-4 text-center text-[#0A0F1E] text-[13px] font-bold tracking-[0.01em]">{idx + 1 + (meta?.from ? meta.from - 1 : 0)}</td>
                                                    <td className="px-4 text-center">
                                                        <div className="flex flex-col gap-[10px] items-center">
                                                            <span className="text-[#0A0F1E] text-[13px] font-semibold tracking-[0.01em] leading-[20px]">{guide.judul}</span>
                                                            <div 
                                                                onClick={() => guide.link_file ? handleViewPdf(guide.link_file, guide.judul) : guide.link_video ? handleViewVideo(guide.link_video, guide.judul) : null}
                                                                className="text-[#0080C5] text-[11px] font-normal tracking-[0.01em] cursor-pointer"
                                                            >Lihat file !</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 text-center">
                                                        <div className="inline-flex px-[10px] py-[4px] bg-[#16A34A]/20 rounded-[20px]">
                                                            <span className="text-[#16A34A] text-[11px] font-bold tracking-[0.01em] capitalize">{guide.role_target?.name || '-'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 text-center">
                                                        <div className="flex justify-center gap-[5px]">
                                                            {guide.link_file && (
                                                                <div 
                                                                    onClick={() => handleViewPdf(guide.link_file, guide.judul)}
                                                                    className="inline-flex items-center gap-[10px] px-[10px] py-[4px] bg-[#B91C1C]/10 rounded-[20px] cursor-pointer hover:bg-[#B91C1C]/20 transition-colors"
                                                                >
                                                                    <FileText size={16} className="text-[#B91C1C]" />
                                                                    <span className="text-[#B91C1C] text-[11px] font-bold tracking-[0.01em] uppercase">PDF</span>
                                                                </div>
                                                            )}
                                                            {guide.link_video && (
                                                                <div 
                                                                    onClick={() => handleViewVideo(guide.link_video, guide.judul)}
                                                                    className="inline-flex items-center gap-[5px] px-[10px] py-[4px] bg-[#A16207]/10 rounded-[20px] cursor-pointer hover:bg-[#A16207]/20 transition-colors"
                                                                >
                                                                    <PlayCircle size={16} className="text-[#A16207]" />
                                                                    <span className="text-[#A16207] text-[11px] font-bold tracking-[0.01em] uppercase">VIDEO</span>
                                                                </div>
                                                            )}
                                                            {!guide.link_file && !guide.link_video && (
                                                                <span className="text-slate-400 text-[10px]">-</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 text-center">
                                                        <span className="text-[#0A0F1E] text-[12px] font-normal leading-[18px] tracking-[0.01em]">{guide.deskripsi || '-'}</span>
                                                    </td>
                                                    {!isReadOnly && (
                                                        <td className="px-4 text-center">
                                                            <div className="flex justify-center gap-[10px]">
                                                                <button 
                                                                    onClick={() => handleEdit(guide)}
                                                                    className="w-[24px] h-[24px] flex items-center justify-center bg-[#FB923C]/10 text-[#FB923C] rounded-[7px] hover:bg-[#FB923C] hover:text-white transition-all border-[2px] border-[#FB923C]/0 hover:border-[#FB923C]"
                                                                >
                                                                    <Edit3 size={14} strokeWidth={2.5} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDelete(guide)}
                                                                    className="w-[24px] h-[24px] flex items-center justify-center bg-[#EF4444]/10 text-[#EF4444] rounded-[7px] hover:bg-[#EF4444] hover:text-white transition-all border-[2px] border-[#EF4444]/0 hover:border-[#EF4444]"
                                                                >
                                                                    <Trash2 size={14} strokeWidth={2.5} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {/* Table Footer */}
                        {meta && meta.total > 0 && (
                            <div className="mt-4 px-4 py-3 bg-white border-[0.8px] border-[#F0F2F8] rounded-[16px] flex justify-center lg:justify-start">
                                <p className="text-[#9298B0] text-[11px] font-normal">
                                    Menampilkan {meta.to - meta.from + 1} dari {meta.total} Panduan
                                </p>
                            </div>
                        )}
                    </div>
                )}

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

                {/* Custom Viewer Modal (PDF & Video) */}
                {viewerType && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center font-['Poppins'] p-4 animate-in fade-in duration-200">
                        {/* Backdrop */}
                        <div 
                            className="absolute inset-0 bg-black/70 backdrop-blur-md" 
                            onClick={() => {
                                setViewerType(null);
                                setViewerUrl('');
                            }}
                        ></div>

                        {/* Container */}
                        <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 duration-200 border border-slate-100">
                            {/* Header */}
                            <div className="h-16 px-4 sm:px-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 gap-2">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${viewerType === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                                        {viewerType === 'pdf' ? <FileText size={16} /> : <PlayCircle size={16} />}
                                    </div>
                                    <div className="text-left min-w-0">
                                        <h4 className="text-slate-900 text-xs sm:text-sm font-bold truncate max-w-[120px] xs:max-w-[160px] sm:max-w-md">
                                            {viewerTitle}
                                        </h4>
                                        <p className="text-slate-400 text-[9px] sm:text-[10px] hidden xs:block truncate">
                                            {viewerType === 'pdf' ? 'Dokumen PDF Reader' : 'Video Player Tutorial'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                    {viewerType === 'pdf' && (
                                        <a 
                                            href={getGoogleDriveDownloadUrl(viewerUrl)} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="h-8 px-2.5 sm:px-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-bold transition-all shadow-sm shrink-0"
                                        >
                                            <Download size={13} />
                                            <span className="hidden sm:inline">Unduh PDF</span>
                                            <span className="inline sm:hidden">Unduh</span>
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

                            {/* Content Area */}
                            <div className="flex-1 bg-slate-900 relative">
                                {viewerType === 'pdf' ? (
                                    <iframe 
                                        src={getGoogleDriveEmbedUrl(viewerUrl)} 
                                        className="w-full h-full border-none"
                                        allow="autoplay"
                                        title={viewerTitle}
                                    ></iframe>
                                ) : (
                                    <iframe 
                                        src={getVideoEmbedUrl(viewerUrl)} 
                                        className="w-full h-full border-none"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                        title={viewerTitle}
                                    ></iframe>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default PanduanPenggunaanPage;
