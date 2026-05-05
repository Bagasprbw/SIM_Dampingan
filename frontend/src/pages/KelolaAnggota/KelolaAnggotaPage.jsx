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
    User
} from 'lucide-react';
import AddDampinganModal from '../../components/modals/AddDampinganModal';
import EditDampinganModal from '../../components/modals/EditDampinganModal';
import DeleteDampinganModal from '../../components/modals/DeleteDampinganModal';

const KelolaAnggotaPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const dataAnggota = [
        {
            noAnggota: '340406030002',
            nama: 'Ahmad Fauzi',
            gender: 'Laki-Laki',
            bidang: 'Pertanian',
            grup: 'Kelompok Josjis',
            alamat: 'Jl. Mawar No. 12, Karanga...',
            status: 'Disetujui',
            statusColor: 'bg-[#ECFDF5] text-[#10B981]',
            dotColor: 'bg-[#10B981]'
        },
        {
            noAnggota: '340406088002',
            nama: 'Bunga Citra',
            gender: 'Perempuan',
            bidang: 'Perternakan',
            grup: 'Kelompok Piunk',
            alamat: 'Jl. Mawar No. 12, Karanga...',
            status: 'Menunggu',
            statusColor: 'bg-[#FFF7ED] text-[#F59E0B]',
            dotColor: 'bg-[#F59E0B]'
        },
        ...Array(6).fill({
            noAnggota: '360406088002',
            nama: 'Bunga Mawar',
            gender: 'Perempuan',
            bidang: 'Perikanan',
            grup: 'Kelompok Piunk',
            alamat: 'Jl. Mawar No. 12, Karanga...',
            status: 'Ditolak',
            statusColor: 'bg-[#FEF2F2] text-[#EF4444]',
            dotColor: 'bg-[#EF4444]'
        })
    ];

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
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-y-2">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">NO.ANGGOTA</th>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">NAMA</th>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">JENIS KELAMIN</th>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">BIDANG</th>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">GRUP DAMPINGAN</th>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">ALAMAT</th>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">STATUS</th>
                                    <th className="py-3 px-4 text-center text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">AKSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataAnggota.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-4 text-[#0A0F1E] text-xs font-bold border-y border-l border-slate-100 rounded-l-xl whitespace-nowrap">{item.noAnggota}</td>
                                        <td className="py-4 px-4 text-left border-y border-slate-100 whitespace-nowrap">
                                            <span className="text-[#0A0F1E] text-xs font-bold">{item.nama}</span>
                                        </td>
                                        <td className="py-4 px-4 text-left border-y border-slate-100 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${item.gender === 'Laki-Laki' ? 'bg-[#0080C5]' : 'bg-[#D52BCA]'}`} />
                                                <span className="text-[#0A0F1E] text-xs font-semibold">{item.gender}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-left text-[#0A0F1E] text-xs font-bold border-y border-slate-100">{item.bidang}</td>
                                        <td className="py-4 px-4 text-left text-[#6B7280] text-xs font-medium border-y border-slate-100">{item.grup}</td>
                                        <td className="py-4 px-4 text-left text-[#6B7280] text-xs font-medium border-y border-slate-100 truncate max-w-[150px]">{item.alamat}</td>
                                        <td className="py-4 px-4 text-left border-y border-slate-100">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${item.statusColor}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`} />
                                                <span className="text-[10px] font-bold">{item.status}</span>
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
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Placeholder */}
                    <div className="mt-6 flex justify-between items-center text-xs font-medium text-slate-400">
                        <span>Menampilkan 8 dari 8 Anggota</span>
                    </div>

                </div>

                {/* Modals */}
                <AddDampinganModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
                <EditDampinganModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} data={selectedData} />
                <DeleteDampinganModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} data={selectedData} />

            </div>
        </AdminLayout>
    );
};

export default KelolaAnggotaPage;
