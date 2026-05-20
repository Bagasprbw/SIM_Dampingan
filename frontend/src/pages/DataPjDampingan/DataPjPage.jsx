import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
    Search, 
    ChevronDown, 
    Edit,
    Trash2, 
    Lock, 
    ChevronLeft, 
    ChevronRight,
    FileText,
    Eye
} from 'lucide-react';

import EditPjModal from '../../components/modals/EditPjModal';
import DeletePjModal from '../../components/modals/DeletePjModal';
import ResetPjPasswordModal from '../../components/modals/ResetPjPasswordModal';
import PjDetailModal from '../../components/modals/PjDetailModal';
import { usePjGrups } from '../../hooks/queries/usePjGrupQuery';
import { Loader2 } from 'lucide-react';
import FilterDropdown from '../../components/common/FilterDropdown';
import { useProvinsi, useKabupaten, useKecamatan } from '../../hooks/queries/useWilayahQuery';
import { isSuperAdmin } from '../../utils/permissionUtils';

const DataPjPage = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPj, setSelectedPj] = useState(null);
    const [expandedCardId, setExpandedCardId] = useState(null);

    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter State
    const [provinsiFilter, setProvinsiFilter] = useState(null);
    const [kabupatenFilter, setKabupatenFilter] = useState(null);
    const [kecamatanFilter, setKecamatanFilter] = useState(null);

    // Wilayah Queries
    const { data: provinsiOptions = [], isLoading: loadingProv } = useProvinsi();
    const { data: kabupatenOptions = [], isLoading: loadingKab } = useKabupaten(provinsiFilter);
    const { data: kecamatanOptions = [], isLoading: loadingKec } = useKecamatan(kabupatenFilter);

    const { data: pjData, isLoading, isError, refetch } = usePjGrups({
        page: page,
        search: searchQuery,
        kode_prov: provinsiFilter,
        kode_kab: kabupatenFilter,
        kode_kec: kecamatanFilter
    });

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const toggleCard = (id) => {
        if (expandedCardId === id) {
            setExpandedCardId(null);
        } else {
            setExpandedCardId(id);
        }
    };

    const dataPj = pjData?.data || [];
    const meta = pjData?.meta || {};

    return (
        <AdminLayout title="Data PJ Dampingan">
            <div className="font-['Poppins']">
                {/* Main Card Container */}
                <div className="bg-transparent lg:bg-white rounded-none lg:rounded-2xl shadow-none lg:shadow-sm border-0 lg:border lg:border-slate-100 p-0 lg:p-7">
                    
                    {/* Header Action Row */}
                    <div className="flex justify-end items-center mb-4 lg:mb-6">
                        <button className="w-full lg:w-auto h-10 lg:h-9 px-4 bg-[#22C55E] text-white rounded-xl lg:rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-sm text-[13px] font-semibold">
                            <FileText size={18} />
                            <span>Cetak Data</span>
                            <ChevronDown size={18} />
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="space-y-3 lg:space-y-6 mb-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                                <Search size={18} />
                            </div>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 lg:border-2 lg:border-[#F1F5F9] rounded-xl lg:rounded-[10px] focus:border-[#0080C5] focus:outline-none text-[13px] lg:text-xs text-[#0A0F1E] placeholder:text-slate-400 transition-all text-left shadow-sm lg:shadow-none"
                                placeholder="Cari nama, username, grup dampingan..."
                            />
                        </div>

                        {/* Filter Section */}
                        <div className="grid grid-cols-2 lg:flex lg:flex-wrap items-center gap-2 lg:gap-3">
                            <div className="w-full lg:w-auto col-span-2 sm:col-span-1">
                                <FilterDropdown
                                    placeholder="Pilih Provinsi"
                                    options={provinsiOptions}
                                    value={provinsiFilter}
                                    isLoading={loadingProv}
                                    valueKey="kode"
                                    labelKey="name"
                                    onChange={(v) => { setProvinsiFilter(v); setKabupatenFilter(null); setKecamatanFilter(null); setPage(1); }}
                                />
                            </div>
                            <div className="w-full lg:w-auto col-span-2 sm:col-span-1">
                                <FilterDropdown
                                    placeholder="Pilih Kabupaten"
                                    options={kabupatenOptions}
                                    value={kabupatenFilter}
                                    isLoading={loadingKab}
                                    disabled={!provinsiFilter}
                                    valueKey="kode"
                                    labelKey="name"
                                    onChange={(v) => { setKabupatenFilter(v); setKecamatanFilter(null); setPage(1); }}
                                />
                            </div>
                            <div className="w-full lg:w-auto col-span-2">
                                <FilterDropdown
                                    placeholder="Pilih Kecamatan"
                                    options={kecamatanOptions}
                                    value={kecamatanFilter}
                                    isLoading={loadingKec}
                                    disabled={!kabupatenFilter}
                                    valueKey="kode"
                                    labelKey="name"
                                    onChange={(v) => { setKecamatanFilter(v); setPage(1); }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl">
                            <p className="text-red-500 mb-4">Gagal memuat data PJ Dampingan.</p>
                            <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                        </div>
                    ) : dataPj.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl">
                            <p className="text-slate-500">Tidak ada data PJ Dampingan ditemukan.</p>
                        </div>
                    ) : (
                        <>
                            {/* MOBILE LIST VIEW */}
                            <div className="flex flex-col gap-3 lg:hidden">
                                {dataPj.map((item, index) => {
                                    const isExpanded = expandedCardId === (item.id_user || item.id || index);
                                    
                                    return (
                                        <div key={item.id_user || item.id || index} className="bg-white rounded-[16px] p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleCard(item.id_user || item.id || index)}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-[#0080C5] text-white rounded-xl flex items-center justify-center text-[13px] font-bold shrink-0">
                                                        {meta.from ? meta.from + index : index + 1}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[#0A0F1E] text-[13px] font-bold">{item.name}</span>
                                                        <span className="text-[#9298B0] text-[11px]">{item.username}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setSelectedPj(item); setIsDetailModalOpen(true); }}
                                                        className="h-7 px-3 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-1 hover:bg-sky-700 transition-all text-[11px] font-semibold"
                                                    >
                                                        Detail
                                                    </button>
                                                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </div>
                                            </div>
                                            
                                            {isExpanded && (
                                                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 animate-fadeIn">
                                                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                                                        <div className="col-span-2">
                                                            <span className="text-slate-400 block mb-0.5">Grup Dampingan</span>
                                                            <span className="text-slate-800 font-medium whitespace-pre-wrap">
                                                                {item.grup_dampingans_pengurus?.map(g => g.name).join(', ') || '-'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap items-center justify-end gap-2 mt-2">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setSelectedPj(item); setIsEditModalOpen(true); }}
                                                            className="px-3 py-1.5 rounded-lg bg-[#FB923C]/10 text-[#FB923C] hover:bg-[#FB923C] hover:text-white transition-all text-[11px] font-semibold flex items-center gap-1.5"
                                                        >
                                                            <Edit size={12} /> Edit
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setSelectedPj(item); setIsDeleteModalOpen(true); }}
                                                            className="px-3 py-1.5 rounded-lg bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all text-[11px] font-semibold flex items-center gap-1.5"
                                                        >
                                                            <Trash2 size={12} /> Hapus
                                                        </button>
                                                        {isSuperAdmin() && (
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); setSelectedPj(item); setIsResetModalOpen(true); }}
                                                                className="px-3 py-1.5 rounded-lg bg-[#FBBF24]/10 text-[#FBBF24] hover:bg-[#FBBF24] hover:text-white transition-all text-[11px] font-semibold flex items-center gap-1.5"
                                                            >
                                                                <Lock size={12} /> Reset
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* DESKTOP TABLE VIEW */}
                            <div className="hidden lg:block overflow-x-auto text-left">
                                <table className="w-full text-left border-collapse text-left">
                                    <thead>
                                        <tr className="bg-slate-100 border-b-2 border-slate-100 text-left">
                                            <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider rounded-tl-xl w-12 text-center text-left">No</th>
                                            <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider text-left">Nama</th>
                                            <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider text-left">Username</th>
                                            <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider text-left">Grup Dampingan</th>
                                            <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider text-center w-32">Aksi</th>
                                            <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider text-center rounded-tr-xl w-24">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-left">
                                        {dataPj.map((item, index) => (
                                            <tr key={item.id_user || item.id || index} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="py-2.5 px-4 text-center border-b border-[#F1F5F9] text-[#9298B0] text-xs font-medium">
                                                    {meta.from ? meta.from + index : index + 1}
                                                </td>
                                                <td className="py-2.5 px-4 border-b border-[#F1F5F9] text-[#0080C5] text-xs font-medium text-left">{item.name}</td>
                                                <td className="py-2.5 px-4 border-b border-[#F1F5F9] text-[#0080C5] text-xs font-normal text-left">{item.username}</td>
                                                <td className="py-2.5 px-4 border-b border-[#F1F5F9] text-[#0A0F1E] text-xs font-normal text-left">
                                                    {item.grup_dampingans_pengurus?.map(g => g.name).join(', ') || '-'}
                                                </td>
                                                <td className="py-2.5 px-4 border-b border-[#F1F5F9]">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedPj(item);
                                                                setIsEditModalOpen(true);
                                                            }}
                                                            className="w-7 h-7 rounded-md bg-[#FB923C]/12 flex items-center justify-center text-[#FB923C] hover:bg-[#FB923C] hover:text-white transition-all"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedPj(item);
                                                                setIsDeleteModalOpen(true);
                                                            }}
                                                            className="w-7 h-7 rounded-md bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                        {isSuperAdmin() && (
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedPj(item);
                                                                    setIsResetModalOpen(true);
                                                                }}
                                                                className="w-6 h-6 rounded-md bg-[#FBBF24]/12 flex items-center justify-center text-[#FBBF24] hover:bg-[#FBBF24] hover:text-white transition-all"
                                                            >
                                                                <Lock size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-center border-b border-[#F1F5F9]">
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedPj(item);
                                                            setIsDetailModalOpen(true);
                                                        }}
                                                        className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"
                                                    >
                                                        Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* Pagination Section */}
                    {meta && meta.total > 0 && (
                        <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-[#9298B0] text-[11px] lg:text-xs font-normal text-center sm:text-left">
                                Menampilkan {meta.from}-{meta.to} dari {meta.total} data
                            </p>
                            <div className="flex items-center gap-1.5">
                                <button 
                                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                                    disabled={page === 1}
                                    className="w-8 h-8 lg:w-7 lg:h-7 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-slate-400 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button className="h-8 lg:h-9 px-3 lg:px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[12px] lg:text-[13px] font-semibold">
                                    {page}
                                </button>
                                <button 
                                    onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                    disabled={page === meta.last_page}
                                    className="w-8 h-8 lg:w-7 lg:h-7 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-slate-400 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Modals */}
            <EditPjModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                data={selectedPj}
            />
            <DeletePjModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                data={selectedPj}
            />
            <ResetPjPasswordModal 
                isOpen={isResetModalOpen} 
                onClose={() => setIsResetModalOpen(false)} 
                data={selectedPj}
            />
            <PjDetailModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
                data={selectedPj}
            />
        </AdminLayout>
    );
};

export default DataPjPage;
