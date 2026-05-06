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
    Filter
} from 'lucide-react';

const KegiatanDampinganPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const handleDetail = (item) => {
        setSelectedActivity(item);
        setIsDetailModalOpen(true);
    };

    const activities = [
        ...Array(6).fill({
            id: 1,
            image: 'https://placehold.co/330x180/0080C5/FFFFFF?text=Foto+Kegiatan',
            bidang: 'Pertanian Terpadu',
            tanggal: '15/11/1945',
            judul: 'Pelatihan Wirausaha Mandiri Bagi Komunitas Difabel Sleman'
        })
    ];

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
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                        {activities.map((item, index) => (
                            <div 
                                key={index} 
                                onClick={() => handleDetail(item)}
                                className="flex flex-col bg-white rounded-2xl border border-[#F1F5F9] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                            >
                                {/* Image Placeholder */}
                                <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                                    <img 
                                        src={item.image} 
                                        alt="Kegiatan" 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                </div>
                                
                                {/* Content */}
                                <div className="p-5 flex flex-col items-start gap-3">
                                    {/* Bidang Badge */}
                                    <div className="px-3 py-1 bg-[#0080C5]/10 rounded-full">
                                        <span className="text-[#0080C5] text-[10px] font-bold tracking-tight">{item.bidang}</span>
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-center gap-1.5 text-[#9298B0]">
                                        <Calendar size={14} />
                                        <span className="text-[11px] font-semibold">{item.tanggal}</span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-[#0A0F1E] text-sm font-bold leading-relaxed line-clamp-2 min-h-[40px] group-hover:text-[#0080C5] transition-colors">
                                        {item.judul}
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

                    {/* 4. Pagination (Bottom) */}
                    <div className="mt-10 flex items-center justify-between border-t border-slate-50 pt-6">
                        <span className="text-[#9298B0] text-[11px] font-medium">Menampilkan 1-10 dari 15 data</span>
                        <div className="flex items-center gap-1.5">
                            <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-100 text-[#0A0F1E] hover:bg-slate-50 transition-colors">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold">
                                1
                            </button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-100 text-[#0A0F1E] hover:bg-slate-50 transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
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
