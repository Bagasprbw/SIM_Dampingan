import React, { useState, useEffect } from 'react';
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
import { useBidangs } from '../../hooks/queries/useMasterQuery';
import { useGrupDampingans } from '../../hooks/queries/useGrupDampinganQuery';
import { getUser } from '../../utils/storage';

const DataDampinganPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [page, setPage] = useState(1);

    // Get User and Role Scopes
    const currentUser = getUser();
    const isSuperAdmin = currentUser?.role === 'superadmin' || currentUser?.username === 'superadmin';
    const isAdminProv = currentUser?.role === 'admin_provinsi';
    const isAdminKab = currentUser?.role === 'admin_kabupaten';
    const isAdminKec = currentUser?.role === 'admin_kecamatan';

    // Filter States
    const [provinsiFilter, setProvinsiFilter] = useState(null);
    const [kabupatenFilter, setKabupatenFilter] = useState(null);
    const [kecamatanFilter, setKecamatanFilter] = useState(null);
    const [genderFilter, setGenderFilter] = useState(null);
    const [bidangFilter, setBidangFilter] = useState(null);
    const [grupFilter, setGrupFilter] = useState(null);

    // Initialize regional filters based on role
    useEffect(() => {
        if (isAdminProv) {
            setProvinsiFilter(currentUser?.kode_prov || null);
        } else if (isAdminKab) {
            setProvinsiFilter(currentUser?.kode_prov || null);
            setKabupatenFilter(currentUser?.kode_kab || null);
        } else if (isAdminKec) {
            setProvinsiFilter(currentUser?.kode_prov || null);
            setKabupatenFilter(currentUser?.kode_kab || null);
            setKecamatanFilter(currentUser?.kode_kec || null);
        }
    }, [currentUser, isAdminProv, isAdminKab, isAdminKec]);

    // Wilayah Queries
    const { data: provinsiList = [], isLoading: loadingProv } = useProvinsi();
    const { data: kabupatenList = [], isLoading: loadingKab } = useKabupaten(provinsiFilter);
    const { data: kecamatanList = [], isLoading: loadingKec } = useKecamatan(kabupatenFilter);

    const provinsiOptions = provinsiList.map(p => ({ kode: p.kode, name: p.name }));
    const kabupatenOptions = kabupatenList.map(k => ({ kode: k.kode, name: k.name }));
    const kecamatanOptions = kecamatanList.map(k => ({ kode: k.kode, name: k.name }));

    // Master Queries for Filters
    const { data: bidangsRes, isLoading: loadingBidangs } = useBidangs();
    const bidangs = bidangsRes?.data || [];

    const { data: grupsRes, isLoading: loadingGrups } = useGrupDampingans({
        per_page: 100,
        ...(provinsiFilter && { kode_prov: provinsiFilter }),
        ...(kabupatenFilter && { kode_kab: kabupatenFilter }),
        ...(kecamatanFilter && { kode_kec: kecamatanFilter }),
    });
    const grups = grupsRes?.data || [];

    // Main Query
    const { data: anggotaData, isLoading, isError, refetch } = useAnggotas({
        page: page,
        search: searchTerm,
        jenis_kelamin: genderFilter,
        bidang_id: bidangFilter,
        grup_id: grupFilter,
        ...(provinsiFilter && { kode_prov: provinsiFilter }),
        ...(kabupatenFilter && { kode_kab: kabupatenFilter }),
        ...(kecamatanFilter && { kode_kec: kecamatanFilter }),
    });

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

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

    // Print beautiful custom member card
    const handlePrintCard = (item) => {
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
        const photoUrl = item.foto ? `${baseUrl}/storage/${item.foto}` : '';
        const qrUrl = item.qr_code ? `${baseUrl}/storage/${item.qr_code}` : '';
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <html>
            <head>
                <title>Kartu Anggota - ${item.name}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
                    body {
                        font-family: 'Poppins', sans-serif;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background: #ffffff;
                    }
                    .card {
                        width: 420px;
                        height: 250px;
                        background: linear-gradient(135deg, #0080C5 0%, #004E7C 100%);
                        border-radius: 16px;
                        box-shadow: 0 10px 30px rgba(0, 128, 197, 0.2);
                        color: white;
                        padding: 24px;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        position: relative;
                        overflow: hidden;
                    }
                    .card::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%);
                        pointer-events: none;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .logo-section {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .logo-img {
                        width: 30px;
                        height: 35px;
                        object-fit: contain;
                        filter: brightness(0) invert(1);
                    }
                    .logo-title {
                        font-weight: 700;
                        font-size: 14px;
                        letter-spacing: 0.5px;
                        line-height: 1.1;
                    }
                    .logo-subtitle {
                        font-size: 9px;
                        opacity: 0.8;
                    }
                    .card-label {
                        font-size: 8px;
                        font-weight: 700;
                        background: rgba(255,255,255,0.2);
                        padding: 4px 10px;
                        border-radius: 20px;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                    }
                    .body {
                        display: flex;
                        gap: 16px;
                        align-items: center;
                        margin-top: 15px;
                        margin-bottom: 10px;
                    }
                    .avatar {
                        width: 75px;
                        height: 75px;
                        border-radius: 50%;
                        border: 2px solid white;
                        object-fit: cover;
                        background: white;
                    }
                    .avatar-placeholder {
                        width: 75px;
                        height: 75px;
                        border-radius: 50%;
                        border: 2px solid white;
                        background: rgba(255,255,255,0.1);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 28px;
                    }
                    .details {
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                        text-align: left;
                    }
                    .name {
                        font-weight: 700;
                        font-size: 16px;
                        letter-spacing: 0.3px;
                    }
                    .no-anggota {
                        font-size: 11px;
                        opacity: 0.9;
                        font-family: monospace;
                    }
                    .group-info {
                        font-size: 10px;
                        opacity: 0.8;
                        margin-top: 2px;
                    }
                    .qr-section {
                        width: 70px;
                        height: 70px;
                        background: white;
                        border-radius: 8px;
                        padding: 4px;
                        box-sizing: border-box;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    }
                    .qr-img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                    .footer {
                        font-size: 8px;
                        opacity: 0.7;
                        text-align: center;
                        border-top: 1px solid rgba(255,255,255,0.15);
                        padding-top: 8px;
                        letter-spacing: 0.5px;
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="header">
                        <div class="logo-section">
                            <img class="logo-img" src="/images/logo-mpm.png" />
                            <div>
                                <div class="logo-title">MPM</div>
                                <div class="logo-subtitle">Muhammadiyah</div>
                            </div>
                        </div>
                        <div class="card-label">KARTU ANGGOTA</div>
                    </div>
                    
                    <div class="body">
                        ${photoUrl 
                            ? `<img class="avatar" src="${photoUrl}" />` 
                            : `<div class="avatar-placeholder">👤</div>`
                        }
                        <div class="details">
                            <div class="name">${item.name}</div>
                            <div class="no-anggota">${item.no_anggota || '-'}</div>
                            <div class="group-info">Grup: ${item.grup_dampingan?.name || '-'}</div>
                            <div class="group-info">Bidang: ${item.bidang?.name || '-'}</div>
                        </div>
                        
                        ${qrUrl 
                            ? `<div class="qr-section"><img class="qr-img" src="${qrUrl}" /></div>` 
                            : ''
                        }
                    </div>
                    
                    <div class="footer">
                        MAJLIS PEMBERDAYAAN MASYARAKAT (MPM) PIMPINAN PUSAT MUHAMMADIYAH
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                        }, 500);
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const genderOptions = [
        { value: 'L', label: 'Laki-laki' },
        { value: 'P', label: 'Perempuan' }
    ];

    const dataDampingan = anggotaData?.data || [];
    const meta = anggotaData?.meta || {};

    return (
        <AdminLayout title="Data Dampingan">
            <div className="p-8 font-['Poppins']">
                
                {/* Unified Card Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
                    
                    {/* Row 1: Action Buttons (Top Right) */}
                    <div className="flex justify-end items-center gap-3 mb-6">
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"
                        >
                            <Plus size={18} strokeWidth={3} />
                            <span>Tambah</span>
                        </button>
                        <button className="h-9 px-4 bg-[#22C55E] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-sm text-[13px] font-semibold">
                            <Printer size={18} />
                            <span>Cetak Data</span>
                            <ChevronDown size={18} />
                        </button>
                    </div>

                    {/* Row 2: Search Bar */}
                    <div className="relative mb-6">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari nama, no.anggota, alamat..."
                            className="w-full pl-12 pr-4 py-3 bg-white rounded-[10px] border-2 border-[#F1F5F9] focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-400 transition-all"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Row 3: Filters Row */}
                    <div className="flex flex-wrap items-center gap-3 mb-8">
                        <FilterDropdown
                            placeholder="Pilih Jenis Kelamin"
                            options={genderOptions}
                            value={genderFilter}
                            onChange={(v) => { setGenderFilter(v); setPage(1); }}
                        />
                        <FilterDropdown
                            placeholder="Pilih Bidang Dampingan"
                            options={bidangs}
                            value={bidangFilter}
                            valueKey="id_bidang"
                            labelKey="name"
                            isLoading={loadingBidangs}
                            onChange={(v) => { setBidangFilter(v); setPage(1); }}
                        />
                        <FilterDropdown
                            placeholder="Pilih Grup Dampingan"
                            options={grups}
                            value={grupFilter}
                            valueKey="id_grup_dampingan"
                            labelKey="name"
                            isLoading={loadingGrups}
                            onChange={(v) => { setGrupFilter(v); setPage(1); }}
                        />

                        {/* Regional Scoped Filters */}
                        {isSuperAdmin && (
                            <FilterDropdown
                                placeholder="Pilih Provinsi"
                                options={provinsiOptions}
                                value={provinsiFilter}
                                valueKey="kode"
                                labelKey="name"
                                isLoading={loadingProv}
                                onChange={(v) => { setProvinsiFilter(v); setKabupatenFilter(null); setKecamatanFilter(null); setPage(1); }}
                            />
                        )}
                        {(isSuperAdmin || isAdminProv) && (
                            <FilterDropdown
                                placeholder="Pilih Kabupaten"
                                options={kabupatenOptions}
                                value={kabupatenFilter}
                                valueKey="kode"
                                labelKey="name"
                                isLoading={loadingKab}
                                disabled={!provinsiFilter}
                                onChange={(v) => { setKabupatenFilter(v); setKecamatanFilter(null); setPage(1); }}
                            />
                        )}
                        {(isSuperAdmin || isAdminProv || isAdminKab) && (
                            <FilterDropdown
                                placeholder="Pilih Kecamatan"
                                options={kecamatanOptions}
                                value={kecamatanFilter}
                                valueKey="kode"
                                labelKey="name"
                                isLoading={loadingKec}
                                disabled={!kabupatenFilter}
                                onChange={(v) => { setKecamatanFilter(v); setPage(1); }}
                            />
                        )}
                    </div>

                    {/* Row 4: Table Content */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-red-500 mb-4">Gagal memuat data dampingan.</p>
                            <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                        </div>
                    ) : dataDampingan.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-slate-500">Tidak ada data dampingan ditemukan.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 border-b-2 border-slate-100">
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider rounded-tl-xl whitespace-nowrap text-center w-24">NO.Anggota</th>
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider min-w-[120px]">Nama</th>
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider text-center w-28 whitespace-nowrap">Jenis Kelamin</th>
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider min-w-[180px]">Alamat</th>
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider text-center w-40 leading-tight">Bidang Dampingan</th>
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider text-center w-40 leading-tight">Grup Dampingan</th>
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider text-center w-28">Aksi</th>
                                        <th className="py-3 px-4 text-[11px] font-semibold text-[#0A0F1E] uppercase tracking-wider text-center rounded-tr-xl w-24">Detail</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {dataDampingan.map((item, index) => (
                                        <tr key={item.id_anggota_grup || item.id || index} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                                            <td className="py-2.5 px-4 text-center text-[#9298B0] text-xs font-medium">{item.no_anggota || '-'}</td>
                                            <td className="py-2.5 px-4 text-xs">
                                                <span 
                                                    onClick={() => handleDetail(item)}
                                                    className="text-[#0080C5] font-bold hover:underline cursor-pointer"
                                                >
                                                    {item.name}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-xs font-normal">
                                                {item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                            </td>
                                            <td className="py-2.5 px-4 text-left text-[#0A0F1E] text-xs font-normal max-w-[220px] leading-relaxed">
                                                {item.alamat || '-'}
                                            </td>
                                            <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-xs font-normal">
                                                {item.bidang?.name || '-'}
                                            </td>
                                            <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-xs font-normal">
                                                {item.grup_dampingan?.name || '-'}
                                            </td>
                                            <td className="py-2.5 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => handleEdit(item)} 
                                                        className="w-7 h-7 flex items-center justify-center bg-[#FB923C]/10 text-[#FB923C] rounded-md hover:bg-[#FB923C] hover:text-white transition-all shadow-sm"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item)} 
                                                        className="w-7 h-7 flex items-center justify-center bg-[#EF4444]/10 text-[#EF4444] rounded-md hover:bg-[#EF4444] hover:text-white transition-all shadow-sm"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handlePrintCard(item)}
                                                        className="w-7 h-7 flex items-center justify-center bg-[#0080C5]/10 text-[#0080C5] rounded-md hover:bg-[#0080C5] hover:text-white transition-all shadow-sm"
                                                    >
                                                        <Printer size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-4 text-center">
                                                <button 
                                                    onClick={() => handleDetail(item)}
                                                    className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold mx-auto"
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

                    {/* Pagination */}
                    {meta && meta.total > 0 && (
                        <div className="mt-8 flex items-center justify-between">
                            <span className="text-[#9298B0] text-xs font-normal">
                                Menampilkan {meta.from}-{meta.to} dari {meta.total} data
                            </span>
                            <div className="flex items-center gap-1.5">
                                <button 
                                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                                    disabled={page === 1}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition-all"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold">
                                    {page}
                                </button>
                                <button 
                                    onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                    disabled={page === meta.last_page}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition-all"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AddDampinganModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            {isEditModalOpen && (
                <EditDampinganModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} data={selectedData} />
            )}
            {isDeleteModalOpen && (
                <DeleteDampinganModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} data={selectedData} />
            )}
            {isDetailModalOpen && (
                <DetailDampinganModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} data={selectedData} />
            )}
        </AdminLayout>
    );
};

export default DataDampinganPage;
