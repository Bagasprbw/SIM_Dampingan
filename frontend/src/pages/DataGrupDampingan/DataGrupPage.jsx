import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
    Search, 
    ChevronDown, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    Plus,
    Printer,
    FileText
} from 'lucide-react';
import AddGrupModal from '../../components/modals/AddGrupModal';
import EditGrupModal from '../../components/modals/EditGrupModal';
import DeleteGrupModal from '../../components/modals/DeleteGrupModal';
import { useGrupDampingans } from '../../hooks/queries/useGrupDampinganQuery';
import { Loader2 } from 'lucide-react';
import FilterDropdown from '../../components/common/FilterDropdown';
import { useProvinsi, useKabupaten, useKecamatan } from '../../hooks/queries/useWilayahQuery';

const DataGrupPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGrup, setSelectedGrup] = useState(null);
    const [expandedCardId, setExpandedCardId] = useState(null);

    const [page, setPage] = useState(1);

    // Filter State
    const [provinsiFilter, setProvinsiFilter] = useState(null);
    const [kabupatenFilter, setKabupatenFilter] = useState(null);
    const [kecamatanFilter, setKecamatanFilter] = useState(null);

    // Wilayah Queries
    const { data: provinsiOptions = [], isLoading: loadingProv } = useProvinsi();
    const { data: kabupatenOptions = [], isLoading: loadingKab } = useKabupaten(provinsiFilter);
    const { data: kecamatanOptions = [], isLoading: loadingKec } = useKecamatan(kabupatenFilter);

    const { data: grupData, isLoading, isError, refetch } = useGrupDampingans({
        page: page,
        search: searchTerm,
        kode_prov: provinsiFilter,
        kode_kab: kabupatenFilter,
        kode_kec: kecamatanFilter
    });

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const toggleCard = (id) => {
        if (expandedCardId === id) {
            setExpandedCardId(null);
        } else {
            setExpandedCardId(id);
        }
    };

    const dataGrup = grupData?.data || [];
    const meta = grupData?.meta || {};

    return (
        <AdminLayout title="Data Grup Dampingan">
            <div className="font-['Poppins']">
                <div className="bg-transparent lg:bg-white rounded-none lg:rounded-2xl shadow-none lg:shadow-sm border-0 lg:border lg:border-[#E5E7EB] p-0 lg:p-8 min-h-[calc(100vh-160px)]">
                
                {/* Action Bar (Tambah & Cetak) */}
                <div className="flex flex-wrap lg:flex-nowrap justify-end items-center gap-2 lg:gap-3.5 mb-4 lg:mb-6">
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex-1 lg:flex-none h-10 lg:h-9 px-4 bg-[#0080C5] text-white rounded-xl lg:rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"
                    >
                        <Plus size={18} />
                        <span>Tambah</span>
                    </button>
                    <button className="flex-1 lg:flex-none h-10 lg:h-9 px-4 bg-[#22C55E] text-white rounded-xl lg:rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-sm text-[13px] font-semibold">
                        <FileText size={18} />
                        <span>Cetak Data</span>
                        <ChevronDown size={18} className="hidden lg:block" />
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="space-y-3 lg:space-y-4 mb-6 text-left">
                    {/* Search Bar */}
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Cari grup dampingan, bidang, jenis..."
                            className="w-full h-11 pl-12 pr-4 bg-white rounded-xl lg:rounded-[10px] border lg:border-2 border-slate-200 lg:border-gray-100 focus:border-[#0080C5] focus:outline-none text-[13px] lg:text-xs text-slate-600 transition-all font-['Poppins'] shadow-sm lg:shadow-none"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="grid grid-cols-2 lg:flex lg:flex-wrap items-center gap-2 lg:gap-3">
                        <div className="w-full lg:w-auto">
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
                        <div className="w-full lg:w-auto">
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
                        <p className="text-red-500 mb-4">Gagal memuat data grup dampingan.</p>
                        <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                    </div>
                ) : dataGrup.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl">
                        <p className="text-slate-500">Tidak ada data grup dampingan ditemukan.</p>
                    </div>
                ) : (
                    <>
                        {/* MOBILE LIST VIEW */}
                        <div className="flex flex-col gap-3 lg:hidden">
                            {dataGrup.map((item, index) => {
                                const isExpanded = expandedCardId === (item.id_grup_dampingan || item.id || index);
                                
                                return (
                                    <div key={item.id_grup_dampingan || item.id || index} className="bg-white rounded-[16px] p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
                                        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleCard(item.id_grup_dampingan || item.id || index)}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-sky-50 text-[#0080C5] rounded-xl flex items-center justify-center text-[13px] font-bold shrink-0">
                                                    {meta.from ? meta.from + index : index + 1}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[#0A0F1E] text-[13px] font-bold">{item.name}</span>
                                                    <span className="text-[#9298B0] text-[11px]">{item.bidang?.name || '-'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-sky-50 text-[#0080C5] rounded-md text-[10px] font-semibold whitespace-nowrap">
                                                    Provinsi
                                                </span>
                                                <ChevronDown size={18} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </div>
                                        </div>
                                        
                                        {isExpanded && (
                                            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 animate-fadeIn">
                                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                                    <div>
                                                        <span className="text-slate-400 block mb-0.5">Jenis</span>
                                                        <span className="text-[#0080C5] font-semibold">{item.level_dampingan}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-400 block mb-0.5">Fasilitator</span>
                                                        <span className="text-slate-800 font-medium">
                                                            {item.grup_fasilitators?.map(gf => gf.fasilitator?.name).join(', ') || '-'}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="text-slate-400 block mb-0.5">Wilayah</span>
                                                        <span className="text-slate-800 font-medium">
                                                            {[
                                                                item.provinsi?.name,
                                                                item.kabupaten?.name,
                                                                item.kecamatan?.name
                                                            ].filter(Boolean).join(', ') || '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center justify-end gap-2 mt-2">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setSelectedGrup(item); setIsEditModalOpen(true); }}
                                                        className="px-3 py-1.5 rounded-lg bg-[#FB923C]/10 text-[#FB923C] hover:bg-[#FB923C] hover:text-white transition-all text-[11px] font-semibold flex items-center gap-1.5"
                                                    >
                                                        <Edit size={12} /> Edit
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setSelectedGrup(item); setIsDeleteModalOpen(true); }}
                                                        className="px-3 py-1.5 rounded-lg bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all text-[11px] font-semibold flex items-center gap-1.5"
                                                    >
                                                        <Trash2 size={12} /> Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* DESKTOP TABLE VIEW */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-[#F1F5F9]">
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold rounded-tl-xl text-center w-12">NO</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Grup Dampingan</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold text-center">Bidang</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold text-center">Jenis</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Provinsi</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Kabupaten</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Kecamatan</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Fasilitator</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold rounded-tr-xl text-center w-20">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {dataGrup.map((item, index) => (
                                        <tr key={item.id_grup_dampingan || item.id || index} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-2.5 px-4 text-[#0A0F1E] text-[11px] font-semibold text-center border-b border-[#F1F5F9]">
                                                {meta.from ? meta.from + index : index + 1}
                                            </td>
                                            <td className="py-2.5 px-4 text-[#0080C5] text-[11px] font-semibold border-b border-[#F1F5F9]">{item.name}</td>
                                            <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-xs font-normal border-b border-[#F1F5F9]">{item.bidang?.name || '-'}</td>
                                            <td className="py-2.5 px-4 text-center text-[#0080C5] text-[11px] font-semibold border-b border-[#F1F5F9]">{item.level_dampingan}</td>
                                            <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal border-b border-[#F1F5F9]">{item.provinsi?.name || '-'}</td>
                                            <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal border-b border-[#F1F5F9]">{item.kabupaten?.name || '-'}</td>
                                            <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal border-b border-[#F1F5F9]">{item.kecamatan?.name || '-'}</td>
                                            <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal border-b border-[#F1F5F9]">
                                                <div className="text-left truncate max-w-[200px]" title={item.grup_fasilitators?.map(gf => gf.fasilitator?.name).join(', ')}>
                                                    {item.grup_fasilitators?.map(gf => gf.fasilitator?.name).join(', ') || '-'}
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-4 border-b border-[#F1F5F9]">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedGrup(item);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="w-7 h-7 rounded-md bg-[#FB923C]/12 flex items-center justify-center text-[#FB923C] hover:bg-[#FB923C] hover:text-white transition-all"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedGrup(item);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="w-7 h-7 rounded-md bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
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
                    </>
                )}

                {/* Pagination */}
                {meta && meta.total > 0 && (
                    <div className="mt-6 lg:mt-6 flex flex-col sm:flex-row items-center justify-between border-t-0 lg:border-t lg:border-gray-100 pt-0 lg:pt-6 font-['Poppins'] gap-4">
                        <p className="text-[#9298B0] text-[11px] lg:text-xs font-normal text-center sm:text-left">
                            Menampilkan {meta.from}-{meta.to} dari {meta.total} data
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button 
                                onClick={() => setPage(old => Math.max(old - 1, 1))}
                                disabled={page === 1}
                                className="w-8 h-8 lg:w-7 lg:h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                <ChevronLeft size={18} className="lg:w-[14px] lg:h-[14px]" />
                            </button>
                            <button className="h-8 lg:h-7 px-3 flex items-center justify-center rounded-md bg-[#0080C5] text-white text-[12px] lg:text-[11px] font-semibold shadow-sm">
                                {page}
                            </button>
                            <button 
                                onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                disabled={page === meta.last_page}
                                className="w-8 h-8 lg:w-7 lg:h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                <ChevronRight size={18} className="lg:w-[14px] lg:h-[14px]" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            </div>

            {/* Modals */}
            <AddGrupModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
            />
            <EditGrupModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                data={selectedGrup}
            />
            <DeleteGrupModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                data={selectedGrup}
            />
        </AdminLayout>
    );
};

export default DataGrupPage;
