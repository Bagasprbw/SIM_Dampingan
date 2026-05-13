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
    User,
    Loader2,
    X
} from 'lucide-react';
import { useAnggotas } from '../../hooks/queries/useAnggotaQuery';
import { usePengajuanAnggotaSaya } from '../../hooks/queries/usePengajuanAnggotaQuery';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import AddDampinganModal from '../../components/modals/AddDampinganModal';
import EditDampinganModal from '../../components/modals/EditDampinganModal';
import DeleteDampinganModal from '../../components/modals/DeleteDampinganModal';

const KelolaAnggotaPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const [page, setPage] = useState(1);
    const { user } = useCurrentUser();
    const isPjGrup = user?.role === 'pj_grup';

    // Hook yang digunakan tergantung role
    const { data: anggotaData, isLoading, isError, refetch } = isPjGrup 
        ? usePengajuanAnggotaSaya({ page, search: searchTerm })
        : useAnggotas({ page, search: searchTerm });

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const dataAnggota = Array.isArray(anggotaData?.data) 
        ? anggotaData.data 
        : (anggotaData?.data?.data || anggotaData?.data || []);
    const meta = anggotaData?.meta || anggotaData?.data || {};

    const getStatusColor = (status) => {
        switch(status) {
            case 'aktif': return { statusColor: 'bg-[#ECFDF5] text-[#10B981]', dotColor: 'bg-[#10B981]' };
            case 'pending': return { statusColor: 'bg-[#FFF7ED] text-[#F59E0B]', dotColor: 'bg-[#F59E0B]' };
            case 'ditolak': return { statusColor: 'bg-[#FEF2F2] text-[#EF4444]', dotColor: 'bg-[#EF4444]' };
            default: return { statusColor: 'bg-slate-100 text-slate-500', dotColor: 'bg-slate-400' };
        }
    };

    const handleEdit = (item) => {
        setSelectedData(item);
        setIsEditOpen(true);
    };

    const handleDelete = (item) => {
        setSelectedData(item);
        setIsDeleteOpen(true);
    };

    return (
        <AdminLayout title="Kelola Anggota">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                
                {/* Unified Card Container */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200">
                    
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-[#0080C5] rounded-xl flex items-center justify-center">
                                <User size={24} />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-[#0A0F1E] text-base font-bold tracking-tight">Daftar Masyarakat Dampingan</h2>
                                <p className="text-[#9298B0] text-xs font-normal">Anggota yang akan dikonfirmasi oleh admin</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Cari Nama Masyarakat..." 
                                    className="pl-11 pr-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-xs font-medium w-64 focus:outline-none focus:border-[#0080C5] transition-all"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                            <div className="px-4 py-2 border-2 border-slate-100 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-all">
                                <span className="text-xs font-medium text-slate-600">Semua Status</span>
                                <ChevronDown size={16} className="text-slate-400" />
                            </div>
                            <button 
                                onClick={() => setIsAddOpen(true)}
                                className="h-10 px-4 bg-[#0080C5] text-white rounded-xl flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-xs font-semibold whitespace-nowrap"
                            >
                                <Plus size={16} />
                                <span>Tambah Anggota</span>
                            </button>
                        </div>
                    </div>

                    {/* Table Content */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-red-500 mb-4">Gagal memuat data anggota.</p>
                            <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                        </div>
                    ) : dataAnggota.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-slate-500">Tidak ada data anggota ditemukan.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-separate border-spacing-y-2">
                                <thead>
                                    <tr>
                                        <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">NO.ANGGOTA</th>
                                        <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">NAMA</th>
                                        <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">FOTO</th>
                                        <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">JENIS KELAMIN</th>
                                        <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">ALAMAT</th>
                                        <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">STATUS</th>
                                        <th className="py-3 px-4 text-center text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataAnggota.map((item, index) => {
                                        const { statusColor, dotColor } = getStatusColor(item.status);
                                        return (
                                            <tr key={item.id || index} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-4 px-4 text-[#0A0F1E] text-xs font-bold border-y border-l border-slate-100 rounded-l-xl whitespace-nowrap">{item.no_anggota || '-'}</td>
                                                <td className="py-4 px-4 text-left border-y border-slate-100 whitespace-nowrap">
                                                    <span className="text-[#0A0F1E] text-xs font-bold">{item.name}</span>
                                                </td>
                                                <td className="py-4 px-4 text-left border-y border-slate-100 whitespace-nowrap">
                                                    <div 
                                                        onClick={() => {
                                                            if (item.foto) {
                                                                setPreviewImage(item.foto.startsWith('http') ? item.foto : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${item.foto}`);
                                                                setIsPreviewOpen(true);
                                                            }
                                                        }}
                                                        className={`w-10 h-10 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden ${item.foto ? 'cursor-pointer hover:ring-2 hover:ring-[#0080C5] transition-all' : ''}`}
                                                    >
                                                        {item.foto ? (
                                                            <img 
                                                                src={item.foto.startsWith('http') ? item.foto : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${item.foto}`} 
                                                                alt={item.name} 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <User size={16} className="text-slate-300" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-left border-y border-slate-100 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${item.jenis_kelamin === 'L' ? 'bg-[#0080C5]' : 'bg-[#D52BCA]'}`} />
                                                        <span className="text-[#0A0F1E] text-xs font-semibold">{item.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-left text-[#6B7280] text-xs font-medium border-y border-slate-100 truncate max-w-[150px]">{item.alamat || '-'}</td>
                                                <td className="py-4 px-4 text-left border-y border-slate-100">
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${statusColor}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                                        <span className="text-[10px] font-bold capitalize">{item.status}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 border-y border-r border-slate-100 rounded-r-xl">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button 
                                                            onClick={() => handleEdit(item)}
                                                            className="w-8 h-8 flex items-center justify-center bg-[#FB923C]/10 text-[#FB923C] rounded-lg hover:bg-[#FB923C] hover:text-white transition-all"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(item)}
                                                            className="w-8 h-8 flex items-center justify-center bg-[#EF4444]/10 text-[#EF4444] rounded-lg hover:bg-[#EF4444] hover:text-white transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination Placeholder */}
                    {meta && meta.total > 0 && (
                        <div className="mt-6 flex justify-between items-center text-xs font-medium text-slate-400">
                            <span>Menampilkan {meta.from}-{meta.to} dari {meta.total} Anggota</span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                                    disabled={page === 1}
                                    className="p-1 border rounded disabled:opacity-50"
                                >
                                    <ChevronLeft size={14} />
                                </button>
                                <span className="px-2">{page}</span>
                                <button 
                                    onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                    disabled={page === meta.last_page}
                                    className="p-1 border rounded disabled:opacity-50"
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                {/* Modals */}
                <AddDampinganModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} isPengajuan={isPjGrup} />
                <EditDampinganModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} data={selectedData} isPengajuan={isPjGrup} />
                <DeleteDampinganModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} data={selectedData} isPengajuan={isPjGrup} />

            </div>
            {/* Image Preview Modal */}
            {isPreviewOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPreviewOpen(false)}></div>
                    <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        <button 
                            onClick={() => setIsPreviewOpen(false)}
                            className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors z-10"
                        >
                            <X size={20} />
                        </button>
                        <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="w-full h-auto max-h-[80vh] object-contain bg-slate-50"
                        />
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default KelolaAnggotaPage;
