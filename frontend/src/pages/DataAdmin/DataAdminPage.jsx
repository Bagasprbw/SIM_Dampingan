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

const DataAdminPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [provinsiFilter, setProvinsiFilter] = useState(null);
    const [kabupatenFilter, setKabupatenFilter] = useState(null);
    const [kecamatanFilter, setKecamatanFilter] = useState(null);

    const { data: provinsiList = [], isLoading: loadingProv } = useProvinsi();
    const { data: kabupatenList = [], isLoading: loadingKab } = useKabupaten(provinsiFilter);
    const { data: kecamatanList = [], isLoading: loadingKec } = useKecamatan(kabupatenFilter);

    const provinsiOptions = provinsiList.map(p => ({ value: p.id, label: p.name }));
    const kabupatenOptions = kabupatenList.map(k => ({ value: k.id, label: k.name }));
    const kecamatanOptions = kecamatanList.map(k => ({ value: k.id, label: k.name }));


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

    const admins = adminData?.data || [];
    // BE /users/admin-bawahan is not paginated in some responses, or structure varies
    const meta = adminData?.meta || { from: 1, to: admins.length, total: admins.length, current_page: 1, last_page: 1 };

    return (
        <AdminLayout title="Data Admin">
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
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search size={18} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Cari nama, username, alamat, no. telp..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-12 pr-4 py-3 bg-white rounded-[10px] border-2 border-[#F1F5F9] focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-400 transition-all"
                            />
                        </div>

                        {/* Filter Row */}
                        <div className="flex flex-wrap items-center gap-3">
                            <FilterDropdown
                                placeholder="Pilih Provinsi"
                                options={provinsiOptions}
                                value={provinsiFilter}
                                isLoading={loadingProv}
                                onChange={(v) => { setProvinsiFilter(v); setKabupatenFilter(null); setKecamatanFilter(null); setPage(1); }}
                            />
                            <FilterDropdown
                                placeholder="Pilih Kabupaten"
                                options={kabupatenOptions}
                                value={kabupatenFilter}
                                isLoading={loadingKab}
                                disabled={!provinsiFilter}
                                onChange={(v) => { setKabupatenFilter(v); setKecamatanFilter(null); setPage(1); }}
                            />
                            <FilterDropdown
                                placeholder="Pilih Kecamatan"
                                options={kecamatanOptions}
                                value={kecamatanFilter}
                                isLoading={loadingKec}
                                disabled={!kabupatenFilter}
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
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-red-500 mb-4">Gagal memuat data admin.</p>
                            <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                        </div>
                    ) : admins.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-slate-500">Tidak ada data admin ditemukan.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-[#F1F5F9]">
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold rounded-tl-xl text-center">NO</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Nama</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Username</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Alamat</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">No.Telp</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Provinsi</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Kabupaten</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Kecamatan</th>
                                        <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold rounded-tr-xl text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {admins.map((item, index) => (
                                        <tr key={item.id_user || item.id || index} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-2.5 px-4 text-[#0A0F1E] text-[11px] font-semibold text-center">
                                                {meta.from ? meta.from + index : index + 1}
                                            </td>
                                            <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.nama}</td>
                                            <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.username}</td>
                                            <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.alamat || '-'}</td>
                                            <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.no_hp || '-'}</td>
                                            <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.provinsi?.name || '-'}</td>
                                            <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.kabupaten?.name || '-'}</td>
                                            <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.kecamatan?.name || '-'}</td>
                                            <td className="py-2.5 px-4 ">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedAdmin(item);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="w-7 h-7 rounded-md bg-[#FB923C]/12 flex items-center justify-center text-[#FB923C] hover:bg-[#FB923C] hover:text-white transition-all"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedAdmin(item);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="w-7 h-7 rounded-md bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedAdmin(item);
                                                            setIsResetModalOpen(true);
                                                        }}
                                                        className="w-6 h-6 rounded-md bg-[#FBBF24]/12 flex items-center justify-center text-[#FBBF24] hover:bg-[#FBBF24] hover:text-white transition-all"
                                                    >
                                                        <Lock size={12} />
                                                    </button>
                                                </div>
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
