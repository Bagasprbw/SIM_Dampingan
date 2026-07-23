import React, { useState } from 'react';
import Swal from 'sweetalert2';
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
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { exportToExcel } from '../../utils/exportToExcel';

const DataGrupPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGrup, setSelectedGrup] = useState(null);
    const [expandedCardId, setExpandedCardId] = useState(null);

    const [page, setPage] = useState(1);

    // Get current logged-in user
    const { user: currentUser } = useCurrentUser();
    const userRole = typeof currentUser?.role === 'object' ? currentUser?.role?.name : currentUser?.role;
    const isSuper = userRole === 'superadmin';
    const isAdminKabupaten = userRole === 'admin_kabupaten';
    const isAdminKecamatan = userRole === 'admin_kecamatan';

    // Filter State
    const [provinsiFilter, setProvinsiFilter] = useState(
        !isSuper && currentUser ? currentUser.kode_prov : null
    );
    const [kabupatenFilter, setKabupatenFilter] = useState(
        !isSuper && currentUser && (isAdminKabupaten || isAdminKecamatan) ? currentUser.kode_kab : null
    );
    const [kecamatanFilter, setKecamatanFilter] = useState(
        !isSuper && currentUser && isAdminKecamatan ? currentUser.kode_kec : null
    );

    // Wilayah Queries
    const { data: provinsiOptions = [], isLoading: loadingProv } = useProvinsi();
    const { data: kabupatenOptions = [], isLoading: loadingKab } = useKabupaten(provinsiFilter);
    const { data: kecamatanOptions = [], isLoading: loadingKec } = useKecamatan(kabupatenFilter);

    // Filter provinsi list based on user role
    const filteredProvinsiOptions = isSuper 
        ? provinsiOptions 
        : provinsiOptions.filter(p => p.kode === currentUser?.kode_prov);

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

    const handleExport = () => {
        if (!dataGrup || dataGrup.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Data Kosong',
                text: 'Tidak ada data untuk diekspor.',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' }
            });
            return;
        }

        const exportData = dataGrup.map((item, index) => ({
            'No': index + 1,
            'Grup Dampingan': item.name || '-',
            'Bidang': item.bidangs?.map(b => b.name).join(', ') || '-',
            'Jenis': item.level_dampingan || 'Provinsi',
            'Provinsi': item.provinsi?.name || '-',
            'Kabupaten': item.kabupaten?.name || '-',
            'Kecamatan': item.kecamatan?.name || '-',
            'Fasilitator': item.grup_fasilitators?.map(gf => gf.fasilitator?.name).join(', ') || '-'
        }));

        exportToExcel(exportData, 'Data_Grup_Dampingan');
    };

    return (
        <AdminLayout title="Data Grup Dampingan">
            <div className="font-['Poppins']">
                <div className="bg-transparent lg:bg-white rounded-none lg:rounded-2xl shadow-none lg:shadow-sm border-0 lg:border lg:border-[#E5E7EB] p-0 lg:p-8 min-h-[calc(100vh-160px)]">
                
                {/* Action Bar (Tambah & Cetak) - DESKTOP */}
                <div className="hidden lg:flex justify-end items-center gap-3.5 mb-6">
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"
                    >
                        <Plus size={18} />
                        <span>Tambah</span>
                    </button>
                    <button 
                        onClick={handleExport}
                        className="h-9 px-4 bg-[#22C55E] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-sm text-[13px] font-semibold"
                    >
                        <FileText size={18} />
                        <span>Cetak Data</span>
                    </button>
                </div>

                {/* Search & Filters - DESKTOP */}
                <div className="hidden lg:block space-y-4 mb-6 text-left">
                    {/* Search Bar */}
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Cari grup dampingan, bidang, jenis..."
                            className="w-full h-11 pl-12 pr-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all font-['Poppins'] shadow-none"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <FilterDropdown
                            placeholder="Pilih Provinsi"
                            options={filteredProvinsiOptions}
                            value={provinsiFilter}
                            isLoading={loadingProv}
                            valueKey="kode"
                            labelKey="name"
                            disabled={!isSuper || filteredProvinsiOptions.length <= 1}
                            onChange={(v) => { setProvinsiFilter(v); setKabupatenFilter(null); setKecamatanFilter(null); setPage(1); }}
                        />
                        <FilterDropdown
                            placeholder="Pilih Kabupaten"
                            options={kabupatenOptions}
                            value={kabupatenFilter}
                            isLoading={loadingKab}
                            disabled={!provinsiFilter || isAdminKabupaten || isAdminKecamatan}
                            valueKey="kode"
                            labelKey="name"
                            onChange={(v) => { setKabupatenFilter(v); setKecamatanFilter(null); setPage(1); }}
                        />
                        <FilterDropdown
                            placeholder="Pilih Kecamatan"
                            options={kecamatanOptions}
                            value={kecamatanFilter}
                            isLoading={loadingKec}
                            disabled={!kabupatenFilter || isAdminKecamatan}
                            valueKey="kode"
                            labelKey="name"
                            onChange={(v) => { setKecamatanFilter(v); setPage(1); }}
                        />
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
                    <>
                        {/* Mobile action buttons juga tampil saat data kosong */}
                        <div className="lg:hidden flex flex-row justify-end items-center gap-2 w-full mb-3">
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="h-[34px] px-3 bg-[#0080C5] text-white rounded-[14px] flex items-center justify-center gap-1.5 shadow-sm"
                            >
                                <Plus size={14} strokeWidth={3} />
                                <span className="text-[12px] font-semibold">Tambah</span>
                            </button>
                            <button 
                                onClick={handleExport}
                                className="h-[34px] px-3 bg-[#22C55E] text-white rounded-[14px] flex items-center justify-center gap-1.5 shadow-sm"
                            >
                                <FileText size={14} />
                                <span className="text-[12px] font-semibold">Cetak Data</span>
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl">
                            <p className="text-slate-500">Tidak ada data grup dampingan ditemukan.</p>
                        </div>
                    </>
                ) : (
                    <>
                        {/* MOBILE LIST VIEW */}
                        <div className="lg:hidden flex flex-col pb-24 bg-[#F0F2F8] min-h-screen gap-3">
                            {/* Mobile Action Buttons */}
                            <div className="flex flex-row justify-end items-center gap-2 w-full">
                                <button 
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="h-[34px] px-3 bg-[#0080C5] text-white rounded-[14px] flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                    <Plus size={14} strokeWidth={3} />
                                    <span className="text-[12px] font-semibold">Tambah</span>
                                </button>
                                <button 
                                    onClick={handleExport}
                                    className="h-[34px] px-3 bg-[#22C55E] text-white rounded-[14px] flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                    <FileText size={14} />
                                    <span className="text-[12px] font-semibold">Cetak Data</span>
                                </button>
                            </div>

                            {/* Mobile Search Bar */}
                            <div className="relative w-full h-[41px] bg-white border border-[#E5E7EB] rounded-[14px] flex items-center px-3 gap-2">
                                <Search size={16} className="text-[#9298B0]" />
                                <input 
                                    type="text" 
                                    placeholder="Cari grup dampingan, bidang, jenis..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="flex-1 h-full bg-transparent outline-none text-[12px] text-[#0A0F1E] placeholder:text-[#9298B0]"
                                />
                            </div>

                            {/* Mobile Filter Dropdowns */}
                            <div className="grid grid-cols-2 gap-2 w-full">
                                <div className="col-span-2">
                                    <FilterDropdown
                                        placeholder="Pilih Provinsi"
                                        options={filteredProvinsiOptions}
                                        value={provinsiFilter}
                                        isLoading={loadingProv}
                                        disabled={!isSuper || filteredProvinsiOptions.length <= 1}
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
                                    disabled={!provinsiFilter || isAdminKabupaten || isAdminKecamatan}
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
                                    disabled={!kabupatenFilter || isAdminKecamatan}
                                    valueKey="kode"
                                    labelKey="name"
                                    onChange={(v) => { setKecamatanFilter(v); setPage(1); }}
                                    className="!h-[34px] !rounded-[14px] !border-[#E5E7EB] !text-[11px]"
                                />
                            </div>

                            {/* Mobile Data Cards */}
                            <div className="flex flex-col gap-2 w-full mt-1">
                                {dataGrup.map((item, index) => {
                                    const isExpanded = expandedCardId === (item.id_grup_dampingan || item.id || index);
                                    
                                    return (
                                        <div key={item.id_grup_dampingan || item.id || index} className="bg-white border border-[#F0F2F8] rounded-[16px] p-2.5 flex flex-col w-full shadow-sm relative overflow-hidden transition-all duration-200">
                                            <div className="flex items-center w-full cursor-pointer" onClick={() => toggleCard(item.id_grup_dampingan || item.id || index)}>
                                                <div className="w-[38px] h-[38px] bg-sky-50 rounded-[14px] flex justify-center items-center shrink-0">
                                                    <span className="text-[#0080C5] text-[11px] font-semibold">{meta.from ? meta.from + index : index + 1}</span>
                                                </div>
                                                
                                                <div className="flex flex-col ml-3 flex-1 overflow-hidden">
                                                    <span className="text-[13px] font-semibold text-[#0A0F1E] truncate">{item.name}</span>
                                                    <span className="text-[11px] font-normal text-[#9298B0] truncate">
                                                        {item.bidangs?.map(b => b.name).join(', ') || '-'}
                                                    </span>
                                                </div>
                                                
                                                <div className="px-2 py-0.5 rounded-[10px] bg-sky-50 shrink-0 mx-2">
                                                    <span className="text-[10px] font-semibold text-[#0080C5]">
                                                        {item.level_dampingan || 'Provinsi'}
                                                    </span>
                                                </div>
                                                
                                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                                    <ChevronDown size={14} className={`text-[#9298B0] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </div>
                                            </div>
                                            
                                            {isExpanded && (
                                                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2 animate-fadeIn w-full">
                                                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                                                        <div>
                                                            <span className="text-slate-400 block mb-0.5">Jenis</span>
                                                            <span className="text-[#0080C5] font-semibold">{item.level_dampingan}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400 block mb-0.5">Fasilitator</span>
                                                            <span className="text-slate-800 font-medium whitespace-pre-wrap">
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
                                                    <div className="flex flex-wrap items-center justify-end gap-2 mt-2 w-full">
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

                            {/* Mobile Pagination */}
                            {meta && meta.total > 0 && (
                                <div className="flex flex-row justify-between items-center w-full mt-2 px-1 pb-6">
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
                                            <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-xs font-normal border-b border-[#F1F5F9]">
                                                {item.bidangs?.map(b => b.name).join(', ') || '-'}
                                            </td>
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

                {/* Pagination - DESKTOP */}
                {meta && meta.total > 0 && (
                    <div className="hidden lg:flex mt-6 flex-row items-center justify-between border-t border-gray-100 pt-6 font-['Poppins'] gap-4">
                        <p className="text-[#9298B0] text-xs font-normal text-left">
                            Menampilkan {meta.from}-{meta.to} dari {meta.total} data
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button 
                                onClick={() => setPage(old => Math.max(old - 1, 1))}
                                disabled={page === 1}
                                className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                <ChevronLeft size={18} className="w-[14px] h-[14px]" />
                            </button>
                            <button className="h-7 px-3 flex items-center justify-center rounded-md bg-[#0080C5] text-white text-[11px] font-semibold shadow-sm">
                                {page}
                            </button>
                            <button 
                                onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                disabled={page === meta.last_page}
                                className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                <ChevronRight size={18} className="w-[14px] h-[14px]" />
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
