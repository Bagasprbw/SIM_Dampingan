import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import DetailKegiatanModal from '../../components/modals/DetailKegiatanModal';
import { 
    Search, 
    ChevronDown, 
    Calendar, 
    FileText, 
    ChevronLeft, 
    ChevronRight,
    Loader2
} from 'lucide-react';
import { useKegiatansAdmin } from '../../hooks/queries/useKegiatanQuery';
import { useBidangs } from '../../hooks/queries/useBidangQuery';
import FilterDropdown from '../../components/common/FilterDropdown';

const KegiatanDampinganPage = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const baseUrl = apiUrl.replace('/api', '');

    const [searchTerm, setSearchTerm] = useState('');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [dariTanggal, setDariTanggal] = useState('');
    const [sampaiTanggal, setSampaiTanggal] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    const handleDetail = (item) => {
        setSelectedActivity(item);
        setIsDetailModalOpen(true);
    };

    const [page, setPage] = useState(1);
    const [bidangFilter, setBidangFilter] = useState(null);

    const { data: bidangData } = useBidangs();
    const bidangList = Array.isArray(bidangData?.data) ? bidangData.data : [];

    const { data: kegiatanData, isLoading, isError, refetch } = useKegiatansAdmin({
        page: page,
        search: searchTerm,
        bidang_id: bidangFilter,
        dari_tanggal: dariTanggal || undefined,
        sampai_tanggal: sampaiTanggal || undefined,
        sort: sortOrder,
    });

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const activities = kegiatanData?.data || [];
    const meta = kegiatanData?.meta || {};

    return (
        <AdminLayout title="Kegiatan Dampingan">
            <div className="font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                
                {/* Main Content Container */}
                <div className="bg-transparent lg:bg-white rounded-none lg:rounded-2xl lg:p-7 shadow-none lg:shadow-sm border-0 lg:border lg:border-[#E5E7EB] min-h-[calc(100vh-160px)] flex flex-col m-0 lg:m-8">
                    
                    {/* 1. Search Bar (Full Width) */}
                    <div className="relative mb-4">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari judul kegiatan, bidang, atau grup..."
                            className="w-full h-11 lg:h-12 pl-12 pr-4 bg-white rounded-xl lg:rounded-[10px] border border-slate-200 lg:border-gray-100 focus:border-[#0080C5] focus:outline-none text-[13px] lg:text-xs text-slate-800 lg:text-[#9298B0] font-medium transition-all shadow-sm lg:shadow-none"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* 2. Filters Row */}
                    <div className="grid grid-cols-2 lg:flex lg:flex-wrap items-center gap-2 lg:gap-4 mb-6 lg:mb-8">
                        {/* Dari Tanggal */}
                        <div className="flex flex-col gap-1 lg:gap-1.5 w-full lg:flex-1 lg:min-w-[200px]">
                            <label className="text-[#9298B0] text-[10px] lg:text-[11px] font-semibold ml-1">Dari tanggal :</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9298B0] pointer-events-none" size={14} />
                                <input 
                                    type="date" 
                                    value={dariTanggal}
                                    onChange={(e) => { setDariTanggal(e.target.value); setPage(1); }}
                                    className="w-full h-10 lg:h-10 pl-9 pr-3 bg-white rounded-xl lg:rounded-[10px] border border-slate-200 lg:border-gray-200 text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-[#0080C5] shadow-sm lg:shadow-none"
                                />
                            </div>
                        </div>

                        {/* Sampai Tanggal */}
                        <div className="flex flex-col gap-1 lg:gap-1.5 w-full lg:flex-1 lg:min-w-[200px]">
                            <label className="text-[#9298B0] text-[10px] lg:text-[11px] font-semibold ml-1">Sampai tanggal :</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9298B0] pointer-events-none" size={14} />
                                <input 
                                    type="date" 
                                    value={sampaiTanggal}
                                    onChange={(e) => { setSampaiTanggal(e.target.value); setPage(1); }}
                                    className="w-full h-10 lg:h-10 pl-9 pr-3 bg-white rounded-xl lg:rounded-[10px] border border-slate-200 lg:border-gray-200 text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-[#0080C5] shadow-sm lg:shadow-none"
                                />
                            </div>
                        </div>

                        {/* Bidang */}
                        <div className="flex flex-col gap-1 lg:gap-1.5 w-full lg:flex-1 lg:min-w-[200px]">
                            <label className="text-[#9298B0] text-[10px] lg:text-[11px] font-semibold ml-1 hidden lg:block">Bidang :</label>
                            <FilterDropdown
                                placeholder="Semua Bidang"
                                options={bidangList}
                                value={bidangFilter}
                                valueKey="id_bidang"
                                labelKey="name"
                                onChange={(v) => { setBidangFilter(v); setPage(1); }}
                            />
                        </div>

                        {/* Urutan */}
                        <div className="flex flex-col gap-1 lg:gap-1.5 w-full lg:flex-1 lg:min-w-[200px]">
                            <label className="text-[#9298B0] text-[10px] lg:text-[11px] font-semibold ml-1 hidden lg:block">Urutan :</label>
                            <div className="relative">
                                <select 
                                    value={sortOrder}
                                    onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
                                    className="w-full h-10 lg:h-10 pl-4 pr-10 bg-white rounded-xl lg:rounded-[10px] border border-slate-200 lg:border-gray-200 text-[11px] font-semibold text-[#9298B0] appearance-none focus:outline-none focus:border-[#0080C5] cursor-pointer shadow-sm lg:shadow-none"
                                >
                                    <option value="desc">Terbaru</option>
                                    <option value="asc">Terlama</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9298B0] pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* 3. Card Grid */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20 flex-1">
                            <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20 flex-1 bg-white rounded-2xl">
                            <p className="text-red-500 mb-4">Gagal memuat data kegiatan.</p>
                            <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 flex-1 bg-white rounded-2xl">
                            <p className="text-slate-500">Tidak ada data kegiatan ditemukan.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                            {activities.map((item, index) => (
                                <div 
                                    key={item.id || index} 
                                    onClick={() => handleDetail(item)}
                                    className="flex flex-col bg-white rounded-2xl border border-slate-200 lg:border-[#E5E7EB] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group shadow-sm w-full"
                                >
                                    {/* Image Placeholder */}
                                    <div className="h-44 lg:h-48 w-full bg-slate-100 overflow-hidden relative shrink-0">
                                        <img 
                                            src={item.foto_kegiatans?.[0]?.file ? `${baseUrl}/storage/${item.foto_kegiatans[0].file}` : 'https://placehold.co/330x180/0080C5/FFFFFF?text=Foto+Kegiatan'} 
                                            alt="Kegiatan" 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-4 lg:p-5 flex flex-col items-start gap-3">
                                         {/* Bidang Badge */}
                                         <div className="px-3 py-1 bg-sky-50 lg:bg-[#0080C5]/5 rounded-full border border-[#0080C5]/20">
                                             <span className="text-[#0080C5] text-[10px] font-bold tracking-tight">{item.bidang?.name || 'Bidang'}</span>
                                         </div>
 
                                         {/* Date */}
                                         <div className="flex items-center gap-1.5 text-[#9298B0]">
                                             <Calendar size={14} />
                                             <span className="text-[11px] font-semibold">{item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
                                         </div>
 
                                         {/* Title */}
                                         <h3 className="text-[#0A0F1E] text-[13px] lg:text-[14px] font-bold leading-snug line-clamp-2 min-h-[42px] group-hover:text-[#0080C5] transition-colors">
                                             {item.judul}
                                         </h3>

                                        {/* Button */}
                                        <div className="w-fit h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm mt-1">
                                            <FileText size={14} />
                                            <span className="text-[11px] font-bold tracking-tight">Lihat Laporan</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 4. Pagination (Bottom) */}
                    {meta && meta.total > 0 && (
                        <div className="mt-auto flex flex-col sm:flex-row items-center justify-center lg:justify-between border-t-0 lg:border-t lg:border-slate-50 pt-6 gap-4">
                            <span className="text-[#9298B0] text-[11px] font-medium text-center sm:text-left">
                                Menampilkan {meta.from}-{meta.to} dari {meta.total} data
                            </span>
                            <div className="flex items-center gap-2 lg:gap-1.5">
                                <button 
                                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                                    disabled={page === 1}
                                    className="w-8 h-8 lg:w-7 lg:h-7 flex items-center justify-center rounded-lg border border-slate-200 lg:border-gray-100 text-[#0A0F1E] bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm lg:shadow-none"
                                >
                                    <ChevronLeft size={18} className="lg:w-[14px] lg:h-[14px]" />
                                </button>
                                <button className="h-8 lg:h-9 px-3 lg:px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[12px] lg:text-[13px] font-semibold">
                                    {page}
                                </button>
                                <button 
                                    onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                    disabled={page === meta.last_page}
                                    className="w-8 h-8 lg:w-7 lg:h-7 flex items-center justify-center rounded-lg border border-slate-200 lg:border-gray-100 text-[#0A0F1E] bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm lg:shadow-none"
                                >
                                    <ChevronRight size={18} className="lg:w-[14px] lg:h-[14px]" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detail */}
            <DetailKegiatanModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
                data={selectedActivity} 
            />
        </AdminLayout>
    );
};

export default KegiatanDampinganPage;
