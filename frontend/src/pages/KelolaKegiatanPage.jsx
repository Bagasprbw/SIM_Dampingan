import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import DetailKegiatanModal from '../components/modals/DetailKegiatanModal';
import DeleteKegiatanModal from '../components/modals/DeleteKegiatanModal';
import { useNavigate } from 'react-router-dom';
import { 
    Search, 
    Edit, 
    Trash2, 
    Clock, 
    MapPin,
    ChevronDown
} from 'lucide-react';
import Swal from 'sweetalert2';

const KelolaKegiatanPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const handleDetail = (item) => {
        setSelectedActivity(item);
        setIsDetailModalOpen(true);
    };

    const handleDelete = (item) => {
        setSelectedActivity(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setIsDeleteModalOpen(false);
        Swal.fire({
            title: 'Berhasil!',
            text: 'Laporan kegiatan telah dihapus secara permanen.',
            icon: 'success',
            confirmButtonColor: '#0080C5',
            customClass: {
                popup: 'rounded-3xl font-["Poppins"]',
                confirmButton: 'rounded-xl px-10'
            }
        });
    };

    const reports = [
        ...Array(7).fill({
            judul: 'Pelatihan Pengolahan Hasil Tani',
            kategori: 'Pelatihan',
            deskripsi: 'Pelatihan intensif mengenai teknik pengolahan hasil pertanian agar lebih bernilai jual tinggi.',
            tanggal: '10 Apr 2026',
            lokasi: 'Balai Desa Maju, Kec. Boyolali',
            waktu: '08:00 – 12:00',
            grup: 'Kelompok Tani Makmur'
        })
    ];

    return (
        <AdminLayout title="Kelola Kegiatan">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                
                {/* Main Content Container */}
                <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                    
                    {/* Header Section */}
                    <div className="px-8 py-7 flex justify-between items-center bg-white">
                        <div className="flex flex-col">
                            <h2 className="text-base font-bold text-slate-950 tracking-tight">Daftar Laporan Kegiatan</h2>
                            <p className="text-xs text-slate-400 font-normal">7 dari 7 kegiatan ditampilkan</p>
                        </div>
                        <div className="relative w-64">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari kegiatan..."
                                className="w-full h-10 pl-11 pr-4 bg-gray-50 rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-[#9298B0] font-medium transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#FAFBFD]">
                                    <th className="py-5 px-6 text-center text-slate-400 text-[11px] font-semibold uppercase tracking-wider">JUDUL KEGIATAN</th>
                                    <th className="py-5 px-6 text-center text-slate-400 text-[11px] font-semibold uppercase tracking-wider">DESKRIPSI</th>
                                    <th className="py-5 px-6 text-center text-slate-400 text-[11px] font-semibold uppercase tracking-wider">TANGGAL PELAKSANAAN</th>
                                    <th className="py-5 px-6 text-center text-slate-400 text-[11px] font-semibold uppercase tracking-wider">WAKTU</th>
                                    <th className="py-5 px-6 text-center text-slate-400 text-[11px] font-semibold uppercase tracking-wider">GRUP</th>
                                    <th className="py-5 px-6 text-center text-slate-400 text-[11px] font-semibold uppercase tracking-wider">AKSI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F2F8]">
                                {reports.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                                        {/* Judul */}
                                        <td className="py-6 px-6">
                                            <div className="flex flex-col items-start gap-1">
                                                <span 
                                                    onClick={() => handleDetail(item)}
                                                    className="text-[#0080C5] text-xs font-bold leading-tight hover:underline cursor-pointer"
                                                >
                                                    {item.judul}
                                                </span>
                                                <span className="text-slate-400 text-[11px] font-normal">{item.kategori}</span>
                                            </div>
                                        </td>

                                        {/* Deskripsi */}
                                        <td className="py-6 px-6 max-w-[240px]">
                                            <p className="text-gray-500 text-xs font-normal leading-relaxed line-clamp-2">
                                                {item.deskripsi}
                                            </p>
                                        </td>

                                        {/* Tanggal & Lokasi */}
                                        <td className="py-6 px-6">
                                            <div className="flex flex-col items-start">
                                                <span className="text-slate-950 text-xs font-bold">{item.tanggal}</span>
                                                <span className="text-slate-400 text-[10px] font-normal leading-tight mt-0.5">{item.lokasi}</span>
                                            </div>
                                        </td>

                                        {/* Waktu */}
                                        <td className="py-6 px-6">
                                            <div className="flex items-center gap-1.5 text-slate-950">
                                                <Clock size={12} className="text-slate-400" />
                                                <span className="text-xs font-normal">{item.waktu}</span>
                                            </div>
                                        </td>

                                        {/* Grup */}
                                        <td className="py-6 px-6">
                                            <span className="text-slate-950 text-xs font-normal">{item.grup}</span>
                                        </td>

                                        {/* Aksi */}
                                        <td className="py-6 px-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => navigate(`/kelola-kegiatan/edit/${index + 1}`)}
                                                    className="w-8 h-8 flex items-center justify-center bg-[#FB923C]/12 text-[#FB923C] rounded-md hover:bg-[#FB923C] hover:text-white transition-all"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item)}
                                                    className="w-8 h-8 flex items-center justify-center bg-[#EF4444]/10 text-[#EF4444] rounded-md hover:bg-[#EF4444] hover:text-white transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="px-10 py-6 bg-white border-t border-gray-50 flex items-center">
                        <span className="text-slate-400 text-xs font-normal">
                            Menampilkan 7 Laporan Kegiatan
                        </span>
                    </div>
                </div>
            </div>

            {/* Modal Detail */}
            <DetailKegiatanModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
                data={selectedActivity} 
            />

            {/* Modal Hapus */}
            <DeleteKegiatanModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                onConfirm={confirmDelete} 
                data={selectedActivity} 
            />
        </AdminLayout>
    );
};

export default KelolaKegiatanPage;
