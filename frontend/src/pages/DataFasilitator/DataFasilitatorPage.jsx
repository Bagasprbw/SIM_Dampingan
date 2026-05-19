import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
    Plus, 
    Printer, 
    Search, 
    ChevronDown, 
    ChevronLeft, 
    ChevronRight,
    Edit,
    Trash2,
    Lock,
    Settings,
    Eye,
    FileText,
    Loader2
} from 'lucide-react';
import AddFacilitatorModal from '../../components/modals/AddFacilitatorModal';
import EditFacilitatorModal from '../../components/modals/EditFacilitatorModal';
import DeleteFacilitatorModal from '../../components/modals/DeleteFacilitatorModal';
import ResetFacilitatorPasswordModal from '../../components/modals/ResetFacilitatorPasswordModal';
import FacilitatorDetailModal from '../../components/modals/FacilitatorDetailModal';
import ManageBidangModal from '../../components/modals/ManageBidangModal';
import { useFasilitators } from '../../hooks/queries/useFasilitatorQuery';
import FilterDropdown from '../../components/common/FilterDropdown';
import { useProvinsi, useKabupaten, useKecamatan } from '../../hooks/queries/useWilayahQuery';
import { isSuperAdmin } from '../../utils/permissionUtils';

const DataFasilitatorPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isManageBidangOpen, setIsManageBidangOpen] = useState(false);
    const [selectedFasilitator, setSelectedFasilitator] = useState(null);

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

    const { data: fasilitatorData, isLoading, isError, refetch } = useFasilitators({
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

    const dataFasilitator = fasilitatorData?.data || [];
    const meta = fasilitatorData?.meta || {};

    return (
        <AdminLayout title="Data Fasilitator">
            <div className="p-8 font-['Poppins']">
                {/* Main Card Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
                    
                    {/* Top Action Buttons */}
                    <div className="flex justify-end items-center gap-3.5 mb-6">
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"
                        >
                            <Plus size={18} strokeWidth={3} />
                            <span>Tambah</span>
                        </button>
                        <div className="relative group">
                            <button className="h-9 px-4 bg-[#22C55E] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-sm text-[13px] font-semibold">
                                <FileText size={18} />
                                <span>Cetak Data</span>
                                <ChevronDown size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="space-y-6 mb-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                                <Search size={18} />
                            </div>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#F1F5F9] rounded-[10px] focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-400 transition-all"
                                placeholder="Cari nama, username, bidang, grup dampingan..."
                            />
                        </div>

                        {/* Filter Row */}
                        <div className="flex flex-wrap items-center gap-3">
                            <FilterDropdown
                                placeholder="Pilih Provinsi"
                                options={provinsiOptions}
                                value={provinsiFilter}
                                isLoading={loadingProv}
                                valueKey="kode"
                                labelKey="name"
                                onChange={(v) => { setProvinsiFilter(v); setKabupatenFilter(null); setKecamatanFilter(null); setPage(1); }}
                            />
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

                            <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

                            <button 
                                onClick={() => setIsManageBidangOpen(true)}
                                className="h-10 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"
                            >
                                <Settings size={16} />
                                <span className="text-[11px] font-semibold tracking-tight">Kelola Bidang</span>
                            </button>
                        </div>
                    </div>

                    {/* Table Container */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-red-500 mb-4">Gagal memuat data fasilitator.</p>
                            <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                        </div>
                    ) : dataFasilitator.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-slate-500">Tidak ada data fasilitator ditemukan.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 border-b-2 border-slate-100">
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider rounded-tl-xl w-12 text-center">NO</th>
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider min-w-[120px]">Nama</th>
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider min-w-[120px]">Username</th>
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider min-w-[150px]">Wilayah</th>
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider min-w-[120px]">Bidang Dampingan</th>
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider min-w-[150px]">Grup Dampingan</th>
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider text-center w-28">Aksi</th>
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider text-center rounded-tr-xl w-24">Detail</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {dataFasilitator.map((item, index) => (
                                        <tr key={item.id_user || item.id || index} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                                            <td className="py-2.5 px-4 text-xs text-slate-400 font-medium text-center">
                                                {meta.from ? meta.from + index : index + 1}
                                            </td>
                                            <td className="py-2.5 px-4 text-xs text-[#0080C5] font-semibold">{item.name}</td>
                                            <td className="py-2.5 px-4 text-xs text-[#0080C5] font-normal">{item.username}</td>
                                            <td className="py-2.5 px-4 text-xs text-[#0A0F1E] font-normal">
                                                {[
                                                    item.provinsi?.name,
                                                    item.kabupaten?.name,
                                                    item.kecamatan?.name
                                                ].filter(Boolean).join(', ') || '-'}
                                            </td>
                                            <td className="py-2.5 px-4 text-xs text-[#0A0F1E] font-normal">
                                                {item.fasilitator_bidangs?.map(fb => fb.bidang?.name).join(', ') || '-'}
                                            </td>
                                            <td className="py-2.5 px-4 text-xs text-[#0A0F1E] font-normal">
                                                {item.grup_fasilitators?.map(gf => gf.grup_dampingan?.name).join(', ') || '-'}
                                            </td>
                                            <td className="py-2.5 px-4 ">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedFasilitator(item);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="w-6 h-6 rounded-md bg-[#FB923C]/10 flex items-center justify-center text-[#FB923C] hover:bg-[#FB923C] hover:text-white transition-all"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedFasilitator(item);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="w-7 h-7 rounded-md bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    {isSuperAdmin() && (
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedFasilitator(item);
                                                                setIsResetModalOpen(true);
                                                            }}
                                                            className="w-6 h-6 rounded-md bg-[#FBBF24]/10 flex items-center justify-center text-[#FBBF24] hover:bg-[#FBBF24] hover:text-white transition-all"
                                                        >
                                                            <Lock size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-4 text-center">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedFasilitator(item);
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
                    )}

                    {/* Pagination Section */}
                    {meta && meta.total > 0 && (
                        <div className="mt-8 flex items-center justify-between">
                            <p className="text-[#9298B0] text-xs font-normal">
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

            <AddFacilitatorModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
            />
            <EditFacilitatorModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                data={selectedFasilitator}
            />
            <DeleteFacilitatorModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                data={selectedFasilitator}
            />
            <ResetFacilitatorPasswordModal 
                isOpen={isResetModalOpen} 
                onClose={() => setIsResetModalOpen(false)} 
                data={selectedFasilitator}
            />
            <FacilitatorDetailModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
                data={selectedFasilitator}
            />
            <ManageBidangModal 
                isOpen={isManageBidangOpen} 
                onClose={() => setIsManageBidangOpen(false)} 
            />
        </AdminLayout>
    );
};

export default DataFasilitatorPage;
