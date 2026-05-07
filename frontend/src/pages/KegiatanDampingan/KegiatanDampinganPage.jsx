import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import DetailKegiatanModal from '../../components/modals/DetailKegiatanModal';
import { 
    Search, 
    ChevronDown, 
    Calendar, 
    MapPin, 
    FileText, 
    ChevronLeft, 
    ChevronRight,
    Filter,
    Loader2
} from 'lucide-react';
import { useKegiatansAdmin } from '../../hooks/queries/useKegiatanQuery';

const KegiatanDampinganPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const handleDetail = (item) => {
        setSelectedActivity(item);
        setIsDetailModalOpen(true);
    };

    const [page, setPage] = useState(1);

    const { data: kegiatanData, isLoading, isError, refetch } = useKegiatansAdmin({
        page: page,
        search: searchTerm
    });

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const activities = kegiatanData?.data || [];
    const meta = kegiatanData?.meta || {};

    return (
        <AdminLayout title="Kegiatan Dampingan">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                
                {/* Main Content Container */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB] min-h-[1000px] flex flex-col">
                    
                    {/* 1. Search Bar (Full Width) */}
                    <div className="relative mb-4">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9298B0]">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari judul kegiatan, bidang, atau grup dampingan..."
                            className="w-full h-11 pl-12 pr-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-[#9298B0] font-medium transition-all"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* 2. Filters Row */}
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        {/* Dari Tanggal */}
                        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                            <label className="text-[#9298B0] text-[11px] font-semibold ml-1">Dari tanggal :</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9298B0]" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="dd/mm/yy"
                                    className="w-full h-10 pl-10 pr-4 rounded-[10px] border border-gray-200 text-[11px] font-semibold text-[#9298B0] focus:outline-none focus:border-[#0080C5]"
                                />
                            </div>
                        </div>

                        {/* Sampai Tanggal */}
                        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                            <label className="text-[#9298B0] text-[11px] font-semibold ml-1">Sampai tanggal :</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9298B0]" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="dd/mm/yy"
                                    className="w-full h-10 pl-10 pr-4 rounded-[10px] border border-gray-200 text-[11px] font-semibold text-[#9298B0] focus:outline-none focus:border-[#0080C5]"
                                />
                            </div>
                        </div>

                        {/* Bidang */}
                        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                            <label className="text-[#9298B0] text-[11px] font-semibold ml-1">Bidang :</label>
                            <div className="relative">
                                <select className="w-full h-10 pl-4 pr-10 rounded-[10px] border border-gray-200 text-[11px] font-semibold text-[#9298B0] appearance-none focus:outline-none focus:border-[#0080C5] cursor-pointer">
                                    <option>Semua Bidang</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9298B0] pointer-events-none" size={18} />
                            </div>
                        </div>

                        {/* Urutan */}
                        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                            <label className="text-[#9298B0] text-[11px] font-semibold ml-1">Urutan :</label>
                            <div className="relative">
                                <select className="w-full h-10 pl-4 pr-10 rounded-[10px] border border-gray-200 text-[11px] font-semibold text-[#9298B0] appearance-none focus:outline-none focus:border-[#0080C5] cursor-pointer">
                                    <option>Terbaru</option>
                                    <option>Terlama</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9298B0] pointer-events-none" size={18} />
                            </div>
                        </div>
                    </div>

                    {/* 3. Card Grid */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20 flex-1">
                            <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20 flex-1">
                            <p className="text-red-500 mb-4">Gagal memuat data kegiatan.</p>
                            <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 flex-1">
                            <p className="text-slate-500">Tidak ada data kegiatan ditemukan.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                            {activities.map((item, index) => (
                                <div 
                                    key={item.id || index} 
                                    onClick={() => handleDetail(item)}
                                    className="flex flex-col bg-white rounded-2xl border border-[#F1F5F9] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                                >
                                    {/* Image Placeholder */}
                                    <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                                        <img 
                                            src={item.foto_kegiatan || 'https://placehold.co/330x180/0080C5/FFFFFF?text=Foto+Kegiatan'} 
                                            alt="Kegiatan" 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-5 flex flex-col items-start gap-3">
                                        {/* Bidang Badge */}
                                        <div className="px-3 py-1 bg-[#0080C5]/10 rounded-full">
                                            <span className="text-[#0080C5] text-[10px] font-bold tracking-tight">{item.grup_dampingan?.bidang?.nama_bidang || 'Bidang'}</span>
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center gap-1.5 text-[#9298B0]">
                                            <Calendar size={14} />
                                            <span className="text-[11px] font-semibold">{item.tanggal_kegiatan}</span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-[#0A0F1E] text-sm font-bold leading-relaxed line-clamp-2 min-h-[40px] group-hover:text-[#0080C5] transition-colors">
                                            {item.judul_kegiatan}
                                        </h3>

                                        {/* Button */}
                                        <div className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold">
                                            <FileText size={18} />
                                            <span className="text-[11px] font-semibold tracking-tight">Lihat Laporan</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 4. Pagination (Bottom) */}
                    {meta && meta.total > 0 && (
                        <div className="mt-10 flex items-center justify-between border-t border-slate-50 pt-6">
                            <span className="text-[#9298B0] text-[11px] font-medium">
                                Menampilkan {meta.from}-{meta.to} dari {meta.total} data
                            </span>
                            <div className="flex items-center gap-1.5">
                                <button 
                                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                                    disabled={page === 1}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-100 text-[#0A0F1E] hover:bg-slate-50 transition-colors disabled:opacity-50"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold">
                                    {page}
                                </button>
                                <button 
                                    onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                    disabled={page === meta.last_page}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-100 text-[#0A0F1E] hover:bg-slate-50 transition-colors disabled:opacity-50"
                                >
                                    <ChevronRight size={18} />
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
