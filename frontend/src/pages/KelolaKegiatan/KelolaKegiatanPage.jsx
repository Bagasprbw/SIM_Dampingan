import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import DetailKegiatanModal from '../../components/modals/DetailKegiatanModal';
import DeleteKegiatanModal from '../../components/modals/DeleteKegiatanModal';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/storage';
import { ROLES } from '../../constants/roles';
import { Search, Edit, Trash2, Clock, Plus, Loader2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
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
            case 'draft': return { text: 'Draft', color: 'bg-amber-50 text-amber-500', dot: 'bg-amber-500' };
            default: return { text: status || 'Selesai', color: 'bg-[#ECFDF5] text-[#10B981]', dot: 'bg-[#10B981]' };
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
            <div className="font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left flex flex-col">
                <div className="bg-transparent lg:bg-transparent rounded-none lg:rounded-none border-0 lg:w-[1098px] lg:mx-auto lg:mt-[35px] flex flex-col">

                    {/* Header Desktop & Mobile merged but styled per breakpoint */}
                    <div className="px-6 lg:px-[28px] py-6 lg:py-[22px] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0 bg-white lg:bg-white rounded-2xl lg:rounded-t-[22px] lg:rounded-b-none mb-4 lg:mb-0 lg:h-[91.3px]">
                        <div className="flex flex-col">
                            <h2 className="text-base lg:text-[17px] font-bold text-[#0A0F1E] lg:leading-[26px]">Daftar Laporan Kegiatan</h2>
                            <p className="text-xs lg:text-[12px] text-[#9298B0] lg:leading-[18px]">
                                {meta.total ? `${meta.total} dari ${meta.total} kegiatan ditampilkan` : 'Menampilkan kegiatan dampingan'}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            {/* Search moved into header for desktop */}
                            <div className="hidden lg:flex relative">
                                <Search size={18} className="absolute left-[15px] top-1/2 -translate-y-1/2 text-[#9298B0] w-6 h-6" />
                                <input
                                    type="text"
                                    placeholder="Cari kegiatan..."
                                    className="w-full lg:w-[220px] lg:h-[40px] pl-11 pr-4 bg-[#FAFBFD] border-2 border-[#E5E7EB] rounded-[10px] focus:border-[#0080C5] focus:outline-none text-[13px] text-[#9298B0] transition-all"
                                    value={searchTerm}
                                    onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}
                                />
                            </div>
                            
                            {isFasilitator && (
                                <button
                                    onClick={() => navigate('/kelola-kegiatan/tambah')}
                                    className="w-full sm:w-auto h-11 lg:h-[39.5px] lg:w-[183.39px] px-4 bg-[#0080C5] text-white rounded-xl lg:rounded-[10px] flex items-center justify-center gap-2 text-[13px] font-semibold hover:bg-sky-700 transition-all whitespace-nowrap order-1 sm:order-2"
                                >
                                    <Plus size={20} className="lg:w-6 lg:h-6" strokeWidth={3} />
                                    Tambah Kegiatan
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search (Mobile Only) */}
                    <div className="px-4 pb-4 lg:hidden">
                        <div className="relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari kegiatan..."
                                className="w-full h-12 pl-12 pr-4 bg-white rounded-xl border border-slate-200 focus:border-[#0080C5] focus:outline-none text-[13px] text-[#9298B0] transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}
                            />
                        </div>
                    </div>

                    {/* Table / List */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20 bg-white lg:rounded-b-[22px]">
                            <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white lg:rounded-b-[22px]">
                            <p className="text-red-500 mb-4">Gagal memuat data kegiatan.</p>
                            <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white lg:rounded-b-[22px]">
                            <p className="text-slate-500">Tidak ada data kegiatan.</p>
                        </div>
                    ) : (
                        <>
                            {/* MOBILE CARD VIEW */}
                            <div className="flex flex-col gap-4 lg:hidden px-4">
                                {reports.map((item, i) => {
                                    const statusInfo = getStatusInfo(item.status);
                                    
                                    return (
                                        <div key={item.id_kegiatan || i} className="bg-white p-4 rounded-[16px] shadow-sm border-[0.8px] border-[#F0F2F8] flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 pr-2">
                                                    <h3 
                                                        onClick={() => { setSelectedActivity(item); setIsDetailModalOpen(true); }}
                                                        className="text-[13px] font-bold text-[#0A0F1E] mb-1 leading-snug cursor-pointer hover:text-[#0080C5] transition-colors"
                                                    >
                                                        {item.judul}
                                                    </h3>
                                                    <span className="text-[10px] font-semibold text-[#9298B0]">{item.kategori || 'Kegiatan Umum'}</span>
                                                </div>
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold shrink-0 ${statusInfo.color}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                                                    {statusInfo.text}
                                                </div>
                                            </div>
                                            
                                            <p className="text-[11px] text-[#0A0F1E] line-clamp-2 leading-[16px]">
                                                {item.deskripsi}
                                            </p>
                                            
                                            <div className="flex items-center gap-4 border-t-[0.8px] border-[#F0F2F8] pt-3 mt-1">
                                                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#0A0F1E]">
                                                    <Calendar size={12} strokeWidth={2.5} className="text-[#0080C5]" />
                                                    {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#0A0F1E]">
                                                    <Clock size={12} strokeWidth={2.5} className="text-[#9298B0]" />
                                                    {item.waktu || '-'}
                                                </div>
                                            </div>

                                            <div className="flex flex-row gap-2 mt-2">
                                                <button 
                                                    onClick={() => navigate(`/kelola-kegiatan/edit/${item.id_kegiatan}`)} 
                                                    className="flex-1 h-[34px] flex items-center justify-center gap-2 bg-[#F0F2F8] text-[#0A0F1E] rounded-[10px] hover:bg-slate-200 transition-all text-[11px] font-semibold"
                                                >
                                                    <Edit size={12} strokeWidth={2.5} /> Edit
                                                </button>
                                                <button 
                                                    onClick={() => { setSelectedActivity(item); setIsDeleteModalOpen(true); }} 
                                                    className="flex-1 h-[34px] flex items-center justify-center gap-2 bg-[#FEE2E2] text-[#EF4444] rounded-[10px] hover:bg-red-200 transition-all text-[11px] font-semibold"
                                                >
                                                    <Trash2 size={12} strokeWidth={2.5} /> Hapus
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* DESKTOP TABLE VIEW */}
                            <div className="hidden lg:block overflow-x-auto bg-white border-t border-[#F0F2F8]">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-[#F8FAFD] h-[58px]">
                                            <th className="px-[10px] text-center w-[283px]"><span className="text-[11px] font-semibold text-[#9298B0] tracking-[0.01em]">JUDUL KEGIATAN</span></th>
                                            <th className="px-[10px] text-center w-[230px]"><span className="text-[11px] font-semibold text-[#9298B0] tracking-[0.01em]">DESKRIPSI</span></th>
                                            <th className="px-[10px] text-center w-[200px]"><span className="text-[11px] font-semibold text-[#9298B0] tracking-[0.01em]">TANGGAL PELAKSANAAN</span></th>
                                            <th className="px-[10px] text-center w-[120px]"><span className="text-[11px] font-semibold text-[#9298B0] tracking-[0.01em]">WAKTU</span></th>
                                            <th className="px-[10px] text-center w-[180px]"><span className="text-[11px] font-semibold text-[#9298B0] tracking-[0.01em]">GRUP</span></th>
                                            <th className="px-[10px] text-center w-[85px]"><span className="text-[11px] font-semibold text-[#9298B0] tracking-[0.01em]">AKSI</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-transparent">
                                        {reports.map((item, i) => (
                                            <tr key={item.id_kegiatan || i} className="h-[97px] bg-white hover:bg-slate-50 transition-colors">
                                                <td className="p-[20px_17px_19px_16px]">
                                                    <div className="flex flex-col gap-[6px]">
                                                        <span onClick={() => { setSelectedActivity(item); setIsDetailModalOpen(true); }} className="text-[13px] font-semibold text-[#0A0F1E] leading-[20px] tracking-[0.01em] hover:text-[#0080C5] cursor-pointer transition-colors line-clamp-1">{item.judul}</span>
                                                        <span className="text-[11px] font-normal text-[#9298B0] leading-[16px] tracking-[0.01em]">{item.kategori || 'Kegiatan'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-[30px_6px_29px] text-center align-middle">
                                                    <p className="text-[#646C82] text-[12px] leading-[18px] tracking-[0.01em] line-clamp-2 w-[190px] mx-auto text-left flex items-center h-full">{item.deskripsi}</p>
                                                </td>
                                                <td className="p-[32px_25px_31px]">
                                                    <div className="flex flex-col w-[150px]">
                                                        <span className="text-[12px] font-bold text-[#0A0F1E] leading-[18px] tracking-[0.01em] flex items-center">{item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
                                                        <span className="text-[11px] font-normal text-[#9298B0] leading-[16px] tracking-[0.01em] flex items-center truncate">{item.lokasi || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-[40px_13px_39px_14px]">
                                                    <div className="flex items-center gap-[3px] w-[93px] justify-center mx-auto">
                                                        <Clock size={12} className="text-[#9298B0]" />
                                                        <span className="text-[12px] font-normal text-[#0A0F1E] leading-[18px] tracking-[0.01em] flex items-center">{item.waktu || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-[40px_18px_39px_19px]">
                                                    <span className="text-[12px] font-normal text-[#0A0F1E] leading-[18px] tracking-[0.01em] line-clamp-1 text-center w-full block">{item.kegiatan_grups?.map(g => g.grup_dampingan?.name).join(', ') || '-'}</span>
                                                </td>
                                                <td className="p-[36.5px_30.5px]">
                                                    <div className="flex items-center justify-center gap-[10px] w-full">
                                                        <button onClick={() => navigate(`/kelola-kegiatan/edit/${item.id_kegiatan}`)} className="w-6 h-6 flex items-center justify-center bg-[#FB923C]/10 text-[#FB923C] rounded-[7px] border-[2px] border-transparent hover:bg-[#FB923C] hover:text-white transition-all"><Edit size={14} /></button>
                                                        <button onClick={() => { setSelectedActivity(item); setIsDeleteModalOpen(true); }} className="w-6 h-6 flex items-center justify-center bg-[#EF4444]/10 text-[#EF4444] rounded-[7px] border-[2px] border-transparent hover:bg-[#EF4444] hover:text-white transition-all"><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {meta && meta.total > 0 && (
                                <div className="mt-4 lg:mt-0 px-4 lg:px-[36px] py-4 lg:py-[14px] bg-white rounded-2xl lg:rounded-b-[22px] lg:rounded-t-none lg:h-[46.8px] flex flex-col sm:flex-row items-center justify-center lg:justify-between gap-4">
                                    <span className="text-slate-400 text-[11px] lg:text-[12px] text-center w-full lg:w-auto lg:leading-[18px] tracking-[0.01em]">
                                        Menampilkan <span className="font-bold">{meta.to - meta.from + 1}</span> Laporan Kegiatan
                                    </span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setPage(old => Math.max(old - 1, 1))}
                                            disabled={page === 1}
                                            className="p-1.5 lg:p-1 border border-slate-200 rounded-md lg:rounded text-slate-500 disabled:opacity-50 hover:bg-slate-50"
                                        >
                                            <ChevronLeft size={16} className="lg:w-[14px] lg:h-[14px]" />
                                        </button>
                                        <button 
                                            onClick={() => setPage(old => (meta.current_page < meta.last_page ? old + 1 : old))}
                                            disabled={page === meta.last_page}
                                            className="p-1.5 lg:p-1 border border-slate-200 rounded-md lg:rounded text-slate-500 disabled:opacity-50 hover:bg-slate-50"
                                        >
                                            <ChevronRight size={16} className="lg:w-[14px] lg:h-[14px]" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <DetailKegiatanModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} data={selectedActivity} />
            <DeleteKegiatanModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} data={selectedActivity} />
        </AdminLayout>
    );
};

export default KelolaKegiatanPage;
