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
                    
                    {/* Header Action Row - DESKTOP */}
                    <div className="hidden lg:flex justify-end items-center mb-6">
                        <button className="h-9 px-4 bg-[#22C55E] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-sm text-[13px] font-semibold">
                            <FileText size={18} />
                            <span>Cetak Data</span>
                            <ChevronDown size={18} />
                        </button>
                    </div>

                    {/* Search and Filters - DESKTOP */}
                    <div className="hidden lg:block space-y-6 mb-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                                <Search size={18} />
                            </div>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#F1F5F9] rounded-[10px] focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-400 transition-all text-left"
                                placeholder="Cari nama, username, grup dampingan..."
                            />
                        </div>

                        {/* Filter Section */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="w-auto">
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
                            <div className="w-auto">
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
                            <div className="w-auto">
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
                            <div className="lg:hidden flex flex-col pb-24 bg-[#F0F2F8] min-h-screen gap-3">
                                {/* Mobile Action Buttons */}
                                <div className="flex flex-row justify-end items-center gap-2 w-full">
                                    <button className="h-[34px] px-3 bg-[#22C55E] text-white rounded-[14px] flex items-center justify-center gap-1.5 shadow-sm">
                                        <FileText size={14} />
                                        <span className="text-[12px] font-semibold">Cetak Data</span>
                                        <ChevronDown size={13} />
                                    </button>
                                </div>

                                {/* Mobile Search Bar */}
                                <div className="relative w-full h-[41px] bg-white border border-[#E5E7EB] rounded-[14px] flex items-center px-3 gap-2">
                                    <Search size={16} className="text-[#9298B0]" />
                                    <input 
                                        type="text" 
                                        placeholder="Cari nama, username, grup dampingan..."
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        className="flex-1 h-full bg-transparent outline-none text-[12px] text-[#0A0F1E] placeholder:text-[#9298B0]"
                                    />
                                </div>

                                {/* Mobile Filter Dropdowns */}
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    <div className="col-span-2">
                                        <FilterDropdown
                                            placeholder="Pilih Provinsi"
                                            options={provinsiOptions}
                                            value={provinsiFilter}
                                            isLoading={loadingProv}
                                            valueKey="kode"
                                            labelKey="name"
                                            onChange={(v) => { setProvinsiFilter(v); setKabupatenFilter(null); setKecamatanFilter(null); setPage(1); }}
                                            className="!h-[34px] !rounded-[14px] !border-[#E5E7EB] !text-[11px]"
                                        />
                                    </div>
                                    <FilterDropdown
                                        placeholder="Pilih Kabupaten"
                                        options={kabupatenOptions}
                                        value={kabupatenFilter}
                                        isLoading={loadingKab}
                                        disabled={!provinsiFilter}
                                        valueKey="kode"
                                        labelKey="name"
                                        onChange={(v) => { setKabupatenFilter(v); setKecamatanFilter(null); setPage(1); }}
                                        className="!h-[34px] !rounded-[14px] !border-[#E5E7EB] !text-[11px]"
                                    />
                                    <FilterDropdown
                                        placeholder="Pilih Kecamatan"
                                        options={kecamatanOptions}
                                        value={kecamatanFilter}
                                        isLoading={loadingKec}
                                        disabled={!kabupatenFilter}
                                        valueKey="kode"
                                        labelKey="name"
                                        onChange={(v) => { setKecamatanFilter(v); setPage(1); }}
                                        className="!h-[34px] !rounded-[14px] !border-[#E5E7EB] !text-[11px]"
                                    />
                                </div>

                                {/* Mobile Data Cards */}
                                <div className="flex flex-col gap-2 w-full mt-1">
                                    {dataPj.map((item, index) => {
                                        const isExpanded = expandedCardId === (item.id_user || item.id || index);
                                        
                                        return (
                                            <div key={item.id_user || item.id || index} className="bg-white border border-[#F0F2F8] rounded-[16px] p-2.5 flex flex-col w-full shadow-sm relative overflow-hidden transition-all duration-200">
                                                <div className="flex items-center w-full cursor-pointer" onClick={() => toggleCard(item.id_user || item.id || index)}>
                                                    <div className="w-[38px] h-[38px] bg-[#0080C5] rounded-[14px] flex justify-center items-center shrink-0">
                                                        <span className="text-white text-[11px] font-semibold">{meta.from ? meta.from + index : index + 1}</span>
                                                    </div>
                                                    
                                                    <div className="flex flex-col ml-3 flex-1 overflow-hidden">
                                                        <span className="text-[13px] font-semibold text-[#0080C5] truncate">{item.name}</span>
                                                        <span className="text-[11px] font-normal text-[#9298B0] truncate">{item.username}</span>
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setSelectedPj(item); setIsDetailModalOpen(true); }}
                                                        className="h-8 px-3 ml-2 bg-[#0080C5] text-white rounded-[10px] flex items-center justify-center shrink-0 shadow-sm"
                                                    >
                                                        <span className="text-[10px] font-semibold">Detail</span>
                                                    </button>
                                                    
                                                    <div className="w-4 h-4 flex items-center justify-center shrink-0 ml-2">
                                                        <ChevronDown size={14} className={`text-[#9298B0] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                    </div>
                                                </div>
                                                
                                                {isExpanded && (
                                                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2 animate-fadeIn w-full">
                                                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                                                            <div className="col-span-2">
                                                                <span className="text-slate-400 block mb-0.5">Grup Dampingan</span>
                                                                <span className="text-slate-800 font-medium whitespace-pre-wrap">
                                                                    {item.grup_dampingans_pengurus?.map(g => g.name).join(', ') || '-'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center justify-end gap-2 mt-2 w-full">
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

                                {/* Mobile Pagination */}
                                {meta && meta.total > 0 && (
                                    <div className="flex flex-row justify-between items-center w-full mt-2 px-1">
                                        <p className="text-[#9298B0] text-[10px] font-normal">
                                            Menampilkan {meta.from}-{meta.to} dari {meta.total} data
                                        </p>
                                        <div className="flex items-center gap-1.5">
                                            <button 
                                                onClick={() => setPage(old => Math.max(old - 1, 1))}
                                                disabled={page === 1}
                                                className="w-7 h-7 flex items-center justify-center rounded-[10px] border border-[#E5E7EB] text-[#0A0F1E] opacity-50 hover:bg-slate-50 disabled:opacity-30"
                                            >
                                                <ChevronLeft size={14} />
                                            </button>
                                            <button className="w-7 h-7 bg-[#0080C5] text-white rounded-[10px] flex items-center justify-center text-[12px] font-bold">
                                                {page}
                                            </button>
                                            <button 
                                                onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                                disabled={page === meta.last_page}
                                                className="w-7 h-7 flex items-center justify-center rounded-[10px] border border-[#E5E7EB] text-[#0A0F1E] hover:bg-slate-50 disabled:opacity-30"
                                            >
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
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

                    {/* Pagination Section - DESKTOP */}
                    {meta && meta.total > 0 && (
                        <div className="hidden lg:flex mt-8 flex-row items-center justify-between gap-4">
                            <p className="text-[#9298B0] text-xs font-normal text-left">
                                Menampilkan {meta.from}-{meta.to} dari {meta.total} data
                            </p>
                            <div className="flex items-center gap-1.5">
                                <button 
                                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                                    disabled={page === 1}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-slate-400 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold">
                                    {page}
                                </button>
                                <button 
                                    onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                    disabled={page === meta.last_page}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-slate-400 hover:bg-slate-50 disabled:opacity-50"
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
