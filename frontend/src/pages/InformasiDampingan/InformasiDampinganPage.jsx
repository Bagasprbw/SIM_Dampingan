import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
    Search, 
    Printer,
    Users,
    MapPin,
    Leaf,
    User,
    ChevronRight,
    ChevronLeft,
    Loader2
} from 'lucide-react';
import DetailDampinganModal from '../../components/modals/DetailDampinganModal';
import { usePjGrup } from '../../hooks/queries/useGrupDampinganQuery';

const InformasiDampinganPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 9;

    const { data: pjGrupData, isLoading, isError, refetch } = usePjGrup();

    const grup = pjGrupData?.data; // { id_grup_dampingan, name, ..., anggota_grup_dampingans: [...] }
    const anggotaList = grup?.anggota_grup_dampingans || [];

    const filtered = anggotaList.filter(a =>
        String(a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(a.no_anggota || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(a.alamat || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleDetail = (item) => {
        setSelectedData(item);
        setIsDetailOpen(true);
    };

    if (isLoading) {
        return (
            <AdminLayout title="Informasi Dampingan">
                <div className="flex justify-center items-center py-20 min-h-screen bg-[#F0F2F8]">
                    <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                </div>
            </AdminLayout>
        );
    }

    if (isError || !grup) {
        return (
            <AdminLayout title="Informasi Dampingan">
                <div className="flex flex-col items-center justify-center py-20 min-h-screen bg-[#F0F2F8]">
                    <p className="text-red-500 mb-4">Gagal memuat informasi dampingan.</p>
                    <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                </div>
            </AdminLayout>
        );
    }

    // Ambil list fasilitator untuk ditampilkan di header
    const fasilitatorList = grup.grup_fasilitators?.map(f => f.fasilitator?.name).join(', ') || '-';

    return (
        <AdminLayout title="Informasi Dampingan">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                
                {/* Header Card (Kelompok Info) */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200 mb-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-[#0080C5] rounded-xl flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-[#0A0F1E] text-lg font-bold tracking-tight">{grup.name}</h2>
                                <p className="text-[#0080C5] text-[11px] font-semibold">Grup Dampingan</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
                                    <Leaf size={16} className="text-[#10B981]" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">BIDANG DAMPINGAN</span>
                                    <span className="text-[#0A0F1E] text-sm font-bold">{grup.bidang?.name || '-'}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#FFF7ED] flex items-center justify-center shrink-0">
                                    <MapPin size={16} className="text-[#F59E0B]" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">LOKASI DAMPINGAN</span>
                                    <span className="text-[#0A0F1E] text-sm font-bold">
                                        {(() => {
                                            const parts = [];
                                            if (grup.level_dampingan === 'provinsi') {
                                                if (grup.provinsi?.name) parts.push(grup.provinsi.name);
                                            } else if (grup.level_dampingan === 'kabupaten') {
                                                if (grup.provinsi?.name) parts.push(grup.provinsi.name);
                                                if (grup.kabupaten?.name) parts.push(grup.kabupaten.name);
                                            } else if (grup.level_dampingan === 'kecamatan') {
                                                if (grup.provinsi?.name) parts.push(grup.provinsi.name);
                                                if (grup.kabupaten?.name) parts.push(grup.kabupaten.name);
                                                if (grup.kecamatan?.name) parts.push(grup.kecamatan.name);
                                            } else if (grup.level_dampingan === 'pusat') {
                                                parts.push('Nasional');
                                            }
                                            return parts.join(', ');
                                        })()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                    <User size={16} className="text-[#0080C5]" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">FASILITATOR</span>
                                    <span className="text-[#0A0F1E] text-sm font-bold truncate max-w-[200px]" title={fasilitatorList}>
                                        {fasilitatorList}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200">
                    
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Cari nama, no.anggota, alamat..." 
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0080C5] transition-all text-slate-600"
                            value={searchTerm}
                            onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}
                        />
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border-spacing-0">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-4 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">NO. ANGGOTA</th>
                                    <th className="py-4 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">NAMA</th>
                                    <th className="py-4 px-4 text-center text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">JENIS KELAMIN</th>
                                    <th className="py-4 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">ALAMAT</th>
                                    <th className="py-4 px-4 text-center text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">AKSI</th>
                                    <th className="py-4 px-4 text-center text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">DETAIL</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F2F8]">
                                {paged.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-10 text-center text-slate-500 text-xs">Tidak ada data anggota.</td>
                                    </tr>
                                ) : paged.map((item, index) => (
                                    <tr key={item.id_anggota_grup || index} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-4 text-[#0080C5] text-[11px] font-semibold whitespace-nowrap">{item.no_anggota || '-'}</td>
                                        <td className="py-4 px-4 text-left whitespace-nowrap">
                                            <span className="text-[#0A0F1E] text-[11px] font-bold">{item.name}</span>
                                        </td>
                                        <td className="py-4 px-4 text-center whitespace-nowrap">
                                            <div className={`inline-flex items-center px-3 py-1 rounded-full ${item.jenis_kelamin === 'L' ? 'bg-blue-50 text-[#0080C5]' : 'bg-pink-50 text-pink-500'} text-[10px] font-bold`}>
                                                {item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-left text-[#6B7280] text-[11px] font-medium max-w-[180px] truncate">{item.alamat || '-'}</td>
                                        <td className="py-4 px-4 text-center">
                                            <button className="text-[#0080C5] hover:text-[#006da8] transition-colors">
                                                <Printer size={18} />
                                            </button>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <button 
                                                onClick={() => handleDetail(item)}
                                                className="h-8 px-4 bg-[#0080C5] text-white rounded-lg inline-flex items-center justify-center hover:bg-sky-700 transition-all shadow-sm text-[11px] font-semibold"
                                            >
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 0 && (
                        <div className="mt-6 flex justify-between items-center">
                            <span className="text-[#9298B0] text-[11px] font-medium">Menampilkan {(page-1)*PAGE_SIZE + 1}-{Math.min(page*PAGE_SIZE, filtered.length)} dari {filtered.length} data</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition-all">
                                    <ChevronLeft size={16} />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
                                    <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-[11px] font-bold transition-all ${page === n ? 'bg-[#0080C5] text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{n}</button>
                                ))}
                                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition-all">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                {/* Modals */}
                <DetailDampinganModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} data={selectedData} />
            </div>
        </AdminLayout>
    );
};

export default InformasiDampinganPage;
