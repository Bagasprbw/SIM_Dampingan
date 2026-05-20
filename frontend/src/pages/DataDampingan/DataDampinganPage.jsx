import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import AddDampinganModal from '../../components/modals/AddDampinganModal';
import EditDampinganModal from '../../components/modals/EditDampinganModal';
import DeleteDampinganModal from '../../components/modals/DeleteDampinganModal';
import DetailDampinganModal from '../../components/modals/DetailDampinganModal';
import { 
    Search, 
    ChevronDown, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    Plus,
    Printer,
    FileDown,
    Loader2
} from 'lucide-react';
import { useAnggotas } from '../../hooks/queries/useAnggotaQuery';
import FilterDropdown from '../../components/common/FilterDropdown';
import { useProvinsi, useKabupaten, useKecamatan } from '../../hooks/queries/useWilayahQuery';

const DataDampinganPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [expandedCardId, setExpandedCardId] = useState(null);

    const handleEdit = (item) => {
        setSelectedData(item);
        setIsEditModalOpen(true);
    };

    const handleDelete = (item) => {
        setSelectedData(item);
        setIsDeleteModalOpen(true);
    };

    const handleDetail = (item) => {
        setSelectedData(item);
        setIsDetailModalOpen(true);
    };

    const [page, setPage] = useState(1);

    // Filter State
    const [provinsiFilter, setProvinsiFilter] = useState(null);
    const [kabupatenFilter, setKabupatenFilter] = useState(null);
    const [kecamatanFilter, setKecamatanFilter] = useState(null);

    // Wilayah Queries
    const { data: provinsiOptions = [], isLoading: loadingProv } = useProvinsi();
    const { data: kabupatenOptions = [], isLoading: loadingKab } = useKabupaten(provinsiFilter);
    const { data: kecamatanOptions = [], isLoading: loadingKec } = useKecamatan(kabupatenFilter);

    const { data: anggotaData, isLoading, isError, refetch } = useAnggotas({
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

    const dataDampingan = anggotaData?.data || [];
    const meta = anggotaData?.meta || {};

    return (
        <AdminLayout title="Data Dampingan">
            <div className="font-['Poppins']">
                
                {/* Unified Card Container */}
                <div className="bg-transparent lg:bg-white rounded-none lg:rounded-2xl shadow-none lg:shadow-sm border-0 lg:border lg:border-[#E5E7EB] p-0 lg:p-8 min-h-[calc(100vh-160px)]">
                    
                    {/* Row 1: Action Buttons (Top Right) */}
                    <div className="flex flex-wrap lg:flex-nowrap justify-end items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex-1 lg:flex-none h-10 lg:h-9 px-4 bg-[#0080C5] text-white rounded-xl lg:rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"
                        >
                            <Plus size={18} />
                            <span>Tambah</span>
                        </button>
                        <button className="flex-1 lg:flex-none h-10 lg:h-9 px-4 bg-[#22C55E] text-white rounded-xl lg:rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-sm text-[13px] font-semibold">
                            <FileDown size={18} />
                            <span>Cetak Data</span>
                            <ChevronDown size={18} className="hidden lg:block" />
                        </button>
                    </div>

                    {/* Row 2: Search Bar (Full Width) */}
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Cari nama, no.anggota, alamat..."
                            className="w-full h-11 lg:h-12 pl-12 pr-4 bg-white rounded-xl border border-slate-200 lg:border-gray-200 focus:border-[#0080C5] focus:outline-none text-[13px] lg:text-sm text-slate-800 lg:text-[#9298B0] font-medium transition-all shadow-sm lg:shadow-none"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 lg:text-[#9298B0]" size={18} />
                    </div>

                    {/* Row 3: Filters Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-2 lg:gap-3 mb-6 lg:mb-8">
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
                        <div className="w-full lg:w-auto sm:col-span-2">
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

                    {/* Table Content */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl">
                            <p className="text-red-500 mb-4">Gagal memuat data dampingan.</p>
                            <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                        </div>
                    ) : dataDampingan.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl">
                            <p className="text-slate-500">Tidak ada data dampingan ditemukan.</p>
                        </div>
                    ) : (
                        <>
                            {/* MOBILE LIST VIEW */}
                            <div className="flex flex-col gap-3 lg:hidden">
                                {dataDampingan.map((item, index) => {
                                    const isExpanded = expandedCardId === (item.id_anggota_grup || item.id || index);
                                    
                                    return (
                                        <div key={item.id_anggota_grup || item.id || index} className="bg-white rounded-[16px] p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleCard(item.id_anggota_grup || item.id || index)}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-sky-50 text-[#0080C5] rounded-xl flex flex-col items-center justify-center shrink-0">
                                                        <span className="text-[8px] font-semibold text-slate-500 leading-none mb-0.5">No</span>
                                                        <span className="text-[13px] font-bold leading-none">{meta.from ? meta.from + index : index + 1}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[#0080C5] text-[13px] font-bold">{item.nama}</span>
                                                        <span className="text-[#9298B0] text-[11px]">{item.no_anggota || '-'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-1 bg-pink-50 text-pink-500 rounded-full text-[10px] font-semibold whitespace-nowrap">
                                                        {item.jenis_kelamin === 'L' ? 'Laki-laki' : item.jenis_kelamin === 'P' ? 'Perempuan' : item.jenis_kelamin || '-'}
                                                    </span>
                                                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </div>
                                            </div>
                                            
                                            {isExpanded && (
                                                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 animate-fadeIn">
                                                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                                                        <div className="col-span-2">
                                                            <span className="text-slate-400 block mb-0.5">Alamat</span>
                                                            <span className="text-slate-800 font-medium">
                                                                {item.alamat || '-'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400 block mb-0.5">Bidang Dampingan</span>
                                                            <span className="text-slate-800 font-medium">
                                                                {item.grup_dampingan?.bidang?.nama_bidang || '-'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400 block mb-0.5">Grup Dampingan</span>
                                                            <span className="text-slate-800 font-medium">
                                                                {item.grup_dampingan?.nama_grup || '-'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap items-center justify-end gap-2 mt-2">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleDetail(item); }}
                                                            className="px-3 py-1.5 rounded-lg bg-[#0080C5]/10 text-[#0080C5] hover:bg-[#0080C5] hover:text-white transition-all text-[11px] font-semibold flex items-center gap-1.5"
                                                        >
                                                            Detail
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                                                            className="px-3 py-1.5 rounded-lg bg-[#FB923C]/10 text-[#FB923C] hover:bg-[#FB923C] hover:text-white transition-all text-[11px] font-semibold flex items-center gap-1.5"
                                                        >
                                                            <Edit size={12} /> Edit
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
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
                                <table className="w-full border-separate border-spacing-0">
                                    <thead>
                                        <tr>
                                            <th className="py-3 px-4 bg-[#F8FAFC] text-center text-slate-900 text-[11px] font-semibold border-y border-l border-slate-100 rounded-tl-xl whitespace-nowrap">NO.Anggota</th>
                                            <th className="py-3 px-4 bg-[#F8FAFC] text-left text-slate-900 text-[11px] font-semibold border-y border-slate-100 whitespace-nowrap">Nama</th>
                                            <th className="py-3 px-4 bg-[#F8FAFC] text-center text-slate-900 text-[11px] font-semibold border-y border-slate-100 whitespace-nowrap">Jenis Kelamin</th>
                                            <th className="py-3 px-4 bg-[#F8FAFC] text-left text-slate-900 text-[11px] font-semibold border-y border-slate-100 whitespace-nowrap">Alamat</th>
                                            <th className="py-3 px-4 bg-[#F8FAFC] text-center text-slate-900 text-[11px] font-semibold border-y border-slate-100 leading-tight whitespace-nowrap">Bidang Dampingan</th>
                                            <th className="py-3 px-4 bg-[#F8FAFC] text-center text-slate-900 text-[11px] font-semibold border-y border-slate-100 leading-tight whitespace-nowrap">Grup Dampingan</th>
                                            <th className="py-3 px-4 bg-[#F8FAFC] text-center text-slate-900 text-[11px] font-semibold border-y border-slate-100 whitespace-nowrap">Aksi</th>
                                            <th className="py-3 px-4 bg-[#F8FAFC] text-center text-slate-900 text-[11px] font-semibold border-y border-r border-slate-100 rounded-tr-xl whitespace-nowrap">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F0F2F8]">
                                        {dataDampingan.map((item, index) => (
                                            <tr key={item.id_anggota_grup || item.id || index} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-2.5 px-4 text-center text-[#9298B0] text-[12px] font-medium border-x-0">{item.no_anggota || '-'}</td>
                                                <td className="py-2.5 px-4 text-left border-x-0">
                                                    <span className="text-[#0080C5] text-[12px] font-bold hover:underline cursor-pointer">{item.nama}</span>
                                                </td>
                                                <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-[12px] font-normal border-x-0">{item.jenis_kelamin}</td>
                                                <td className="py-2.5 px-4 text-left text-[#0A0F1E] text-[12px] font-normal max-w-[220px] leading-relaxed border-x-0">
                                                    {item.alamat || '-'}
                                                </td>
                                                <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-[12px] font-normal border-x-0">{item.grup_dampingan?.bidang?.nama_bidang || '-'}</td>
                                                <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-[12px] font-normal border-x-0">{item.grup_dampingan?.nama_grup || '-'}</td>
                                                <td className="py-2.5 px-4 border-x-0 text-center">
                                                    <div className="flex items-center justify-center gap-2.5">
                                                        <button onClick={() => handleEdit(item)} className="w-7 h-7 flex items-center justify-center bg-[#FB923C]/12 text-[#FB923C] rounded-md hover:bg-[#FB923C] hover:text-white transition-all shadow-sm">
                                                            <Edit size={14} />
                                                        </button>
                                                        <button onClick={() => handleDelete(item)} className="w-7 h-7 flex items-center justify-center bg-[#EF4444]/10 text-[#EF4444] rounded-md hover:bg-[#EF4444] hover:text-white transition-all shadow-sm">
                                                            <Trash2 size={14} />
                                                        </button>
                                                        <button className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold">
                                                            <Printer size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-center border-x-0">
                                                    <button 
                                                        onClick={() => handleDetail(item)}
                                                        className="h-7 px-3 bg-[#0080C5]/10 text-[#0080C5] rounded-md flex items-center justify-center hover:bg-[#0080C5] hover:text-white transition-all text-[11px] font-bold mx-auto"
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

                    {/* Pagination */}
                    {meta && meta.total > 0 && (
                        <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-0 lg:border-t-0 pt-0">
                            <span className="text-[#9298B0] text-[11px] font-medium text-center sm:text-left">
                                Menampilkan {meta.from}-{meta.to} dari {meta.total} data
                            </span>
                            <div className="flex items-center gap-2 lg:gap-3">
                                <button 
                                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                                    disabled={page === 1}
                                    className="w-8 h-8 lg:w-7 lg:h-7 flex items-center justify-center rounded-lg border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50"
                                >
                                    <ChevronLeft size={18} className="lg:w-[14px] lg:h-[14px]" />
                                </button>
                                <button className="h-8 lg:h-7 px-3 flex items-center justify-center rounded-lg bg-[#0080C5] text-white text-[12px] lg:text-[11px] font-semibold shadow-sm">
                                    {page}
                                </button>
                                <button 
                                    onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                    disabled={page === meta.last_page}
                                    className="w-8 h-8 lg:w-7 lg:h-7 flex items-center justify-center rounded-lg border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50"
                                >
                                    <ChevronRight size={18} className="lg:w-[14px] lg:h-[14px]" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AddDampinganModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <EditDampinganModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} data={selectedData} />
            <DeleteDampinganModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} data={selectedData} />
            <DetailDampinganModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} data={selectedData} />
        </AdminLayout>
    );
};

export default DataDampinganPage;
