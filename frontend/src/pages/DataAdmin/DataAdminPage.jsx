import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
    Plus, 
    Search, 
    ChevronLeft, 
    ChevronRight,
    Edit,
    Trash2,
    Lock,
    FileText,
    ChevronDown,
    Loader2
} from 'lucide-react';
import AddAdminModal from '../../components/modals/AddAdminModal';
import EditAdminModal from '../../components/modals/EditAdminModal';
import DeleteAdminModal from '../../components/modals/DeleteAdminModal';
import ResetPasswordModal from '../../components/modals/ResetPasswordModal';
import { useAdmins } from '../../hooks/queries/useAdminQuery';
import FilterDropdown from '../../components/common/FilterDropdown';
import { useProvinsi, useKabupaten, useKecamatan } from '../../hooks/queries/useWilayahQuery';
import { isSuperAdmin } from '../../utils/permissionUtils';

const DataAdminPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [expandedCardId, setExpandedCardId] = useState(null);

    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [provinsiFilter, setProvinsiFilter] = useState(null);
    const [kabupatenFilter, setKabupatenFilter] = useState(null);
    const [kecamatanFilter, setKecamatanFilter] = useState(null);

    const { data: provinsiList = [], isLoading: loadingProv } = useProvinsi();
    const { data: kabupatenList = [], isLoading: loadingKab } = useKabupaten(provinsiFilter);
    const { data: kecamatanList = [], isLoading: loadingKec } = useKecamatan(kabupatenFilter);

    const provinsiOptions = provinsiList.map(p => ({ value: p.kode, label: p.name }));
    const kabupatenOptions = kabupatenList.map(k => ({ value: k.kode, label: k.name }));
    const kecamatanOptions = kecamatanList.map(k => ({ value: k.kode, label: k.name }));

    const { data: adminData, isLoading, isError, refetch } = useAdmins({
        page: page,
        search: searchQuery,
        ...(provinsiFilter && { kode_prov: provinsiFilter }),
        ...(kabupatenFilter && { kode_kab: kabupatenFilter }),
        ...(kecamatanFilter && { kode_kec: kecamatanFilter }),
    });

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const toggleCard = (id) => {
        if (expandedCardId === id) {
            setExpandedCardId(null);
        } else {
            setExpandedCardId(id);
        }
    };

    const admins = adminData?.data || [];
    const meta = adminData?.meta || { from: 1, to: admins.length, total: admins.length, current_page: 1, last_page: 1 };

    return (
        <AdminLayout title="Data Admin">
            <div className="font-['Poppins']">
                {/* ================= DESKTOP VIEW ================= */}
                <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
                    <div className="flex justify-end items-center gap-3.5 mb-6">
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex-none h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"
                        >
                            <Plus size={18} strokeWidth={3} />
                            <span>Tambah</span>
                        </button>
                        <div className="relative flex-none group">
                            <button className="w-full h-9 px-4 bg-[#22C55E] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-sm text-[13px] font-semibold">
                                <FileText size={18} />
                                <span>Cetak Data</span>
                                <ChevronDown size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Search and Filters - DESKTOP */}
                    <div className="space-y-6 mb-6">
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search size={18} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Cari nama, username, alamat, no. telp..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-12 pr-4 py-3 bg-white rounded-[10px] border-2 border-[#F1F5F9] focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-400 transition-all shadow-none"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="w-auto">
                                <FilterDropdown
                                    placeholder="Pilih Role"
                                    options={[{value: 'admin_prov', label: 'Admin Provinsi'}, {value: 'admin_kab', label: 'Admin Kabupaten'}]}
                                    value={null}
                                    onChange={() => {}}
                                />
                            </div>
                            <div className="w-auto">
                                <FilterDropdown
                                    placeholder="Pilih Provinsi"
                                    options={provinsiOptions}
                                    value={provinsiFilter}
                                    isLoading={loadingProv}
                                    onChange={(v) => { setProvinsiFilter(v); setKabupatenFilter(null); setKecamatanFilter(null); setPage(1); }}
                                />
                            </div>
                            <div className="w-auto">
                                <FilterDropdown
                                    placeholder="Pilih Kecamatan"
                                    options={kecamatanOptions}
                                    value={kecamatanFilter}
                                    isLoading={loadingKec}
                                    disabled={!kabupatenFilter}
                                    onChange={(v) => { setKecamatanFilter(v); setPage(1); }}
                                />
                            </div>
                            <div className="w-auto">
                                <FilterDropdown
                                    placeholder="Pilih Kabupaten"
                                    options={kabupatenOptions}
                                    value={kabupatenFilter}
                                    isLoading={loadingKab}
                                    disabled={!provinsiFilter}
                                    onChange={(v) => { setKabupatenFilter(v); setKecamatanFilter(null); setPage(1); }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table Section - DESKTOP */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-red-500 mb-4">Gagal memuat data admin.</p>
                            <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                        </div>
                    ) : admins.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-slate-500">Tidak ada data admin ditemukan.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-separate border-spacing-0">
                                    <thead>
                                        <tr className="bg-[#F1F5F9]">
                                            <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold rounded-tl-xl text-center">NO</th>
                                            <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Nama</th>
                                            <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Username</th>
                                            <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">No. Telp</th>
                                            <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Provinsi</th>
                                            <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Kabupaten</th>
                                            <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Kecamatan</th>
                                            <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold rounded-tr-xl text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {admins.map((item, index) => (
                                            <tr key={item.id_user || item.id || index} className="hover:bg-slate-50/50 transition-colors group text-left">
                                                <td className="py-2.5 px-4 text-[#0A0F1E] text-[11px] font-semibold text-center">
                                                    {meta.from ? meta.from + index : index + 1}
                                                </td>
                                                <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.name}</td>
                                                <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.username}</td>
                                                <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal whitespace-nowrap">{item.no_telp || '-'}</td>
                                                <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.provinsi?.name || '-'}</td>
                                                <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.kabupaten?.name || '-'}</td>
                                                <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.kecamatan?.name || '-'}</td>
                                                <td className="py-2.5 px-4 ">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button 
                                                            onClick={() => { setSelectedAdmin(item); setIsEditModalOpen(true); }}
                                                            className="w-7 h-7 rounded-md bg-[#FB923C]/12 flex items-center justify-center text-[#FB923C] hover:bg-[#FB923C] hover:text-white transition-all"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => { setSelectedAdmin(item); setIsDeleteModalOpen(true); }}
                                                            className="w-7 h-7 rounded-md bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                        {isSuperAdmin() && (
                                                            <button 
                                                                onClick={() => { setSelectedAdmin(item); setIsResetModalOpen(true); }}
                                                                className="w-6 h-6 rounded-md bg-[#FBBF24]/12 flex items-center justify-center text-[#FBBF24] hover:bg-[#FBBF24] hover:text-white transition-all"
                                                            >
                                                                <Lock size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {meta && meta.total > 0 && (
                                <div className="mt-8 flex flex-row items-center justify-between gap-4">
                                    <p className="text-[#9298B0] text-xs font-normal text-left">
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
                                        <button className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold">
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
                        </>
                    )}
                </div>

                {/* ================= MOBILE VIEW ================= */}
                <div className="lg:hidden flex flex-col pb-24 bg-[#F0F2F8] min-h-screen">
                    <div className="w-full max-w-md mx-auto flex flex-col gap-3">
                        {/* Mobile Action Buttons */}
                        <div className="flex flex-row justify-end items-center gap-2 w-full">
                            <button className="h-[34px] px-3 bg-[#22C55E] text-white rounded-[14px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform">
                                <FileText size={14} />
                                <span className="text-[12px] font-semibold">Cetak Data</span>
                                <ChevronDown size={13} />
                            </button>
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="h-[34px] px-3 bg-[#0080C5] text-white rounded-[14px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                            >
                                <Plus size={14} strokeWidth={3} />
                                <span className="text-[12px] font-semibold">Tambah</span>
                            </button>
                        </div>

                        {/* Mobile Search Bar */}
                        <div className="relative w-full h-[38px] bg-white border border-[#E5E7EB] rounded-[14px] flex items-center px-3 gap-2">
                            <Search size={16} className="text-[#9298B0]" />
                            <input 
                                type="text" 
                                placeholder="Cari nama, username..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="flex-1 h-full bg-transparent outline-none text-[12px] text-[#0A0F1E] placeholder:text-[#9298B0]"
                            />
                        </div>

                        {/* Mobile Filter Dropdowns */}
                        <div className="grid grid-cols-2 gap-2 w-full">
                            <FilterDropdown
                                placeholder="Pilih Role"
                                options={[{value: 'admin_prov', label: 'Admin Provinsi'}, {value: 'admin_kab', label: 'Admin Kabupaten'}]}
                                value={null}
                                onChange={() => {}}
                                className="!h-[34px] !rounded-[14px] !border-[#E5E7EB] !text-[11px]"
                            />
                            <FilterDropdown
                                placeholder="Pilih Provinsi"
                                options={provinsiOptions}
                                value={provinsiFilter}
                                isLoading={loadingProv}
                                onChange={(v) => { setProvinsiFilter(v); setKabupatenFilter(null); setKecamatanFilter(null); setPage(1); }}
                                className="!h-[34px] !rounded-[14px] !border-[#E5E7EB] !text-[11px]"
                            />
                            <FilterDropdown
                                placeholder="Pilih Kabupaten"
                                options={kabupatenOptions}
                                value={kabupatenFilter}
                                isLoading={loadingKab}
                                disabled={!provinsiFilter}
                                onChange={(v) => { setKabupatenFilter(v); setKecamatanFilter(null); setPage(1); }}
                                className="!h-[34px] !rounded-[14px] !border-[#E5E7EB] !text-[11px]"
                            />
                            <FilterDropdown
                                placeholder="Pilih Kecamatan"
                                options={kecamatanOptions}
                                value={kecamatanFilter}
                                isLoading={loadingKec}
                                disabled={!kabupatenFilter}
                                onChange={(v) => { setKecamatanFilter(v); setPage(1); }}
                                className="!h-[34px] !rounded-[14px] !border-[#E5E7EB] !text-[11px]"
                            />
                        </div>

                        {/* Mobile List Section */}
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <Loader2 className="animate-spin text-[#0080C5]" size={30} />
                            </div>
                        ) : isError ? (
                            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl">
                                <p className="text-red-500 mb-4 text-[12px]">Gagal memuat data admin.</p>
                                <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg text-[12px]">Coba Lagi</button>
                            </div>
                        ) : admins.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl">
                                <p className="text-slate-500 text-[12px]">Tidak ada data admin ditemukan.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-3 mt-1 w-full">
                                    {admins.map((item, index) => {
                                        const adminRole = item.roles?.[0]?.name || 'Admin';
                                        const roleColor = adminRole.includes('prov') ? 'text-[#0080C5]' : 'text-[#10B981]';
                                        const roleBg = adminRole.includes('prov') ? 'bg-[#0080C5]/10' : 'bg-[#10B981]/10';
                                        const isExpanded = expandedCardId === (item.id_user || item.id || index);
                                        
                                        return (
                                            <div key={item.id_user || item.id || index} className="bg-white border-[0.8px] border-[#F0F2F8] rounded-[16px] p-3 flex flex-col w-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all duration-200">
                                                <div className="flex items-center w-full cursor-pointer" onClick={() => toggleCard(item.id_user || item.id || index)}>
                                                    <div className="w-[38px] h-[38px] bg-[#0080C5] rounded-[14px] flex justify-center items-center shrink-0">
                                                        <span className="text-white text-[11px] font-semibold">{meta.from ? meta.from + index : index + 1}</span>
                                                    </div>
                                                    
                                                    <div className="flex flex-col ml-3 flex-1 overflow-hidden">
                                                        <span className="text-[13px] font-bold text-[#0A0F1E] truncate">{item.name}</span>
                                                        <span className="text-[11px] font-medium text-[#9298B0] truncate">{item.username}</span>
                                                    </div>
                                                    
                                                    <div className={`px-2 py-1 rounded-[10px] ${roleBg} shrink-0 mx-2`}>
                                                        <span className={`text-[9px] font-bold ${roleColor}`}>
                                                            {adminRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="w-5 h-5 flex items-center justify-center shrink-0 rounded-full bg-[#F0F2F8]">
                                                        <ChevronDown size={14} className={`text-[#9298B0] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                    </div>
                                                </div>
                                                
                                                {isExpanded && (
                                                    <div className="mt-3 pt-3 border-t-[0.8px] border-[#F0F2F8] flex flex-col gap-3 animate-fadeIn w-full">
                                                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                                            <div>
                                                                <span className="text-[#9298B0] text-[9px] block mb-0.5 uppercase tracking-wide font-semibold">No. Telp</span>
                                                                <span className="text-[#0A0F1E] text-[11px] font-bold">{item.no_telp || '-'}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-[#9298B0] text-[9px] block mb-0.5 uppercase tracking-wide font-semibold">Provinsi</span>
                                                                <span className="text-[#0A0F1E] text-[11px] font-bold">{item.provinsi?.name || '-'}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-[#9298B0] text-[9px] block mb-0.5 uppercase tracking-wide font-semibold">Kabupaten</span>
                                                                <span className="text-[#0A0F1E] text-[11px] font-bold">{item.kabupaten?.name || '-'}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-[#9298B0] text-[9px] block mb-0.5 uppercase tracking-wide font-semibold">Kecamatan</span>
                                                                <span className="text-[#0A0F1E] text-[11px] font-bold">{item.kecamatan?.name || '-'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-row items-center gap-2 mt-1 w-full pt-3 border-t-[0.8px] border-[#F0F2F8]">
                                                            {isSuperAdmin() && (
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); setSelectedAdmin(item); setIsResetModalOpen(true); }}
                                                                    className="flex-1 h-[34px] rounded-[10px] bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-white transition-all text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95"
                                                                >
                                                                    <Lock size={14} /> Reset
                                                                </button>
                                                            )}
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); setSelectedAdmin(item); setIsEditModalOpen(true); }}
                                                                className="flex-1 h-[34px] rounded-[10px] bg-[#F0F2F8] text-[#0A0F1E] hover:bg-slate-200 transition-all text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95"
                                                            >
                                                                <Edit size={14} /> Edit
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); setSelectedAdmin(item); setIsDeleteModalOpen(true); }}
                                                                className="flex-1 h-[34px] rounded-[10px] bg-[#FEE2E2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95"
                                                            >
                                                                <Trash2 size={14} /> Hapus
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {meta && meta.total > 0 && (
                                    <div className="flex flex-row justify-between items-center w-full mt-4 px-1 pb-4">
                                        <p className="text-[#9298B0] text-[10px] font-medium">
                                            Menampilkan <span className="font-bold text-[#0A0F1E]">{meta.from}-{meta.to}</span> dari <span className="font-bold text-[#0A0F1E]">{meta.total}</span>
                                        </p>
                                        <div className="flex items-center gap-1.5">
                                            <button 
                                                onClick={() => setPage(old => Math.max(old - 1, 1))}
                                                disabled={page === 1}
                                                className="w-7 h-7 flex items-center justify-center rounded-[10px] bg-white border border-[#E5E7EB] text-[#0A0F1E] opacity-50 hover:bg-slate-50 disabled:opacity-30"
                                            >
                                                <ChevronLeft size={14} />
                                            </button>
                                            <button className="w-7 h-7 bg-[#0080C5] text-white rounded-[10px] flex items-center justify-center text-[11px] font-bold">
                                                {page}
                                            </button>
                                            <button 
                                                onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                                disabled={page === meta.last_page}
                                                className="w-7 h-7 flex items-center justify-center rounded-[10px] bg-white border border-[#E5E7EB] text-[#0A0F1E] hover:bg-slate-50 disabled:opacity-30"
                                            >
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <AddAdminModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
            />
            {isEditModalOpen && (
                <EditAdminModal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    data={selectedAdmin}
                />
            )}
            {isDeleteModalOpen && (
                <DeleteAdminModal 
                    isOpen={isDeleteModalOpen} 
                    onClose={() => setIsDeleteModalOpen(false)} 
                    data={selectedAdmin}
                />
            )}
            {isResetModalOpen && (
                <ResetPasswordModal 
                    isOpen={isResetModalOpen} 
                    onClose={() => setIsResetModalOpen(false)} 
                    data={selectedAdmin}
                />
            )}
        </AdminLayout>
    );
};

export default DataAdminPage;
