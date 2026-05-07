import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import DetailDampinganModal from '../../components/modals/DetailDampinganModal';
import { LayoutGrid, ChevronLeft, Search, ChevronRight, Loader2 } from 'lucide-react';
import { useFasilitatorGrups } from '../../hooks/queries/useGrupDampinganQuery';

const PAGE_SIZE = 9;

// ─── Detail View ─────────────────────────────────────────────────────────────
const GrupDetailView = ({ grup, onBack }) => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selectedAnggota, setSelectedAnggota] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const anggotaList = grup.anggota || [];

    const filtered = anggotaList.filter(a =>
        a.nama.toLowerCase().includes(search.toLowerCase()) ||
        a.no_anggota?.includes(search) ||
        a.alamat?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <>
            {/* Header breadcrumb */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                    <ChevronLeft size={14} /> Kembali
                </button>
                <div>
                    <h3 className="text-sm font-bold text-[#0A0F1E]">{grup.nama_grup}</h3>
                    <p className="text-[10px] text-[#0080C5] font-semibold">{grup.bidang?.nama_bidang} · {grup.kabupaten?.name}, {grup.provinsi?.name}</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Cari nama, no.anggota, alamat..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0080C5] transition-all text-slate-600"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100">
                            {['NO. ANGGOTA','NAMA','JENIS KELAMIN','ALAMAT','BIDANG DAMPINGAN','GRUP DAMPINGAN','AKSI'].map(h => (
                                <th key={h} className="py-3 px-4 text-left text-[#9298B0] text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paged.map((item, i) => (
                            <tr key={item.id || i} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-4 px-4 text-[#0080C5] text-xs font-semibold whitespace-nowrap">{item.no_anggota || '-'}</td>
                                <td className="py-4 px-4 text-[#0A0F1E] text-xs font-bold whitespace-nowrap">{item.nama}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${item.jenis_kelamin === 'L' ? 'bg-blue-50 text-[#0080C5]' : 'bg-pink-50 text-pink-500'}`}>
                                        {item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-[#6B7280] text-xs max-w-[180px]">{item.alamat || '-'}</td>
                                <td className="py-4 px-4 text-[#0A0F1E] text-xs font-medium whitespace-nowrap">{grup.bidang?.nama_bidang || '-'}</td>
                                <td className="py-4 px-4 text-[#0A0F1E] text-xs font-bold whitespace-nowrap">{grup.nama_grup || '-'}</td>
                                <td className="py-4 px-4">
                                    <button
                                        onClick={() => { setSelectedAnggota(item); setIsDetailOpen(true); }}
                                        className="h-8 px-4 bg-[#0080C5] text-white rounded-lg text-[11px] font-semibold hover:bg-sky-700 transition-all"
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-slate-400 text-xs">Menampilkan {(page-1)*PAGE_SIZE + 1}-{Math.min(page*PAGE_SIZE, filtered.length)} dari {filtered.length} data</p>
                {totalPages > 1 && (
                    <div className="flex items-center gap-1.5">
                        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition-all"><ChevronLeft size={14} /></button>
                        {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
                            <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-[11px] font-bold transition-all ${page === n ? 'bg-[#0080C5] text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{n}</button>
                        ))}
                        <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition-all"><ChevronRight size={14} /></button>
                    </div>
                )}
            </div>

            <DetailDampinganModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} data={selectedAnggota} />
        </>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const KelolaDampinganPage = () => {
    const [selectedGrup, setSelectedGrup] = useState(null);
    const [page, setPage] = useState(1);

    const { data: grupData, isLoading, isError, refetch } = useFasilitatorGrups({
        page: page,
    });

    const grupList = grupData?.data || [];
    const meta = grupData?.meta || {};

    return (
        <AdminLayout title="Kelola Dampingan">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200">

                    {selectedGrup ? (
                        <GrupDetailView grup={selectedGrup} onBack={() => setSelectedGrup(null)} />
                    ) : (
                        <>
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-9 h-9 bg-blue-50 text-[#0080C5] rounded-xl flex items-center justify-center">
                                    <LayoutGrid size={18} />
                                </div>
                                <h2 className="text-[#0A0F1E] text-base font-bold tracking-tight">Daftar Grup Dampingan</h2>
                            </div>

                            {/* Table */}
                            {isLoading ? (
                                <div className="flex justify-center items-center py-20">
                                    <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                                </div>
                            ) : isError ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <p className="text-red-500 mb-4">Gagal memuat data grup dampingan.</p>
                                    <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                                </div>
                            ) : grupList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <p className="text-slate-500">Tidak ada data grup dampingan.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-100">
                                                    {['NAMA GRUP','BIDANG DAMPINGAN','PROVINSI','KABUPATEN','KECAMATAN'].map(h => (
                                                        <th key={h} className="py-3 px-4 text-left text-[#9298B0] text-[10px] font-semibold uppercase tracking-widest">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {grupList.map((item, i) => (
                                                    <tr
                                                        key={item.id || i}
                                                        onClick={() => setSelectedGrup(item)}
                                                        className="hover:bg-[#0080C5]/5 transition-colors cursor-pointer group"
                                                    >
                                                        <td className="py-5 px-4">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="text-[#0A0F1E] text-sm font-bold group-hover:text-[#0080C5] transition-colors">{item.nama_grup}</span>
                                                                <span className="text-[#9298B0] text-xs">{item.anggota_count || item.anggota?.length || 0} anggota</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-4 text-[#0A0F1E] text-xs font-bold">{item.bidang?.nama_bidang || '-'}</td>
                                                        <td className="py-5 px-4 text-[#9298B0] text-xs">{item.provinsi?.name || '-'}</td>
                                                        <td className="py-5 px-4 text-[#9298B0] text-xs">{item.kabupaten?.name || '-'}</td>
                                                        <td className="py-5 px-4 text-[#9298B0] text-xs">{item.kecamatan?.name || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {meta && meta.total > 0 && (
                                        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <p className="text-slate-400 text-xs">Menampilkan {meta.from}-{meta.to} dari <span className="font-bold text-slate-950">{meta.total}</span> Grup Dampingan</p>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                                                    disabled={page === 1}
                                                    className="p-1 border rounded disabled:opacity-50"
                                                >
                                                    <ChevronLeft size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                                    disabled={page === meta.last_page}
                                                    className="p-1 border rounded disabled:opacity-50"
                                                >
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default KelolaDampinganPage;
