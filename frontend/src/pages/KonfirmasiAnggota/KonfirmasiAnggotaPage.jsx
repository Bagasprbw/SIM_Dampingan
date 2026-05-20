import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Search, ChevronDown, Check, X, Users, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { usePengajuanAnggotas } from '../../hooks/queries/usePengajuanAnggotaQuery';
import { usePengajuanAnggotaMutations } from '../../hooks/mutations/usePengajuanAnggotaMutation';
import { useGrupDampingans } from '../../hooks/queries/useGrupDampinganQuery';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const KonfirmasiAnggotaPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrup, setSelectedGrup] = useState('');
    const [page, setPage] = useState(1);
    const { data: user } = useCurrentUser();
    const { data: grupsData } = useGrupDampingans();
    const { data: ajuanData, isLoading, isError, refetch } = usePengajuanAnggotas({
        page: page,
        search: searchTerm,
        grup_id: selectedGrup
    });
    const { terimaPengajuanAnggota, tolakPengajuanAnggota } = usePengajuanAnggotaMutations();

    const grups = grupsData?.data || [];

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const dataAjuan = Array.isArray(ajuanData?.data) 
        ? ajuanData.data 
        : (ajuanData?.data?.data || ajuanData?.data || []);
    const meta = ajuanData?.meta || ajuanData?.data || {};

    const handleApprove = (id, nama) => {
        Swal.fire({
            title: 'Konfirmasi Persetujuan',
            text: `Anda akan menyetujui ajuan dari ${nama}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10B981',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Ya, Setujui!',
            cancelButtonText: 'Batal',
            customClass: { popup: 'rounded-2xl font-["Poppins"]' }
        }).then((result) => {
            if (result.isConfirmed) {
                terimaPengajuanAnggota.mutate(id, {
                    onSuccess: () => {
                        Swal.fire({ title: 'Disetujui!', text: `Ajuan ${nama} telah disetujui.`, icon: 'success', confirmButtonColor: '#10B981', timer: 1800, showConfirmButton: false, customClass: { popup: 'rounded-2xl font-["Poppins"]' } });
                    },
                    onError: () => {
                        Swal.fire({ title: 'Gagal!', text: `Terjadi kesalahan.`, icon: 'error', confirmButtonColor: '#EF4444', timer: 1800, showConfirmButton: false, customClass: { popup: 'rounded-2xl font-["Poppins"]' } });
                    }
                });
            }
        });
    };

    const handleReject = (id, nama) => {
        Swal.fire({
            title: 'Tolak Ajuan?',
            text: `Anda akan menolak ajuan dari ${nama}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Ya, Tolak!',
            cancelButtonText: 'Batal',
            customClass: { popup: 'rounded-2xl font-["Poppins"]' }
        }).then((result) => {
            if (result.isConfirmed) {
                tolakPengajuanAnggota.mutate(id, {
                    onSuccess: () => {
                        Swal.fire({ title: 'Ditolak!', text: `Ajuan ${nama} telah ditolak.`, icon: 'error', confirmButtonColor: '#EF4444', timer: 1800, showConfirmButton: false, customClass: { popup: 'rounded-2xl font-["Poppins"]' } });
                    },
                    onError: () => {
                        Swal.fire({ title: 'Gagal!', text: `Terjadi kesalahan.`, icon: 'error', confirmButtonColor: '#EF4444', timer: 1800, showConfirmButton: false, customClass: { popup: 'rounded-2xl font-["Poppins"]' } });
                    }
                });
            }
        });
    };

    return (
        <AdminLayout title="Konfirmasi Anggota">
            <div className="font-['Poppins']">
                <div className="bg-transparent lg:bg-white rounded-none lg:rounded-[20px] lg:p-6 shadow-none lg:shadow-sm border-0 lg:border lg:border-slate-200">

                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-6 gap-4 lg:gap-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 lg:w-9 lg:h-9 bg-blue-50 text-[#0080C5] rounded-xl flex items-center justify-center">
                                <Users size={18} className="lg:w-[18px] lg:h-[18px]" />
                            </div>
                            <h2 className="text-[#0A0F1E] text-[15px] lg:text-base font-bold tracking-tight">Daftar Ajuan Anggota</h2>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2 lg:gap-3">
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-4 lg:left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Cari Nama Masyarakat..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full lg:w-52 pl-11 lg:pl-9 pr-4 py-2.5 lg:py-2 border border-slate-200 rounded-xl text-[13px] lg:text-xs font-medium focus:outline-none focus:border-[#0080C5] transition-all bg-white"
                                />
                            </div>
                            <div className="relative group w-full sm:w-auto">
                                <select 
                                    value={selectedGrup}
                                    onChange={(e) => {
                                        setSelectedGrup(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full lg:w-48 pl-4 pr-10 py-2.5 lg:py-2 border border-slate-200 rounded-xl text-[13px] lg:text-xs font-medium focus:outline-none focus:border-[#0080C5] transition-all bg-white appearance-none cursor-pointer"
                                >
                                    <option value="">Semua Grup</option>
                                    {grups.map(g => (
                                        <option key={g.id_grup_dampingan} value={g.id_grup_dampingan}>{g.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-4 lg:right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5] lg:w-[14px] lg:h-[14px]" />
                            </div>
                        </div>
                    </div>

                    {/* Table / List View */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl">
                            <p className="text-red-500 mb-4">Gagal memuat data ajuan.</p>
                            <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                        </div>
                    ) : dataAjuan.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl">
                            <p className="text-slate-500">Tidak ada data ajuan ditemukan.</p>
                        </div>
                    ) : (
                        <>
                            {/* MOBILE LIST VIEW */}
                            <div className="flex flex-col gap-3 lg:hidden">
                                {dataAjuan.map((item, index) => (
                                    <div key={item.id_anggota_grup || index} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
                                        <div className="flex items-start justify-between gap-2 border-b border-slate-50 pb-3">
                                            <div className="flex flex-col">
                                                <h3 className="text-[#0A0F1E] text-[14px] font-bold leading-tight mb-0.5">{item.name}</h3>
                                                <span className="text-[#9298B0] text-[11px] font-medium">{item.no_anggota || 'Belum ada No.Anggota'}</span>
                                            </div>
                                            <div className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 ${item.jenis_kelamin === 'L' ? 'bg-sky-50 text-[#0080C5]' : 'bg-pink-50 text-[#D52BCA]'}`}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                <span className="text-[10px] font-bold">{item.jenis_kelamin === 'L' ? 'L' : 'P'}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px]">
                                            <div>
                                                <span className="text-slate-400 block mb-0.5">Bidang</span>
                                                <span className="text-slate-800 font-semibold">{item.grup_dampingan?.bidang?.name || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block mb-0.5">Grup Dampingan</span>
                                                <span className="text-[#0080C5] font-semibold">{item.grup_dampingan?.name || '-'}</span>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-slate-400 block mb-0.5">Tanggal Ajuan</span>
                                                <span className="text-slate-800 font-medium">{item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-50">
                                            <button
                                                onClick={() => handleReject(item.id_anggota_grup, item.name)}
                                                className="flex-1 h-9 bg-[#EF4444]/10 text-[#EF4444] rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#EF4444] hover:text-white transition-all text-[12px] font-bold"
                                            >
                                                <X size={14} strokeWidth={3} /> Tolak
                                            </button>
                                            <button
                                                onClick={() => handleApprove(item.id_anggota_grup, item.name)}
                                                className="flex-1 h-9 bg-[#10B981]/10 text-[#10B981] rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#10B981] hover:text-white transition-all text-[12px] font-bold"
                                            >
                                                <Check size={14} strokeWidth={3} /> Setujui
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* DESKTOP TABLE VIEW */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">NO.ANGGOTA</th>
                                            <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">NAMA</th>
                                            <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">JENIS KELAMIN</th>
                                            <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">BIDANG</th>
                                            <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">GRUP DAMPINGAN</th>
                                            <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">TGL AJUAN</th>
                                            <th className="py-3 px-4 text-center text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">AKSI</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {dataAjuan.map((item, index) => (
                                            <tr key={item.id_anggota_grup || index} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-4 px-4 text-[#0A0F1E] text-xs font-semibold">{item.no_anggota || '-'}</td>
                                                <td className="py-4 px-4 text-[#0A0F1E] text-xs font-bold">{item.name}</td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${item.jenis_kelamin === 'L' ? 'bg-[#0080C5]' : 'bg-[#D52BCA]'}`} />
                                                        <span className="text-[#0A0F1E] text-xs font-semibold">{item.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-[#0A0F1E] text-xs font-bold">{item.grup_dampingan?.bidang?.name || '-'}</td>
                                                <td className="py-4 px-4 text-[#9298B0] text-xs font-medium">{item.grup_dampingan?.name || '-'}</td>
                                                <td className="py-4 px-4 text-[#9298B0] text-xs font-medium">{item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}</td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleApprove(item.id_anggota_grup, item.name)}
                                                            className="w-7 h-7 bg-[#10B981]/10 text-[#10B981] rounded-lg flex items-center justify-center hover:bg-[#10B981] hover:text-white transition-all"
                                                        >
                                                            <Check size={13} strokeWidth={3} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(item.id_anggota_grup, item.name)}
                                                            className="w-7 h-7 bg-[#EF4444]/10 text-[#EF4444] rounded-lg flex items-center justify-center hover:bg-[#EF4444] hover:text-white transition-all"
                                                        >
                                                            <X size={13} strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* Footer */}
                    {meta && meta.total > 0 && (
                        <div className="mt-4 lg:mt-5 pt-0 lg:pt-4 border-t-0 lg:border-t lg:border-slate-100 flex items-center justify-center lg:justify-between">
                            <p className="text-slate-400 text-[11px] lg:text-xs font-normal text-center">
                                Menampilkan <span className="font-bold text-slate-950">{meta.to - meta.from + 1}</span> dari <span className="font-bold text-slate-950">{meta.total}</span> Ajuan
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default KonfirmasiAnggotaPage;
