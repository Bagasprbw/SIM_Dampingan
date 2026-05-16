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
    Printer
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

    const dataGrup = grupData?.data || [];
    const meta = grupData?.meta || {};

    return (
        <AdminLayout title="Data Grup Dampingan">
            <div className="p-8 font-['Poppins']">
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8 min-h-[calc(100vh-160px)]">
                
                {/* Action Bar (Tambah & Cetak) */}
                <div className="flex justify-end items-center gap-3.5 mb-6">
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"
                    >
                        <Plus size={18} />
                        <span>Tambah</span>
                    </button>
                    <button className="h-9 px-4 bg-[#22C55E] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-sm text-[13px] font-semibold">
                        <Printer size={18} />
                        <span>Cetak Data</span>
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="space-y-4 mb-6 text-left">
                    {/* Search Bar */}
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Cari grup dampingan, bidang, jenis..."
                            className="w-full h-11 pl-12 pr-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all font-['Poppins']"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Filters Row */}
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
                    </div>
                </div>

                {/* Table Section */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-red-500 mb-4">Gagal memuat data grup dampingan.</p>
                        <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                    </div>
                ) : dataGrup.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-slate-500">Tidak ada data grup dampingan ditemukan.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
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
                                        <td className="py-2.5 px-4 text-[#0A0F1E] text-[11px] font-semibold text-center">
                                            {meta.from ? meta.from + index : index + 1}
                                        </td>
                                        <td className="py-2.5 px-4 text-[#0080C5] text-[11px] font-semibold">{item.name}</td>
                                        <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-xs font-normal">{item.bidang?.name || '-'}</td>
                                        <td className="py-2.5 px-4 text-center text-[#0080C5] text-[11px] font-semibold">{item.level_dampingan}</td>
                                        <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.provinsi?.name || '-'}</td>
                                        <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.kabupaten?.name || '-'}</td>
                                        <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.kecamatan?.name || '-'}</td>
                                        <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">
                                            <div className="text-left truncate max-w-[200px]" title={item.grup_fasilitators?.map(gf => gf.fasilitator?.name).join(', ')}>
                                                {item.grup_fasilitators?.map(gf => gf.fasilitator?.name).join(', ') || '-'}
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 ">
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
                )}

                {/* Pagination */}
                {meta && meta.total > 0 && (
                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6 font-['Poppins']">
                        <p className="text-[#9298B0] text-xs font-normal">
                            Menampilkan {meta.from}-{meta.to} dari {meta.total} data
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button 
                                onClick={() => setPage(old => Math.max(old - 1, 1))}
                                disabled={page === 1}
                                className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-md bg-[#0080C5] text-white text-[11px] font-semibold shadow-sm">
                                {page}
                            </button>
                            <button 
                                onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                disabled={page === meta.last_page}
                                className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                <ChevronRight size={14} />
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
