import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import DetailKegiatanModal from '../../components/modals/DetailKegiatanModal';
import DeleteKegiatanModal from '../../components/modals/DeleteKegiatanModal';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/storage';
import { ROLES } from '../../constants/roles';
import { Search, Edit, Trash2, Clock, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

const KelolaKegiatanPage = () => {
    const navigate = useNavigate();
    const user = getUser();
    const isFasilitator = user?.role === ROLES.FASILITATOR;

    const [searchTerm, setSearchTerm] = useState('');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const reports = [
        { judul: 'Pelatihan Pengolahan H...', deskripsi: 'Pelatihan intensif mengenai teknik', tanggal: '30 Apr 2026', lokasi: 'Balai Desa Maju, Kec. Boyolali', waktu: '08:00 – 12:00', grup: 'Kelompok Tani Makmur', status: 'Draft', statusColor: 'bg-amber-50 text-amber-500', dot: 'bg-amber-500' },
        { judul: 'Pendampingan Budidaya', deskripsi: 'Sesi pendampingan teknik budidaya', tanggal: '22 Apr 2026', lokasi: 'Kebun Percontohan Desa Maju', waktu: '07:00 – 10:00', grup: 'Kelompok Tani Makmur', status: 'Selesai', statusColor: 'bg-[#ECFDF5] text-[#10B981]', dot: 'bg-[#10B981]' },
        { judul: 'Pelatihan Pengolahan H...', deskripsi: 'Pelatihan intensif mengenai teknik', tanggal: '18 Apr 2026', lokasi: 'Balai Desa Maju, Kec. Boyolali', waktu: '08:00 – 12:00', grup: 'Kelompok Tani Makmur', status: 'Selesai', statusColor: 'bg-[#ECFDF5] text-[#10B981]', dot: 'bg-[#10B981]' },
        { judul: 'Pendampingan Usaha M...', deskripsi: 'Sesi pendampingan bagi pelaku usaha kecil', tanggal: '10 Apr 2026', lokasi: 'Kantor Kelurahan Sejahtera', waktu: '09:00 – 11:00', grup: 'Kelompok Usaha Bersam...', status: 'Selesai', statusColor: 'bg-[#ECFDF5] text-[#10B981]', dot: 'bg-[#10B981]' },
        { judul: 'Penyuluhan Kesehatan', deskripsi: 'Edukasi kesehatan dasar dan pencegahan', tanggal: '5 Apr 2026', lokasi: 'Puskesmas Desa Bahagia', waktu: '08:00 – 10:00', grup: 'Grup Dampingan Nelayo...', status: 'Selesai', statusColor: 'bg-[#ECFDF5] text-[#10B981]', dot: 'bg-[#10B981]' },
    ];

    const filtered = reports.filter(r => r.judul.toLowerCase().includes(searchTerm.toLowerCase()));

    const confirmDelete = () => {
        setIsDeleteModalOpen(false);
        Swal.fire({ title: 'Berhasil!', text: 'Laporan kegiatan telah dihapus.', icon: 'success', confirmButtonColor: '#0080C5', customClass: { popup: 'rounded-3xl font-["Poppins"]' } });
    };

    return (
        <AdminLayout title="Kelola Kegiatan">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] overflow-hidden">

                    {/* Header */}
                    <div className="px-8 py-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-base font-bold text-slate-950 tracking-tight">Daftar Laporan Kegiatan</h2>
                            <p className="text-xs text-slate-400">{filtered.length} dari {reports.length} kegiatan ditampilkan</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari kegiatan..."
                                    className="w-56 h-10 pl-10 pr-4 bg-gray-50 rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-[#9298B0] transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {isFasilitator && (
                                <button
                                    onClick={() => navigate('/kelola-kegiatan/tambah')}
                                    className="h-10 px-4 bg-[#0080C5] text-white rounded-[10px] flex items-center gap-2 text-xs font-semibold hover:bg-sky-700 transition-all shadow-sm whitespace-nowrap"
                                >
                                    <Plus size={15} />
                                    Tambah Kegiatan
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-y border-[#F0F2F8] bg-[#FAFBFD]">
                                    {['JUDUL KEGIATAN','DESKRIPSI','TANGGAL PELAKSANAAN','WAKTU','GRUP','STATUS LAPORAN','AKSI'].map(h => (
                                        <th key={h} className={`py-3 px-6 ${h === 'AKSI' ? 'text-center' : 'text-left'} text-[#6B7280] text-[10px] font-bold uppercase tracking-widest`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F2F8]">
                                {filtered.map((item, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <span onClick={() => { setSelectedActivity(item); setIsDetailModalOpen(true); }} className="text-[#0A0F1E] text-xs font-bold hover:text-[#0080C5] cursor-pointer transition-colors">{item.judul}</span>
                                        </td>
                                        <td className="py-4 px-6 max-w-[160px]"><p className="text-gray-500 text-xs line-clamp-2">{item.deskripsi}</p></td>
                                        <td className="py-4 px-6">
                                            <span className="text-slate-950 text-xs font-semibold block">{item.tanggal}</span>
                                            <span className="text-slate-400 text-[10px] line-clamp-1">{item.lokasi}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1.5"><Clock size={12} className="text-slate-400" /><span className="text-xs text-slate-700">{item.waktu}</span></div>
                                        </td>
                                        <td className="py-4 px-6"><span className="text-slate-700 text-xs">{item.grup}</span></td>
                                        <td className="py-4 px-6">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${item.statusColor}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />{item.status}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => navigate(`/kelola-kegiatan/edit/${i + 1}`)} className="w-7 h-7 flex items-center justify-center bg-[#FB923C]/10 text-[#FB923C] rounded-md hover:bg-[#FB923C] hover:text-white transition-all"><Edit size={13} /></button>
                                                <button onClick={() => { setSelectedActivity(item); setIsDeleteModalOpen(true); }} className="w-7 h-7 flex items-center justify-center bg-[#EF4444]/10 text-[#EF4444] rounded-md hover:bg-[#EF4444] hover:text-white transition-all"><Trash2 size={13} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-8 py-4 border-t border-gray-50">
                        <span className="text-slate-400 text-xs">Menampilkan <span className="font-bold text-slate-950">{filtered.length}</span> Laporan Kegiatan</span>
                    </div>
                </div>
            </div>

            <DetailKegiatanModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} data={selectedActivity} />
            <DeleteKegiatanModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} data={selectedActivity} />
        </AdminLayout>
    );
};

export default KelolaKegiatanPage;
