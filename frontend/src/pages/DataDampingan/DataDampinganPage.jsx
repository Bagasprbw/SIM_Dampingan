import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
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
import KartuDampinganModal from '../../components/modals/KartuDampinganModal';
import { exportToExcel } from '../../utils/exportToExcel';
import { getUser } from '../../utils/storage';

const DataDampinganPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isKartuModalOpen, setIsKartuModalOpen] = useState(false);
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

    const handlePrintKartu = (item) => {
        setSelectedData(item);
        setIsKartuModalOpen(true);
    };

    const [page, setPage] = useState(1);

    const currentUser = getUser();
    const currentUserRoleName = currentUser?.role;

    // Filter State
    const [provinsiFilter, setProvinsiFilter] = useState(
        ['admin_provinsi', 'admin_kabupaten', 'admin_kecamatan'].includes(currentUserRoleName) ? currentUser?.kode_prov : null
    );
    const [kabupatenFilter, setKabupatenFilter] = useState(
        ['admin_kabupaten', 'admin_kecamatan'].includes(currentUserRoleName) ? currentUser?.kode_kab : null
    );
    const [kecamatanFilter, setKecamatanFilter] = useState(
        ['admin_kecamatan'].includes(currentUserRoleName) ? currentUser?.kode_kec : null
    );

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

    const handleExport = () => {
        if (dataDampingan.length === 0) return;
        const exportData = dataDampingan.map((item, index) => ({
            'No': index + 1,
            'No. Anggota': item.no_anggota || '-',
            'Nama Lengkap': item.name || '-',
            'No. Telepon': item.no_telp || item.no_telepon || '-',
            'Tempat Lahir': item.tempat_lahir || '-',
            'Tanggal Lahir': item.tgl_lahir || item.tanggal_lahir || '-',
            'Jenis Kelamin': item.jenis_kelamin === 'L' ? 'Laki-laki' : item.jenis_kelamin === 'P' ? 'Perempuan' : item.jenis_kelamin || '-',
            'Agama': item.agama || '-',
            'Pekerjaan': item.pekerjaan?.name || item.pekerjaan_id || '-',
            'Status': item.status || '-',
            'Alamat': item.alamat || '-',
            'Bidang Dampingan': item.bidang?.name || '-',
            'Grup Dampingan': item.grup_dampingan?.name || item.grupDampingan?.name || '-'
        }));
        exportToExcel(exportData, 'Data_Dampingan');
    };

    return (
        <AdminLayout title="Data Dampingan">
            <div className="font-['Poppins']">
                
                {/* Unified Card Container */}
                <div className="bg-transparent lg:bg-white rounded-none lg:rounded-2xl shadow-none lg:shadow-sm border-0 lg:border lg:border-[#E5E7EB] p-0 lg:p-8 min-h-[calc(100vh-160px)]">
                    
                    {/* Row 1: Action Buttons (Top Right) - DESKTOP */}
                    <div className="hidden lg:flex justify-end items-center gap-3 mb-6">
                        <button 
                            onClick={() => navigate('/data-dampingan/tambah')}
                            className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"
                        >
                            <Plus size={18} />
                            <span>Tambah</span>
                        </button>
                        <button 
                            onClick={handleExport}
                            className="h-9 px-4 bg-[#22C55E] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-sm text-[13px] font-semibold"
                        >
                            <FileDown size={18} />
                            <span>Cetak Data</span>
                        </button>
                    </div>

                    {/* Row 2: Search Bar (Full Width) - DESKTOP */}
                    <div className="hidden lg:block relative mb-6">
                        <input
                            type="text"
                            placeholder="Cari nama, no.anggota, alamat..."
                            className="w-full h-12 pl-12 pr-4 bg-white rounded-xl border border-gray-200 focus:border-[#0080C5] focus:outline-none text-sm text-[#9298B0] font-medium transition-all shadow-none"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9298B0]" size={18} />
                    </div>

                    {/* Row 3: Filters Row - DESKTOP */}
                    <div className="hidden lg:flex flex-wrap items-center gap-3 mb-8">
                        <div className="w-auto">
                            <FilterDropdown
                                placeholder="Pilih Provinsi"
                                options={provinsiOptions}
                                value={provinsiFilter}
                                isLoading={loadingProv}
                                disabled={['admin_provinsi', 'admin_kabupaten', 'admin_kecamatan'].includes(currentUserRoleName)}
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
                                disabled={!provinsiFilter || ['admin_kabupaten', 'admin_kecamatan'].includes(currentUserRoleName)}
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
                                disabled={!kabupatenFilter || ['admin_kecamatan'].includes(currentUserRoleName)}
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
                            <div className="lg:hidden flex flex-col pb-24 bg-[#F0F2F8] min-h-screen gap-3">
                                {/* Mobile Action Buttons */}
                                <div className="flex flex-row justify-end items-center gap-2 w-full">
                                    <button 
                                        onClick={() => navigate('/data-dampingan/tambah')}
                                        className="h-[34px] px-3 bg-[#0080C5] text-white rounded-[14px] flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                        <Plus size={14} strokeWidth={3} />
                                        <span className="text-[12px] font-semibold">Tambah</span>
                                    </button>
                                    <button className="h-[34px] px-3 bg-[#22C55E] text-white rounded-[14px] flex items-center justify-center gap-1.5 shadow-sm">
                                        <FileDown size={14} />
                                        <span className="text-[12px] font-semibold">Cetak Data</span>
                                        <ChevronDown size={13} />
                                    </button>
                                </div>

                                {/* Mobile Search Bar */}
                                <div className="relative w-full h-[41px] bg-white border border-[#E5E7EB] rounded-[14px] flex items-center px-3 gap-2">
                                    <Search size={16} className="text-[#9298B0]" />
                                    <input 
                                        type="text" 
                                        placeholder="Cari nama, no.anggota, alamat..."
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
                                            options={provinsiOptions}
                                            value={provinsiFilter}
                                            isLoading={loadingProv}
                                            disabled={['admin_provinsi', 'admin_kabupaten', 'admin_kecamatan'].includes(currentUserRoleName)}
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
                                        disabled={!provinsiFilter || ['admin_kabupaten', 'admin_kecamatan'].includes(currentUserRoleName)}
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
                                        disabled={!kabupatenFilter || ['admin_kecamatan'].includes(currentUserRoleName)}
                                        valueKey="kode"
                                        labelKey="name"
                                        onChange={(v) => { setKecamatanFilter(v); setPage(1); }}
                                        className="!h-[34px] !rounded-[14px] !border-[#E5E7EB] !text-[11px]"
                                    />
                                </div>

                                {/* Mobile Data Cards */}
                                <div className="flex flex-col gap-2 w-full mt-1">
                                    {dataDampingan.map((item, index) => {
                                        const isExpanded = expandedCardId === (item.id_anggota_grup || item.id || index);
                                        
                                        return (
                                            <div key={item.id_anggota_grup || item.id || index} className="bg-white border border-[#F0F2F8] rounded-[16px] p-2.5 flex flex-col w-full shadow-sm relative overflow-hidden transition-all duration-200">
                                                <div className="flex items-center w-full cursor-pointer" onClick={() => toggleCard(item.id_anggota_grup || item.id || index)}>
                                                    <div className="w-[38px] h-[38px] bg-sky-50 rounded-[14px] flex flex-col justify-center items-center shrink-0">
                                                        <span className="text-slate-500 text-[8px] font-semibold leading-none mb-0.5">No</span>
                                                        <span className="text-[#0080C5] text-[13px] font-bold leading-none">{meta.from ? meta.from + index : index + 1}</span>
                                                    </div>
                                                    
                                                    <div className="flex flex-col ml-3 flex-1 overflow-hidden">
                                                        <span className="text-[13px] font-semibold text-[#0080C5] truncate">{item.name}</span>
                                                        <span className="text-[11px] font-normal text-[#9298B0] truncate">{item.no_anggota || '-'}</span>
                                                    </div>
                                                    
                                                    <div className="px-2 py-0.5 rounded-[10px] bg-pink-50 shrink-0 mx-2 flex items-center justify-center">
                                                        <span className="text-[10px] font-semibold text-pink-500">
                                                            {item.jenis_kelamin === 'L' ? 'Laki-laki' : item.jenis_kelamin === 'P' ? 'Perempuan' : item.jenis_kelamin || '-'}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                                        <ChevronDown size={14} className={`text-[#9298B0] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                    </div>
                                                </div>
                                                
                                                {isExpanded && (
                                                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2 animate-fadeIn w-full">
                                                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                                                            <div className="col-span-2">
                                                                <span className="text-slate-400 block mb-0.5">Alamat</span>
                                                                <span className="text-slate-800 font-medium whitespace-pre-wrap">
                                                                    {item.alamat || '-'}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-400 block mb-0.5">Bidang Dampingan</span>
                                                                <span className="text-slate-800 font-medium">
                                                                    {item.bidang?.name || '-'}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-400 block mb-0.5">Grup Dampingan</span>
                                                                <span className="text-slate-800 font-medium">
                                                                    {item.grup_dampingan?.name || item.grupDampingan?.name || '-'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center justify-end gap-2 mt-2 w-full">
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleDetail(item); }}
                                                                className="px-3 py-1.5 rounded-lg bg-[#0080C5]/10 text-[#0080C5] hover:bg-[#0080C5] hover:text-white transition-all text-[11px] font-semibold flex items-center gap-1.5"
                                                            >
                                                                Detail
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handlePrintKartu(item); }}
                                                                className="px-3 py-1.5 rounded-lg bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-all text-[11px] font-semibold flex items-center gap-1.5"
                                                            >
                                                                <Printer size={12} /> Cetak
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
                                                    <span className="text-[#0080C5] text-[12px] font-bold hover:underline cursor-pointer">{item.name}</span>
                                                </td>
                                                <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-[12px] font-normal border-x-0">{item.jenis_kelamin}</td>
                                                <td className="py-2.5 px-4 text-left text-[#0A0F1E] text-[12px] font-normal max-w-[220px] leading-relaxed border-x-0">
                                                    {item.alamat || '-'}
                                                </td>
                                                <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-[12px] font-normal border-x-0">{item.bidang?.name || '-'}</td>
                                                <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-[12px] font-normal border-x-0">{item.grup_dampingan?.name || item.grupDampingan?.name || '-'}</td>
                                                <td className="py-2.5 px-4 border-x-0 text-center">
                                                    <div className="flex items-center justify-center gap-2.5">
                                                        <button onClick={() => handleEdit(item)} className="w-7 h-7 flex items-center justify-center bg-[#FB923C]/12 text-[#FB923C] rounded-md hover:bg-[#FB923C] hover:text-white transition-all shadow-sm">
                                                            <Edit size={14} />
                                                        </button>
                                                        <button onClick={() => handleDelete(item)} className="w-7 h-7 flex items-center justify-center bg-[#EF4444]/10 text-[#EF4444] rounded-md hover:bg-[#EF4444] hover:text-white transition-all shadow-sm">
                                                            <Trash2 size={14} />
                                                        </button>
                                                        <button onClick={() => handlePrintKartu(item)} className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold">
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

                    {/* Pagination - DESKTOP */}
                    {meta && meta.total > 0 && (
                        <div className="hidden lg:flex mt-8 flex-row items-center justify-between gap-4 border-t-0 pt-0">
                            <span className="text-[#9298B0] text-[11px] font-medium text-left">
                                Menampilkan {meta.from}-{meta.to} dari {meta.total} data
                            </span>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                                    disabled={page === 1}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50"
                                >
                                    <ChevronLeft size={18} className="w-[14px] h-[14px]" />
                                </button>
                                <button className="h-7 px-3 flex items-center justify-center rounded-lg bg-[#0080C5] text-white text-[11px] font-semibold shadow-sm">
                                    {page}
                                </button>
                                <button 
                                    onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                    disabled={page === meta.last_page}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50"
                                >
                                    <ChevronRight size={18} className="w-[14px] h-[14px]" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <EditDampinganModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} data={selectedData} />
            <DeleteDampinganModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} data={selectedData} />
            <DetailDampinganModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
                data={selectedData} 
            />
            <KartuDampinganModal
                isOpen={isKartuModalOpen}
                onClose={() => setIsKartuModalOpen(false)}
                anggota={selectedData}
            />
        </AdminLayout>
    );
};

export default DataDampinganPage;
