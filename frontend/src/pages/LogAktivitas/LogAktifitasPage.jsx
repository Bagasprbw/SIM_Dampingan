import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Clock, ChevronDown, Calendar, CheckSquare, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useLogs } from '../../hooks/queries/useLogQuery';

const AKSI_OPTIONS = [
    { value: '', label: 'Semua Aksi' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'CREATE', label: 'Create' },
    { value: 'UPDATE', label: 'Update' },
    { value: 'DELETE', label: 'Delete' },
    { value: 'VERIFIKASI', label: 'Verifikasi' },
];

const LogAktifitasPage = () => {
    const [aksiFilter, setAksiFilter] = useState('');
    const [tanggalMulai, setTanggalMulai] = useState('');
    const [tanggalAkhir, setTanggalAkhir] = useState('');
    const [showAksiDropdown, setShowAksiDropdown] = useState(false);
    const [page, setPage] = useState(1);

    const { data: logData, isLoading, isError, refetch } = useLogs({
        page,
        ...(aksiFilter && { aksi: aksiFilter }),
        ...(tanggalMulai && { tanggal_mulai: tanggalMulai }),
        ...(tanggalAkhir && { tanggal_akhir: tanggalAkhir }),
    });

    const pagination = logData?.data || {};
    const logs = pagination?.data || [];
    const meta = {
        total: pagination?.total || 0,
        from: pagination?.from || 0,
        to: pagination?.to || 0,
        current_page: pagination?.current_page || 1,
        last_page: pagination?.last_page || 1,
    };

    const formatTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getAksiStyles = (aksi) => {
        switch (aksi?.toUpperCase()) {
            case 'LOGIN':      return { bg: 'bg-[#DBEAFE]', text: 'text-[#0080C5]', dot: 'bg-[#0080C5]' };
            case 'LOGOUT':     return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
            case 'CREATE':     return { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]', dot: 'bg-[#16A34A]' };
            case 'UPDATE':     return { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', dot: 'bg-[#F97316]' };
            case 'DELETE':     return { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', dot: 'bg-[#DC2626]' };
            case 'VERIFIKASI': return { bg: 'bg-[#EDE9FE]', text: 'text-[#7C3AED]', dot: 'bg-[#7C3AED]' };
            default:           return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
        }
    };

    const selectedAksiLabel = AKSI_OPTIONS.find(o => o.value === aksiFilter)?.label || 'Semua Aksi';

    return (
        <AdminLayout title="Log Aktifitas">
            <div className="font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left flex flex-col">

                <div className="bg-transparent lg:bg-white lg:rounded-[20px] lg:shadow-sm lg:border lg:border-[#E5E7EB] lg:overflow-hidden flex flex-col">

                    {/* Header Desktop */}
                    <div className="hidden lg:flex px-8 py-5 border-b border-slate-100 flex-row justify-between items-center gap-3">
                        <div className="flex items-center gap-4 w-auto pb-0">
                            <div className="w-10 h-10 bg-[#0080C5]/10 rounded-full flex items-center justify-center text-[#0080C5] shrink-0">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-950 tracking-tight">Log Aktifitas</h3>
                                <p className="text-xs text-slate-400">Riwayat seluruh aktifitas pengguna sistem</p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-3 w-auto">
                            {/* Filter tanggal mulai */}
                            <div className="h-10 px-3 w-auto bg-white border border-slate-200 rounded-xl flex items-center gap-2">
                                <Calendar size={14} className="text-slate-400 shrink-0" />
                                <input
                                    type="date"
                                    value={tanggalMulai}
                                    onChange={e => { setTanggalMulai(e.target.value); setPage(1); }}
                                    className="text-[11px] font-medium text-slate-700 outline-none bg-transparent w-full"
                                />
                            </div>
                            {/* Filter tanggal akhir */}
                            <div className="h-10 px-3 w-auto bg-white border border-slate-200 rounded-xl flex items-center gap-2">
                                <Calendar size={14} className="text-slate-400 shrink-0" />
                                <input
                                    type="date"
                                    value={tanggalAkhir}
                                    onChange={e => { setTanggalAkhir(e.target.value); setPage(1); }}
                                    className="text-[11px] font-medium text-slate-700 outline-none bg-transparent w-full"
                                />
                            </div>
                            {/* Filter aksi */}
                            <div className="relative w-auto">
                                <button
                                    onClick={() => setShowAksiDropdown(v => !v)}
                                    className="h-10 px-4 w-auto min-w-[140px] bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:bg-slate-50 transition-all"
                                >
                                    <span className="text-[11px] font-semibold text-slate-700">{selectedAksiLabel}</span>
                                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${showAksiDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showAksiDropdown && (
                                    <div className="absolute top-full right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg z-50 min-w-[160px] w-full">
                                        {AKSI_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setAksiFilter(opt.value); setShowAksiDropdown(false); setPage(1); }}
                                                className={`block w-full text-left px-4 py-2.5 text-[11px] font-medium hover:bg-sky-50 transition-colors ${aksiFilter === opt.value ? 'text-[#0080C5] font-semibold bg-sky-50/50' : 'text-[#0A0F1E]'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Header Mobile - Figma styles */}
                    <div className="flex lg:hidden flex-col gap-3 mb-4 mt-4">
                        {/* Header Box */}
                        <div className="bg-white border-[0.8px] border-[#F0F2F8] rounded-[16px] px-[16.8px] pt-[16.8px] pb-4 flex flex-row items-center gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                            <div className="w-[32px] h-[32px] bg-[#0080C5]/10 rounded-[14px] flex items-center justify-center shrink-0">
                                <Clock size={16} strokeWidth={2.5} className="text-[#0080C5]" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-[14px] font-bold text-[#0A0F1E] leading-[21px]">Log Aktifitas</h3>
                                <p className="text-[10px] text-[#9298B0] leading-[15px]">Riwayat seluruh aktifitas pengguna sistem</p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-2 w-full">
                            {/* Filter tanggal */}
                            <div className="flex-1 h-[34.1px] px-3 bg-white border-[0.8px] border-[#E5E7EB] rounded-[14px] flex items-center gap-2">
                                <Calendar size={13} strokeWidth={2} className="text-[#9298B0] shrink-0" />
                                <input
                                    type="date"
                                    value={tanggalMulai}
                                    onChange={e => { setTanggalMulai(e.target.value); setPage(1); }}
                                    className="text-[11px] font-semibold text-[#0A0F1E] outline-none bg-transparent w-full"
                                />
                            </div>
                            {/* Filter aksi */}
                            <div className="relative w-auto shrink-0">
                                <button
                                    onClick={() => setShowAksiDropdown(v => !v)}
                                    className="h-[34.1px] px-3 w-[110px] bg-white border-[0.8px] border-[#E5E7EB] rounded-[14px] flex items-center justify-between gap-1 hover:bg-slate-50 transition-all"
                                >
                                    <span className="text-[11px] font-semibold text-[#0A0F1E] text-center w-full">{selectedAksiLabel}</span>
                                    <ChevronDown size={13} strokeWidth={2} className={`text-[#9298B0] transition-transform ${showAksiDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showAksiDropdown && (
                                    <div className="absolute top-full right-0 mt-1 bg-white rounded-[14px] border border-slate-200 shadow-lg z-50 w-full min-w-[120px]">
                                        {AKSI_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setAksiFilter(opt.value); setShowAksiDropdown(false); setPage(1); }}
                                                className={`block w-full text-left px-3 py-2 text-[11px] font-medium hover:bg-sky-50 transition-colors first:rounded-t-[14px] last:rounded-b-[14px] ${aksiFilter === opt.value ? 'text-[#0080C5] font-semibold bg-sky-50/50' : 'text-[#0A0F1E]'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-[#0080C5]" size={40} />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white lg:rounded-2xl mx-0">
                            <p className="text-red-500 mb-4 text-center">Gagal memuat log aktivitas.</p>
                            <button onClick={() => refetch()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg text-sm font-semibold">Coba Lagi</button>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white lg:rounded-2xl mx-0">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Clock size={24} className="text-slate-300" />
                            </div>
                            <p className="text-slate-500 text-[13px] font-medium">Tidak ada log aktivitas.</p>
                        </div>
                    ) : (
                        <>
                            {/* MOBILE TABLE VIEW (Figma exact match) */}
                            <div className="lg:hidden mt-2 mb-4 w-full">
                                <div className="bg-white border-[0.8px] border-[#F0F2F8] rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] w-full">
                                    <div className="flex flex-row items-center px-3 py-2.5 bg-[#F8FAFC] border-b-[0.8px] border-[#F0F2F8] gap-1 rounded-t-[16px]">
                                        <div className="w-[52px] shrink-0 text-[9px] font-semibold text-[#9298B0]">ROLE</div>
                                        <div className="w-[72px] shrink-0 text-[9px] font-semibold text-[#9298B0]">NAMA</div>
                                        <div className="flex-1 text-[9px] font-semibold text-[#9298B0]">AKTIFITAS</div>
                                        <div className="w-[32px] shrink-0 text-right text-[9px] font-semibold text-[#9298B0]">WAKTU</div>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        {logs.map((log, index) => {
                                            const aksi = log.aksi || 'Unknown';
                                            const style = getAksiStyles(aksi);
                                            const initial = log.user?.name ? log.user.name.substring(0, 2).toUpperCase() : '??';
                                            const roleName = log.user?.role?.name?.replace(/_/g, ' ') || '';
                                            
                                            // Format time to strictly HH:MM (avoiding the "Mei" bug)
                                            let timeAgo = '00:00';
                                            if (log.created_at) {
                                                const d = new Date(log.created_at);
                                                timeAgo = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
                                            }
                                            
                                            return (
                                                <div key={log.id_log || index} className="flex flex-row items-start px-3 py-3 border-b-[0.8px] border-[#F0F2F8] gap-1 last:border-b-0 bg-white last:rounded-b-[16px]">
                                                    {/* Role */}
                                                    <div className="w-[52px] shrink-0 pt-1">
                                                        <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 ${style.bg} ${style.text} rounded-full w-fit max-w-[50px]`}>
                                                            <div className={`w-1 h-1 rounded-full ${style.dot} shrink-0`} />
                                                            <span className="text-[8px] font-semibold capitalize truncate">{roleName.substring(0, 6)}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Nama */}
                                                    <div className="w-[72px] shrink-0 flex flex-row items-start gap-1.5">
                                                        <div className={`w-[20px] h-[20px] ${style.bg} text-[#0A0F1E] rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 mt-0.5`}>
                                                            {initial}
                                                        </div>
                                                        <span className="text-[9px] font-semibold text-[#0A0F1E] leading-[12px] break-words line-clamp-2 mt-1">{log.user?.name || '-'}</span>
                                                    </div>
                                                    
                                                    {/* Aktifitas */}
                                                    <div className="flex-1 flex flex-row items-start gap-1.5">
                                                        <CheckSquare size={10} strokeWidth={2} className="text-[#22C55E] shrink-0 mt-1" />
                                                        <span className="text-[9px] text-[#0A0F1E] leading-[14px] line-clamp-3">{log.deskripsi || '-'}</span>
                                                    </div>
                                                    
                                                    {/* Waktu */}
                                                    <div className="w-[32px] shrink-0 text-right">
                                                        <span className="text-[8px] font-medium text-[#9298B0] mt-1 block">{timeAgo}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* DESKTOP TABLE VIEW */}
                            <div className="hidden lg:block overflow-x-auto bg-white border-t border-slate-100">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-[#FAFBFD] border-b border-slate-100">
                                            <th className="py-4 px-6 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest">AKSI</th>
                                            <th className="py-4 px-6 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest">MODUL</th>
                                            <th className="py-4 px-6 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest">NAMA</th>
                                            <th className="py-4 px-6 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest">DESKRIPSI</th>
                                            <th className="py-4 px-6 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest">WAKTU</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {logs.map((log, index) => {
                                            const aksi = log.aksi || 'Unknown';
                                            const style = getAksiStyles(aksi);
                                            const initial = log.user?.name ? log.user.name.substring(0, 2).toUpperCase() : '??';
                                            return (
                                                <tr key={log.id_log || index} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-3.5 px-6">
                                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${style.bg} ${style.text} rounded-full`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                                            <span className="text-[10px] font-bold tracking-wide">{aksi}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-6 text-[11px] font-semibold text-slate-600">{log.modul || '-'}</td>
                                                    <td className="py-3.5 px-6">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className={`w-8 h-8 ${style.bg} ${style.text} rounded-full flex items-center justify-center text-[10px] font-bold shrink-0`}>{initial}</div>
                                                            <div>
                                                                <div className="text-[11px] font-semibold text-slate-950">{log.user?.name || '-'}</div>
                                                                <div className="text-[10px] text-slate-400 capitalize">{log.user?.role?.name?.replace(/_/g, ' ') || ''}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-6">
                                                        <div className="flex items-start gap-2">
                                                            <CheckSquare size={14} className="text-[#00BC7D] shrink-0 mt-0.5" />
                                                            <span className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{log.deskripsi || '-'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-6 text-[11px] text-slate-400 font-medium whitespace-nowrap">{formatTime(log.created_at)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* Pagination */}
                    {meta.total > 0 && (
                        <div className="lg:hidden mt-2 pb-6">
                            <div className="flex flex-row items-center justify-between bg-white border-[0.8px] border-[#E5E7EB] rounded-[16px] px-4 py-3 shadow-sm w-full">
                                <p className="text-[10px] text-[#9298B0]">
                                    Menampilkan {meta.from}–{meta.to} dari {meta.total} aktifitas
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <button 
                                        onClick={() => setPage(p => Math.max(p - 1, 1))} 
                                        disabled={page === 1} 
                                        className="w-7 h-7 flex items-center justify-center border-[0.8px] border-[#E5E7EB] rounded-[10px] text-[#0A0F1E] disabled:opacity-40"
                                    >
                                        <ChevronLeft size={14} strokeWidth={2.5} />
                                    </button>
                                    <span className="w-7 h-7 bg-[#0080C5] text-white rounded-[10px] flex items-center justify-center text-[12px] font-bold">{page}</span>
                                    <button 
                                        onClick={() => setPage(p => p < meta.last_page ? p + 1 : p)} 
                                        disabled={page === meta.last_page} 
                                        className="w-7 h-7 flex items-center justify-center border-[0.8px] border-[#E5E7EB] rounded-[10px] text-[#0A0F1E] disabled:opacity-40"
                                    >
                                        <ChevronRight size={14} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Desktop Pagination */}
                    {meta.total > 0 && (
                        <div className="hidden lg:flex px-8 py-4 border-t border-slate-100 flex-row justify-between items-center bg-white">
                            <p className="text-xs text-slate-400">
                                Menampilkan <span className="font-bold text-slate-950">{meta.from}–{meta.to}</span> dari <span className="font-bold text-slate-950">{meta.total}</span> aktivitas
                            </p>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50">
                                    <ChevronLeft size={14} />
                                </button>
                                <span className="h-7 px-3 bg-[#0080C5] text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-sm">{page}</span>
                                <button onClick={() => setPage(p => p < meta.last_page ? p + 1 : p)} disabled={page === meta.last_page} className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50">
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default LogAktifitasPage;