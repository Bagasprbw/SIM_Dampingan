import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import DetailKegiatanModal from '../../components/modals/DetailKegiatanModal';
import DeleteKegiatanModal from '../../components/modals/DeleteKegiatanModal';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/storage';
import { ROLES } from '../../constants/roles';
import { Search, Edit, Trash2, Clock, Plus, Loader2, ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';

import { useKegiatansAdmin, useKegiatansFasilitator } from '../../hooks/queries/useKegiatanQuery';
import { useKegiatanMutations } from '../../hooks/mutations/useKegiatanMutation';

const KelolaKegiatanPage = () => {
    const navigate = useNavigate();
    const user = getUser();
    const isFasilitator = user?.role === ROLES.FASILITATOR;

    const [searchTerm, setSearchTerm] = useState('');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const [page, setPage] = useState(1);

    const adminQuery = useKegiatansAdmin({ page, search: searchTerm, enabled: !isFasilitator });
    const fasilitatorQuery = useKegiatansFasilitator({ page, search: searchTerm, enabled: isFasilitator });

    const activeQuery = isFasilitator ? fasilitatorQuery : adminQuery;
    const { data: kegiatanData, isLoading, isError, refetch } = activeQuery;

    const reports = kegiatanData?.data || [];
    const meta = kegiatanData?.meta || {};

    const { deleteKegiatan } = useKegiatanMutations();

    const getStatusInfo = (status) => {
        switch(status?.toLowerCase()) {
            case 'selesai': return { text: 'Selesai', color: 'bg-[#ECFDF5] text-[#10B981]', dot: 'bg-[#10B981]' };
            case 'published': return { text: 'Published', color: 'bg-[#ECFDF5] text-[#10B981]', dot: 'bg-[#10B981]' };
            case 'draft': return { text: 'Draft', color: 'bg-amber-50 text-amber-500', dot: 'bg-amber-500' };
            default: return { text: status || '-', color: 'bg-slate-50 text-slate-400', dot: 'bg-slate-400' };
        }
    };

    const confirmDelete = () => {
        if (!selectedActivity) return;
        
        deleteKegiatan.mutate(selectedActivity.id_kegiatan, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                Swal.fire({ title: 'Berhasil!', text: 'Laporan kegiatan telah dihapus.', icon: 'success', confirmButtonColor: '#0080C5', customClass: { popup: 'rounded-3xl font-["Poppins"]' } });
            },
            onError: () => {
                setIsDeleteModalOpen(false);
                Swal.fire({ title: 'Gagal!', text: 'Gagal menghapus laporan kegiatan.', icon: 'error', confirmButtonColor: '#EF4444', customClass: { popup: 'rounded-3xl font-["Poppins"]' } });
            }
        });
    };

    return (
        <AdminLayout title="Kelola Kegiatan">
            {/* ================= DESKTOP VIEW ================= */}
            <div className="hidden lg:flex font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left flex-col">
                <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    {/* Header Desktop */}
                    <div className="px-8 py-6 flex justify-between items-center bg-white">
                        <div className="flex flex-col">
                            <h2 className="text-base font-bold text-[#0A0F1E] tracking-tight">Daftar Laporan Kegiatan</h2>
                            <p className="text-xs text-[#9298B0]">
                                {meta.total ? `${meta.total} dari ${meta.total} kegiatan ditampilkan` : 'Menampilkan kegiatan dampingan'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search size={18} className="absolute left-[15px] top-1/2 -translate-y-1/2 text-[#9298B0] w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari kegiatan..."
                                    className="w-[220px] h-[40px] pl-11 pr-4 bg-[#FAFBFD] border-2 border-[#E5E7EB] rounded-[10px] focus:border-[#0080C5] focus:outline-none text-[13px] text-[#9298B0] transition-all"
                                    value={searchTerm}
                                    onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}
                                />
                            </div>
                            
                            {isFasilitator && (
                                <button
                                    onClick={() => navigate('/kelola-kegiatan/tambah')}
                                    className="h-[40px] px-4 bg-[#0080C5] text-white rounded-[10px] flex items-center justify-center gap-2 text-[13px] font-semibold hover:bg-sky-700 transition-all whitespace-nowrap"
                                >
                                    <Plus size={18} strokeWidth={3} />
                                    Tambah Kegiatan
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table / List */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20 bg-white">
                            <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white">
                            <p className="text-red-500 mb-4">Gagal memuat data kegiatan.</p>
                            <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white">
                            <p className="text-slate-500">Tidak ada data kegiatan.</p>
                        </div>
                    ) : (
                        <>
                            {/* DESKTOP TABLE VIEW */}
                            <div className="overflow-x-auto bg-white border-t border-slate-100">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 h-[58px] border-b border-slate-100">
                                            <th className="px-6 text-left w-[22%]"><span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">JUDUL KEGIATAN</span></th>
                                            <th className="px-6 text-left w-[23%]"><span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">DESKRIPSI</span></th>
                                            <th className="px-6 text-left w-[20%]"><span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">WAKTU & LOKASI</span></th>
                                            <th className="px-6 text-center w-[10%]"><span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">STATUS</span></th>
                                            <th className="px-6 text-center w-[13%]"><span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">GRUP</span></th>
                                            <th className="px-6 text-center w-[12%]"><span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">AKSI</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {reports.map((item, i) => {
                                            const statusInfo = getStatusInfo(item.status);
                                            return (
                                            <tr key={item.id_kegiatan || i} className="bg-white hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4 align-top">
                                                    <div className="flex flex-col gap-1.5">
                                                        <span onClick={() => { setSelectedActivity(item); setIsDetailModalOpen(true); }} className="text-[13px] font-bold text-slate-900 leading-snug cursor-pointer hover:text-[#0080C5] transition-colors line-clamp-2">{item.judul}</span>
                                                        <span className="text-[11px] font-semibold text-[#0080C5]">{item.kategori || 'Kegiatan'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-top">
                                                    <p className="text-slate-500 text-[12px] leading-relaxed line-clamp-3">{item.deskripsi}</p>
                                                </td>
                                                <td className="px-6 py-4 align-top">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={14} className="text-[#0080C5]" />
                                                            <span className="text-[12px] font-semibold text-slate-900">{item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={14} className="text-slate-400" />
                                                            <span className="text-[11px] font-medium text-slate-500">{item.waktu || '-'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin size={14} className="text-slate-400" />
                                                            <span className="text-[11px] font-medium text-slate-500 truncate max-w-[150px]">{item.lokasi || '-'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-top text-center">
                                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusInfo.color}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                                                        {statusInfo.text}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-top text-center">
                                                    <div className="inline-flex flex-wrap justify-center gap-1">
                                                        {item.kegiatan_grups?.length > 0 ? item.kegiatan_grups.map(g => (
                                                            <span key={g.id_kegiatan_grup || g.grup_dampingan_id} className="px-2.5 py-1 bg-[#16A34A]/10 text-[#16A34A] rounded-full text-[10px] font-bold whitespace-nowrap">
                                                                {g.grup_dampingan?.name || 'Grup'}
                                                            </span>
                                                        )) : (
                                                            <span className="text-slate-400 text-xs">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-top">
                                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => navigate(`/kelola-kegiatan/edit/${item.id_kegiatan}`)} className="p-2 bg-[#FB923C]/10 text-[#FB923C] rounded-lg hover:bg-[#FB923C] hover:text-white transition-all"><Edit size={14} strokeWidth={2.5} /></button>
                                                        <button onClick={() => { setSelectedActivity(item); setIsDeleteModalOpen(true); }} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} strokeWidth={2.5} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {meta && meta.total > 0 && (
                                <div className="px-8 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-slate-400 text-xs text-center w-auto">
                                        Menampilkan <span className="font-bold text-slate-900">{meta.to - meta.from + 1}</span> dari <span className="font-bold text-slate-900">{meta.total}</span> Laporan Kegiatan
                                    </span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setPage(old => Math.max(old - 1, 1))}
                                            disabled={page === 1}
                                            className="p-2 border border-slate-200 rounded-lg text-slate-500 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button 
                                            onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                            disabled={page === meta.last_page}
                                            className="p-2 border border-slate-200 rounded-lg text-slate-500 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ================= MOBILE VIEW ================= */}
            <div className="lg:hidden font-['Poppins'] pb-24 flex flex-col bg-[#F0F2F8] min-h-screen">
                <div className="w-full bg-white rounded-[16px] border-[0.8px] border-[#F0F2F8] flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden">
                    {/* Header Mobile */}
                    <div className="flex flex-col gap-3 p-4 border-b-[0.8px] border-[#F0F2F8]">
                        <div className="flex flex-col">
                            <h2 className="text-[#0A0F1E] text-[14px] font-bold">Daftar Laporan Kegiatan</h2>
                            <p className="text-[10px] text-[#9298B0]">
                                {meta.total ? `${meta.total} dari ${meta.total} kegiatan ditampilkan` : 'Menampilkan kegiatan dampingan'}
                            </p>
                        </div>
                        
                        <div className="flex flex-row items-center gap-2 w-full mt-1">
                            <div className="relative flex-1">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9298B0]/50" />
                                <input
                                    type="text"
                                    placeholder="Cari kegiatan..."
                                    className="w-full h-[40px] pl-9 pr-3 border border-[#E5E7EB] rounded-[14px] text-[12px] font-normal text-[#0A0F1E] focus:outline-none focus:border-[#0080C5] bg-white placeholder-[#9298B0]/50"
                                    value={searchTerm}
                                    onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}
                                />
                            </div>
                            
                            {isFasilitator && (
                                <button
                                    onClick={() => navigate('/kelola-kegiatan/tambah')}
                                    className="w-[40px] h-[40px] shrink-0 bg-[#0080C5] text-white rounded-[14px] flex items-center justify-center hover:bg-sky-700 transition-all active:scale-95"
                                >
                                    <Plus size={20} strokeWidth={2.5} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile List View */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="animate-spin text-[#0080C5]" size={30} />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <p className="text-red-500 mb-4 text-[12px]">Gagal memuat data kegiatan.</p>
                            <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg text-[12px]">Coba Lagi</button>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <p className="text-slate-500 text-[12px]">Tidak ada data kegiatan.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {reports.map((item, i) => {
                                const statusInfo = getStatusInfo(item.status);
                                
                                return (
                                    <div key={item.id_kegiatan || i} className="p-4 border-b-[1.2px] border-[#F0F2F8] last:border-b-0 flex flex-col gap-3 relative">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1">
                                                <h3 
                                                    onClick={() => { setSelectedActivity(item); setIsDetailModalOpen(true); }}
                                                    className="text-[13px] font-bold text-[#0A0F1E] mb-0.5 leading-snug cursor-pointer hover:text-[#0080C5] transition-colors line-clamp-2"
                                                >
                                                    {item.judul}
                                                </h3>
                                                <span className="text-[10px] font-medium text-[#9298B0]">{item.kategori || 'Kegiatan Umum'}</span>
                                            </div>
                                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${statusInfo.color}`}>
                                                <div className={`w-1 h-1 rounded-full ${statusInfo.dot}`} />
                                                {statusInfo.text}
                                            </div>
                                        </div>
                                        
                                        <p className="text-[11px] text-[#0A0F1E] line-clamp-2 leading-[16px] -mt-1">
                                            {item.deskripsi}
                                        </p>
                                        
                                        <div className="flex items-center gap-4 text-[10px] font-semibold text-[#0A0F1E]">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={12} strokeWidth={2.5} className="text-[#0080C5]" />
                                                {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={12} strokeWidth={2.5} className="text-[#9298B0]" />
                                                {item.waktu || '-'}
                                            </div>
                                        </div>

                                        <div className="flex flex-row gap-2 mt-1">
                                            <button 
                                                onClick={() => navigate(`/kelola-kegiatan/edit/${item.id_kegiatan}`)} 
                                                className="flex-1 h-[32px] flex items-center justify-center gap-1.5 bg-[#F0F2F8] text-[#0A0F1E] rounded-[10px] hover:bg-slate-200 transition-all text-[11px] font-semibold active:scale-95 border border-[#E5E7EB]/50"
                                            >
                                                <Edit size={12} strokeWidth={2.5} /> Edit
                                            </button>
                                            <button 
                                                onClick={() => { setSelectedActivity(item); setIsDeleteModalOpen(true); }} 
                                                className="flex-1 h-[32px] flex items-center justify-center gap-1.5 bg-[#FEE2E2] text-[#EF4444] rounded-[10px] hover:bg-red-200 transition-all text-[11px] font-semibold active:scale-95 border border-[#EF4444]/20"
                                            >
                                                <Trash2 size={12} strokeWidth={2.5} /> Hapus
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer Mobile */}
                    {meta && meta.total > 0 && (
                        <div className="p-3 border-t-[0.8px] border-[#F0F2F8] flex items-center justify-between bg-slate-50/50">
                            <span className="text-[#9298B0] text-[10px] font-medium ml-2">
                                Hal {meta.current_page} dr {meta.last_page}
                            </span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                                    disabled={page === 1}
                                    className="p-1.5 border border-[#E5E7EB] bg-white rounded-lg text-[#9298B0] disabled:opacity-50 active:scale-95"
                                >
                                    <ChevronLeft size={14} />
                                </button>
                                <button 
                                    onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                    disabled={page === meta.last_page}
                                    className="p-1.5 border border-[#E5E7EB] bg-white rounded-lg text-[#9298B0] disabled:opacity-50 active:scale-95"
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <DetailKegiatanModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} data={selectedActivity} />
            <DeleteKegiatanModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} data={selectedActivity} />
        </AdminLayout>
    );
};

export default KelolaKegiatanPage;
