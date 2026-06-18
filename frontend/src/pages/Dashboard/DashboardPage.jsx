import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getUser } from '../../utils/storage';
import { ROLES, ADMIN_ROLES } from '../../constants/roles';
import { useDashboardFasilitator, useDashboardAdmin, useDashboardPjDampingan } from '../../hooks/queries/useDashboardQuery';
import { 
    ChevronDown,
    Info,
    TrendingUp,
    Clock,
    FileUser,
    UserPlus,
    Users,
    LayoutGrid,
    UsersRound,
    CheckCircle2,
    XCircle,
    Loader2
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';

const toWibDate = (dateString) => {
    if (!dateString) return null;
    const hasTimezone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(dateString);
    if (hasTimezone) {
        return new Date(dateString);
    }
    // Backend kirim tanpa timezone (anggap UTC), konversi ke WIB saat format
    return new Date(dateString.replace(' ', 'T') + 'Z');
};

const formatRelativeTime = (dateString) => {
    const date = toWibDate(dateString);
    if (!date || Number.isNaN(date.getTime())) return '-';
    const now = Date.now();
    const diffMinutes = Math.floor((now - date.getTime()) / 60000);
    if (diffMinutes < 1) return 'baru saja';
    if (diffMinutes < 60) return `${diffMinutes} m lalu`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} hari lalu`;
};

const DashboardPage = () => {
    const user = getUser();
    const isPjGrup = user?.role === ROLES.PJ_DAMPINGAN;
    const isFasilitator = user?.role === ROLES.FASILITATOR;
    const isAdminUser = [ROLES.SUPERADMIN, ...ADMIN_ROLES].includes(user?.role);

    const { data: dashboardFasilitatorRes, isLoading: isDashboardFasilitatorLoading, isError: isDashboardFasilitatorError, refetch: refetchDashboardFasilitator } = useDashboardFasilitator({
        enabled: isFasilitator,
    });

    const { data: dashboardAdminRes, isLoading: isDashboardAdminLoading, isError: isDashboardAdminError, refetch: refetchDashboardAdmin } = useDashboardAdmin({
        enabled: isAdminUser,
    });

    const { data: dashboardPjRes, isLoading: isDashboardPjLoading, isError: isDashboardPjError, refetch: refetchDashboardPj } = useDashboardPjDampingan({
        enabled: isPjGrup,
    });

    const dashboardFasilitatorData = dashboardFasilitatorRes?.data || {};
    const dashboardAdminData = dashboardAdminRes?.data || {};
    const dashboardPjData = dashboardPjRes?.data || {};

    const [activeTab, setActiveTab] = useState('Admin Daerah');

    const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

    const [pjFilterMonth, setPjFilterMonth] = useState(null);
    const [pjFilterYear, setPjFilterYear] = useState(null);
    const [fasFilterMonth, setFasFilterMonth] = useState(null);
    const [fasFilterYear, setFasFilterYear] = useState(null);
    const [adminFilterMonth, setAdminFilterMonth] = useState(null);
    const [adminFilterYear, setAdminFilterYear] = useState(null);

    const renderPJDashboard = () => {
        if (isDashboardPjLoading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-[#0080C5]" size={36} />
                </div>
            );
        }

        if (isDashboardPjError) {
            return (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-red-500 mb-4">Gagal memuat dashboard PJ dampingan.</p>
                    <button onClick={() => refetchDashboardPj()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                </div>
            );
        }

        const totals = dashboardPjData?.totals || {};
        const pengajuan = dashboardPjData?.pengajuan || {};
        const pengajuanTerbaru = dashboardPjData?.pengajuan_terbaru || [];
        const logItems = dashboardPjData?.log_aktivitas_login || [];
        const period = dashboardPjData?.period || {};

        const totalMasyarakat = totals.total_masyarakat ?? 0;
        const pendingCount = pengajuan.pending ?? 0;
        const approvedCount = pengajuan.aktif ?? 0;
        const rejectedCount = pengajuan.ditolak ?? 0;

        const getPengajuanStatusInfo = (status) => {
            switch (status) {
                case 'pending':
                    return { text: 'Menunggu Aksi', dot: 'bg-[#F59E0B]' };
                case 'aktif':
                    return { text: 'Disetujui', dot: 'bg-[#10B981]' };
                case 'ditolak':
                    return { text: 'Ditolak', dot: 'bg-[#EF4444]' };
                default:
                    return { text: 'Status diperbarui', dot: 'bg-slate-300' };
            }
        };

        return (
            <div className="flex flex-col gap-6 md:gap-8 font-['Poppins']">
                {/* Total Masyarakat Card */}
                <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FFF7ED] rounded-xl md:rounded-2xl flex items-center justify-center">
                        <UsersRound size={20} className="text-[#F59E0B] md:w-[24px] md:h-[24px]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#9298B0] text-[11px] md:text-xs font-normal tracking-tight">Total Masyarakat</span>
                        <span className="text-[#0A0F1E] text-2xl md:text-[32px] font-extrabold tracking-tight leading-none mt-1">{totalMasyarakat}</span>
                    </div>
                </div>

                {/* Second Row: Status Pengajuan & Jumlah Kegiatan */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    
                    {/* Status Pengajuan */}
                    <div className="bg-white p-5 md:p-6 rounded-[16px] md:rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[320px] md:h-[340px]">
                        <div className="flex flex-col">
                            <h3 className="text-[#0A0F1E] text-sm font-bold tracking-tight">Status Pengajuan</h3>
                            <p className="text-[#9298B0] text-[11px] md:text-xs font-normal tracking-tight">Ringkasan & update terbaru</p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 md:gap-3">
                            <div className="bg-[#FFF7ED] p-2 md:p-3 rounded-xl border-t-2 border-[#F59E0B] flex flex-col gap-1 items-center justify-center">
                                <Clock size={14} className="text-[#F59E0B]" />
                                <span className="text-[#F59E0B] text-base md:text-lg font-bold">{pendingCount}</span>
                                <span className="text-[#F59E0B] text-[9px] md:text-[10px] font-medium">Menunggu</span>
                            </div>
                            <div className="bg-[#ECFDF5] p-2 md:p-3 rounded-xl border-t-2 border-[#10B981] flex flex-col gap-1 items-center justify-center">
                                <CheckCircle2 size={14} className="text-[#10B981]" />
                                <span className="text-[#10B981] text-base md:text-lg font-bold">{approvedCount}</span>
                                <span className="text-[#10B981] text-[9px] md:text-[10px] font-medium">Disetujui</span>
                            </div>
                            <div className="bg-[#FEF2F2] p-2 md:p-3 rounded-xl border-t-2 border-[#EF4444] flex flex-col gap-1 items-center justify-center">
                                <XCircle size={14} className="text-[#EF4444]" />
                                <span className="text-[#EF4444] text-base md:text-lg font-bold">{rejectedCount}</span>
                                <span className="text-[#EF4444] text-[9px] md:text-[10px] font-medium">Ditolak</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 mt-2 space-y-3">
                            {pengajuanTerbaru.length === 0 ? (
                                <div className="text-center text-slate-400 text-[11px] md:text-xs py-6">Belum ada pengajuan terbaru.</div>
                            ) : (
                                pengajuanTerbaru.map((item) => {
                                    const statusInfo = getPengajuanStatusInfo(item.status);
                                    return (
                                        <div key={item.id_anggota_grup} className="flex items-start gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot} mt-1.5 shrink-0`} />
                                            <div className="flex flex-col">
                                                <span className="text-[#0A0F1E] text-[11px] md:text-xs font-semibold">Data Dampingan {item.name} {statusInfo.text}</span>
                                                <span className="text-[#9298B0] text-[9px] md:text-[10px]">{formatRelativeTime(item.created_at)}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Jumlah Kegiatan Grup Dampingan */}
                    {(() => {
                        const kegData = dashboardPjData?.kegiatan_per_bulan || [];
                        const availYears = [...new Set(kegData.map(d => d.year))].sort();
                        const activeM = pjFilterMonth ?? period.current_month ?? (new Date().getMonth() + 1);
                        const activeY = pjFilterYear ?? period.current_year ?? new Date().getFullYear();
                        const found = kegData.find(d => d.month === activeM && d.year === activeY);
                        const filteredCount = found ? found.kegiatan : 0;
                        return (
                            <div className="bg-white p-5 md:p-6 rounded-[16px] md:rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[320px] md:h-[340px]">
                                <h3 className="text-[#0A0F1E] text-sm font-bold tracking-tight">Jumlah Kegiatan Grup Dampingan</h3>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <select value={activeM} onChange={e => setPjFilterMonth(Number(e.target.value))} className="w-full h-9 pl-3 pr-7 border border-gray-200 rounded-lg text-[11px] font-semibold appearance-none focus:outline-none focus:border-[#0080C5] cursor-pointer bg-white">
                                            {MONTH_NAMES.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                                        </select>
                                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                                    </div>
                                    <div className="relative flex-1">
                                        <select value={activeY} onChange={e => setPjFilterYear(Number(e.target.value))} className="w-full h-9 pl-3 pr-7 border border-gray-200 rounded-lg text-[11px] font-semibold appearance-none focus:outline-none focus:border-[#0080C5] cursor-pointer bg-white">
                                            {(availYears.length > 0 ? availYears : [activeY]).map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                                    </div>
                                    <div className="flex items-center gap-1 ml-auto shrink-0">
                                        <span className="text-[#0A0F1E] text-[10px] md:text-[11px] font-semibold">Total: {filteredCount}</span>
                                    </div>
                                </div>
                                {filteredCount === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center gap-3 md:gap-4 text-center">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-lg flex items-center justify-center"><Info size={18} className="text-slate-300 md:w-[20px] md:h-[20px]" /></div>
                                        <h4 className="text-slate-400 text-[11px] md:text-xs font-bold">Tidak ada kegiatan</h4>
                                        <p className="text-[#9298B0] text-[9px] md:text-[10px] font-medium px-4 md:px-8 leading-relaxed">Kegiatan tidak ditemukan pada bulan yang dipilih.</p>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center gap-3 md:gap-4 text-center">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-[#ECFDF5] rounded-lg flex items-center justify-center"><TrendingUp size={18} className="text-[#10B981] md:w-[20px] md:h-[20px]" /></div>
                                        <h4 className="text-[#0A0F1E] text-[11px] md:text-xs font-bold">{filteredCount} kegiatan</h4>
                                        <p className="text-[#9298B0] text-[9px] md:text-[10px] font-medium px-4 md:px-8 leading-relaxed">Total kegiatan pada bulan yang dipilih.</p>
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <Clock size={18} className="text-[#0080C5] md:w-[20px] md:h-[20px]" />
                    <h2 className="text-[#0A0F1E] text-sm md:text-base font-bold tracking-tight">Log Aktifitas</h2>
                    <span className="bg-[#0080C5]/10 text-[#0080C5] text-[9px] md:text-[10px] font-semibold px-2 py-0.5 rounded-md ml-auto md:ml-0">Semua Aktifitas</span>
                </div>

                <div className="grid grid-cols-1 gap-5">
                    <div className="bg-white rounded-[16px] md:rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col">
                        <div className="px-4 md:px-5 py-3 md:py-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-2.5">
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#0080C5]" />
                                <span className="text-[#0A0F1E] text-[13px] md:text-sm font-bold tracking-tight">PJ Dampingan</span>
                            </div>
                            <span className="text-[#0080C5] text-[9px] md:text-[10px] font-semibold">aktifitas</span>
                        </div>
                        <div className="flex flex-col">
                            {logItems.length === 0 ? (
                                <div className="p-4 text-center text-slate-400 text-xs">Belum ada log login.</div>
                            ) : (
                                logItems.map((log, iIdx) => {
                                    const name = log.user?.name || user?.name || 'PJ Dampingan';
                                    const description = log.deskripsi || 'Login berhasil';
                                    const timeLabel = formatRelativeTime(log.created_at);
                                    return (
                                        <div key={log.id_log || iIdx} className={`p-3 md:p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${iIdx !== logItems.length - 1 ? 'border-b border-slate-50' : 'rounded-b-2xl'}`}>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[#0A0F1E] text-[10px] md:text-[11px] font-semibold">{name}</span>
                                                <span className="text-[#9298B0] text-[9px] md:text-[10px] font-normal line-clamp-1">{description}</span>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 md:gap-1.5">
                                                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#43DE20]" />
                                                <span className="text-[#C4C8D8] text-[9px] md:text-[10px] font-normal whitespace-nowrap">{timeLabel}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

            </div>
        );
    };

    const renderFasilitatorDashboard = () => {
        if (isDashboardFasilitatorLoading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-[#0080C5]" size={36} />
                </div>
            );
        }

        if (isDashboardFasilitatorError) {
            return (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-red-500 mb-4">Gagal memuat dashboard fasilitator.</p>
                    <button onClick={() => refetchDashboardFasilitator()} className="px-4 py-2 bg-[#0080C5] text-white rounded-lg">Coba Lagi</button>
                </div>
            );
        }

        const totals = dashboardFasilitatorData?.totals || {};
        const statistik = dashboardFasilitatorData?.statistik_dampingan || [];
        const period = dashboardFasilitatorData?.period || {};
        const logItems = dashboardFasilitatorData?.log_aktivitas_login || [];

        const totalDampingan = totals.total_dampingan_aktif ?? 0;
        const totalGrup = totals.total_grup_dampingan ?? 0;

        const colors = ['#2332DB', '#D52BCA', '#10B981', '#F59E0B', '#0EA5E9', '#8B5CF6'];
        const pieData = statistik.map((item, index) => ({
            name: item.wilayah,
            value: item.total,
            color: colors[index % colors.length],
        }));

        const lineData = dashboardFasilitatorData?.kegiatan_per_bulan || [];
        const hasPieData = pieData.length > 0 && pieData.some((item) => item.value > 0);

        return (
            <div className="flex flex-col gap-6 font-['Poppins'] min-h-screen">
                {/* Top Stats Cards */}
                <div className="grid grid-cols-2 gap-4 md:gap-5">
                    <div className="bg-white p-4 md:p-6 rounded-[16px] md:rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-[#FFF7ED] rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                            <UsersRound size={20} className="text-[#F59E0B] md:w-[24px] md:h-[24px]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#9298B0] text-xs font-normal tracking-tight">Total Dampingan</span>
                            <span className="text-[#0A0F1E] text-[32px] font-extrabold tracking-tight leading-none mt-1">{totalDampingan}</span>
                        </div>
                    </div>
                    <div className="bg-white p-4 md:p-6 rounded-[16px] md:rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-[#ECFDF5] rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                            <LayoutGrid size={20} className="text-[#10B981] md:w-[24px] md:h-[24px]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#9298B0] text-xs font-normal tracking-tight">Total Grup Dampingan</span>
                            <span className="text-[#0A0F1E] text-[32px] font-extrabold tracking-tight leading-none mt-1">{totalGrup}</span>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {/* Statistik Dampingan - Donut */}
                    <div className="bg-white p-5 md:p-6 rounded-[16px] md:rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[320px] md:h-[340px]">
                        <div>
                            <h3 className="text-[#0A0F1E] text-sm font-bold tracking-tight">Statistik Dampingan</h3>
                            <p className="text-[#9298B0] text-[11px] md:text-xs font-normal">Total Anggota Aktif</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center">
                            {hasPieData ? (
                                <>
                                    <ResponsiveContainer width="100%" height={160}>
                                        <PieChart>
                                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                                                {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full">
                                        {pieData.map((item, i) => (
                                            <div key={i} className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                                <span className="text-[10px] text-slate-500 font-medium">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="text-[11px] text-slate-400">Belum ada data dampingan.</p>
                            )}
                        </div>
                    </div>

                    {/* Jumlah Kegiatan */}
                    {(() => {
                        const kegData = dashboardFasilitatorData?.kegiatan_per_bulan || [];
                        const availYears = [...new Set(kegData.map(d => d.year))].sort();
                        const activeM = fasFilterMonth ?? period.current_month ?? (new Date().getMonth() + 1);
                        const activeY = fasFilterYear ?? period.current_year ?? new Date().getFullYear();
                        const found = kegData.find(d => d.month === activeM && d.year === activeY);
                        const filteredCount = found ? found.kegiatan : 0;
                        return (
                            <div className="bg-white p-5 md:p-6 rounded-[16px] md:rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[320px] md:h-[340px]">
                                <h3 className="text-[#0A0F1E] text-sm font-bold tracking-tight">Jumlah Kegiatan Grup Dampingan</h3>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <select value={activeM} onChange={e => setFasFilterMonth(Number(e.target.value))} className="w-full h-9 pl-3 pr-7 border border-gray-200 rounded-lg text-[11px] font-semibold appearance-none focus:outline-none focus:border-[#0080C5] cursor-pointer bg-white">
                                            {MONTH_NAMES.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                                        </select>
                                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                                    </div>
                                    <div className="relative flex-1">
                                        <select value={activeY} onChange={e => setFasFilterYear(Number(e.target.value))} className="w-full h-9 pl-3 pr-7 border border-gray-200 rounded-lg text-[11px] font-semibold appearance-none focus:outline-none focus:border-[#0080C5] cursor-pointer bg-white">
                                            {(availYears.length > 0 ? availYears : [activeY]).map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-[#9298B0] text-[10px] font-normal">Total Kegiatan: </span>
                                    <span className="text-[#0A0F1E] text-[11px] font-semibold">{filteredCount}</span>
                                </div>
                                {filteredCount === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><Info size={20} className="text-slate-300" /></div>
                                        <h4 className="text-slate-400 text-xs font-bold">Tidak ada kegiatan</h4>
                                        <p className="text-[#9298B0] text-[10px] font-medium leading-relaxed">Kegiatan tidak ditemukan pada bulan yang dipilih.</p>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
                                        <div className="w-10 h-10 bg-[#ECFDF5] rounded-lg flex items-center justify-center"><TrendingUp size={18} className="text-[#10B981]" /></div>
                                        <h4 className="text-[#0A0F1E] text-xs font-bold">{filteredCount} kegiatan</h4>
                                        <p className="text-[#9298B0] text-[10px] font-medium leading-relaxed">Total kegiatan pada bulan yang dipilih.</p>
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {/* Data Kegiatan Dampingan - Line Chart */}
                    <div className="bg-white p-5 md:p-6 rounded-[16px] md:rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[320px] md:h-[340px] md:col-span-2 xl:col-span-1">
                        <div>
                            <div className="flex items-center gap-1.5">
                                <TrendingUp size={14} className="text-[#0080C5]" />
                                <h3 className="text-[#0A0F1E] text-sm font-bold tracking-tight">Data Kegiatan Dampingan</h3>
                            </div>
                            <p className="text-[#9298B0] text-[11px] md:text-xs font-normal">Distribusi Kegiatan Dampingan</p>
                        </div>
                        <div className="flex-1" style={{ minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height={180}>
                                <LineChart data={lineData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#9298B0' }} />
                                    <YAxis tick={{ fontSize: 9, fill: '#9298B0' }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="kegiatan" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', r: 3 }} name="Jumlah Kegiatan" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center">
                            <div className="w-4 md:w-5 border-t-2 border-dashed border-[#8B5CF6]" />
                            <span className="text-[9px] md:text-[10px] text-slate-500 font-medium">Jumlah Kegiatan</span>
                        </div>
                    </div>
                </div>

                {/* Log Aktifitas */}
                <div className="flex items-center gap-2 md:gap-3">
                    <Clock size={18} className="text-[#0080C5] md:w-[20px] md:h-[20px]" />
                    <h2 className="text-[#0A0F1E] text-sm md:text-base font-bold tracking-tight">Log Aktifitas</h2>
                    <span className="bg-[#0080C5]/10 text-[#0080C5] text-[9px] md:text-[10px] font-semibold px-2 py-0.5 rounded-md ml-auto md:ml-0">Semua Aktifitas</span>
                </div>

                <div className="bg-white rounded-[16px] md:rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col">
                    <div className="px-4 md:px-5 py-3 md:py-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-2.5">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#0080C5]" />
                            <span className="text-[#0A0F1E] text-[13px] md:text-sm font-bold tracking-tight">Fasilitator</span>
                        </div>
                        <span className="text-[#0080C5] text-[9px] md:text-[10px] font-semibold">aktifitas</span>
                    </div>
                    <div className="flex flex-col">
                        {logItems.length === 0 ? (
                            <div className="p-4 text-center text-slate-400 text-xs">Belum ada log login.</div>
                        ) : (
                            logItems.map((log, iIdx) => {
                                const name = log.user?.name || user?.name || 'Fasilitator';
                                const description = log.deskripsi || 'Login berhasil';
                                const timeLabel = formatRelativeTime(log.created_at);
                                return (
                                    <div key={log.id_log || iIdx} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${iIdx !== logItems.length - 1 ? 'border-b border-slate-50' : 'rounded-b-2xl'}`}>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[#0A0F1E] text-[11px] font-semibold">{name}</span>
                                            <span className="text-[#9298B0] text-[10px] font-normal line-clamp-1">{description}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-[#43DE20]/20 rounded-full flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#43DE20]" />
                                            </div>
                                            <span className="text-[#C4C8D8] text-[10px] font-normal">{timeLabel}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderAdminDashboard = () => {
        if (isDashboardAdminLoading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-[#0080C5]" size={36} />
                </div>
            );
        }

        if (isDashboardAdminError) {
            return (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-red-500 mb-4">Gagal memuat dashboard admin.</p>
                    <button className="px-4 py-2 bg-[#0080C5] text-white rounded-lg" onClick={() => refetchDashboardAdmin()}>Coba Lagi</button>
                </div>
            );
        }

        const totals = dashboardAdminData?.totals || {};
        const statistik = dashboardAdminData?.statistik_dampingan || [];
        const grupDistribusi = dashboardAdminData?.grup_distribusi || [];
        const adminActivities = dashboardAdminData?.log_aktivitas || [];

        const stats = [
            { label: 'Total Admin Daerah', value: totals.total_admin_daerah ?? 0, icon: <Users size={24} className="text-[#8B5CF6]" />, bgColor: 'bg-[#8B5CF6]/10' },
            { label: 'Total Fasilitator', value: totals.total_fasilitator ?? 0, icon: <UserPlus size={24} className="text-[#0080C5]" />, bgColor: 'bg-[#0080C5]/10' },
            { label: 'Total Dampingan', value: totals.total_dampingan ?? 0, icon: <Users size={24} className="text-[#F59E0B]" />, bgColor: 'bg-[#F59E0B]/10' },
            { label: 'Total Grup Dampingan', value: totals.total_grup_dampingan ?? 0, icon: <LayoutGrid size={24} className="text-[#10B981]" />, bgColor: 'bg-[#10B981]/10' },
        ];

        const activityItems = adminActivities.map((log) => ({
            id: log.user?.role?.name?.split('_').pop()?.toUpperCase() || 'AKT',
            name: log.user?.name || 'Pengguna',
            action: log.deskripsi || `${log.aksi || 'Update'} ${log.modul || ''}`.trim(),
            time: formatRelativeTime(log.created_at),
            statusColor: 'bg-[#43DE20]',
            role: log.user?.role?.name,
        }));

        const activities = [
            {
                title: 'Admin Daerah',
                items: activityItems.filter((item) => item.role?.startsWith('admin')).slice(0, 3),
            },
            {
                title: 'Fasilitator',
                items: activityItems.filter((item) => item.role === ROLES.FASILITATOR).slice(0, 3),
            },
            {
                title: 'PJ Dampingan',
                items: activityItems.filter((item) => item.role === ROLES.PJ_DAMPINGAN).slice(0, 3),
            },
        ];

        const pieData = statistik.length > 0
            ? statistik.map((item, index) => ({
                name: item.wilayah,
                value: item.total,
                color: ['#2332DB', '#D52BCA', '#10B981', '#F59E0B', '#0EA5E9', '#8B5CF6'][index % 6],
            }))
            : [];

        const groupData = grupDistribusi.length > 0 ? grupDistribusi : [
            { name: 'Pusat', grup: 0 },
            { name: 'Provinsi', grup: 0 },
            { name: 'Kabupaten', grup: 0 },
            { name: 'Kecamatan', grup: 0 },
        ];

        return (
            <div className="flex flex-col gap-5 md:gap-8 font-['Poppins']">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-3 md:p-6 rounded-[16px] md:rounded-2xl border border-slate-100 flex flex-col items-center sm:flex-row sm:items-center gap-2 md:gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                            <div className={`w-9 h-9 md:w-14 md:h-14 ${stat.bgColor} rounded-[10px] md:rounded-2xl flex items-center justify-center shrink-0`}>
                                {stat.icon}
                            </div>
                            <div className="flex flex-col text-center sm:text-left w-full sm:w-auto">
                                <span className="text-[#9298B0] text-[9px] md:text-xs font-normal tracking-tight truncate leading-tight w-full">{stat.label}</span>
                                <span className="text-[#0A0F1E] text-lg md:text-[32px] font-extrabold tracking-tight leading-none mt-0.5 md:mt-1">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    <div className="bg-white p-5 md:p-6 rounded-[16px] md:rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[320px] md:h-80">
                        <div className="text-center">
                            <h3 className="text-[#0A0F1E] text-[13px] md:text-base font-bold tracking-tight">Statistik Dampingan</h3>
                            <p className="text-[#9298B0] text-[10px] md:text-xs font-normal tracking-tight">Total Anggota Aktif</p>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart>
                                    <Pie data={pieData} innerRadius={45} outerRadius={70} paddingAngle={0} dataKey="value">
                                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 md:gap-x-4 gap-y-2 mt-2 px-2">
                            {pieData.map((item, index) => (
                                <div key={index} className="flex items-center gap-1.5 md:gap-2">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[#636364] text-[8px] md:text-[10px] font-medium tracking-tight whitespace-nowrap">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {(() => {
                        const kegData = dashboardAdminData?.kegiatan_per_bulan || [];
                        const availYears = [...new Set(kegData.map(d => d.year))].sort();
                        const curPeriod = dashboardAdminData?.period || {};
                        const activeM = adminFilterMonth ?? curPeriod.current_month ?? (new Date().getMonth() + 1);
                        const activeY = adminFilterYear ?? curPeriod.current_year ?? new Date().getFullYear();
                        const found = kegData.find(d => d.month === activeM && d.year === activeY);
                        const filteredCount = found ? found.kegiatan : 0;
                        return (
                            <div className="bg-white p-5 md:p-6 rounded-[16px] md:rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[320px] md:h-80">
                                <h3 className="text-[#0A0F1E] text-[13px] md:text-sm font-bold tracking-tight">Jumlah Kegiatan Per Grup</h3>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <select value={activeM} onChange={e => setAdminFilterMonth(Number(e.target.value))} className="w-full h-9 pl-3 pr-7 border border-gray-200 rounded-lg text-[10px] md:text-[11px] font-semibold appearance-none focus:outline-none focus:border-[#0080C5] cursor-pointer bg-white">
                                            {MONTH_NAMES.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                                        </select>
                                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                                    </div>
                                    <div className="relative flex-1">
                                        <select value={activeY} onChange={e => setAdminFilterYear(Number(e.target.value))} className="w-full h-9 pl-3 pr-7 border border-gray-200 rounded-lg text-[10px] md:text-[11px] font-semibold appearance-none focus:outline-none focus:border-[#0080C5] cursor-pointer bg-white">
                                            {(availYears.length > 0 ? availYears : [activeY]).map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-[#9298B0] text-xs font-normal">Total Kegiatan: </span>
                                    <span className="text-[#0A0F1E] text-[11px] font-semibold">{filteredCount}</span>
                                </div>
                                {filteredCount === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><Info size={20} className="text-slate-300" /></div>
                                        <p className="text-[#9298B0] text-xs font-medium px-8 leading-relaxed">Kegiatan tidak ditemukan pada bulan yang dipilih.</p>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                                        <div className="w-10 h-10 bg-[#ECFDF5] rounded-lg flex items-center justify-center"><TrendingUp size={18} className="text-[#10B981]" /></div>
                                        <p className="text-[#0A0F1E] text-xs font-bold">{filteredCount} kegiatan</p>
                                        <p className="text-[#9298B0] text-[10px] font-medium leading-relaxed">Total kegiatan pada bulan yang dipilih.</p>
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    <div className="bg-white p-5 md:p-6 rounded-[16px] md:rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[320px] md:h-80 md:col-span-2 xl:col-span-1">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={16} className="text-[#0A0F1E] md:w-[20px] md:h-[20px]" />
                                <h3 className="text-[#0A0F1E] text-[13px] md:text-sm font-bold tracking-tight">Jumlah Grup Dampingan</h3>
                            </div>
                            <p className="text-[#9298B0] text-[10px] md:text-xs font-normal ml-6 md:ml-7 tracking-tight">Distribusi Tingkat Dampingan</p>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height={160}>
                                <LineChart data={groupData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f2f8" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#636364' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#636364' }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="grup" stroke="#8979FF" strokeWidth={2} dot={{ r: 3, fill: 'white', stroke: '#8979FF', strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center mt-1">
                            <div className="w-3 md:w-4 border-t-2 border-[#8979FF]" />
                            <span className="text-[9px] md:text-[10px] text-slate-500 font-medium">Jumlah Grup</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 bg-white p-3 md:p-4 rounded-[16px] md:rounded-none md:bg-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] md:shadow-none -mb-2 md:mb-0">
                    <Clock size={16} className="text-[#0080C5] md:w-[20px] md:h-[20px]" />
                    <h2 className="text-[#0A0F1E] text-[13px] md:text-base font-bold tracking-tight">Log Aktifitas</h2>
                    <span className="bg-[#0080C5]/10 text-[#0080C5] text-[9px] md:text-[10px] font-semibold px-2 py-0.5 md:py-1 rounded-md ml-auto">Semua Aktifitas</span>
                </div>

                {/* Tabs for mobile, grid for desktop */}
                <div className="xl:hidden bg-white border-b border-slate-100 flex overflow-x-auto no-scrollbar rounded-t-[16px]">
                    {activities.map((section) => (
                        <button
                            key={section.title}
                            onClick={() => setActiveTab(section.title)}
                            className={`flex-1 px-4 py-3 text-[11px] font-bold whitespace-nowrap border-b-2 transition-colors ${
                                activeTab === section.title 
                                    ? 'border-[#0080C5] text-[#0080C5]' 
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {section.title}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    {activities.map((section, sIdx) => (
                        <div 
                            key={sIdx} 
                            className={`bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] md:shadow-sm border border-slate-100 flex flex-col
                                ${activeTab !== section.title ? 'hidden xl:flex' : 'flex rounded-b-[16px] xl:rounded-[16px] -mt-5 xl:mt-0'}
                                xl:rounded-2xl`}
                        >
                            <div className="hidden xl:flex px-5 py-4 border-b border-slate-100 items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-[#0080C5]" />
                                    <span className="text-[#0A0F1E] text-sm font-bold tracking-tight">{section.title}</span>
                                </div>
                                <span className="text-[#0080C5] text-[10px] font-semibold">aktifitas</span>
                            </div>
                            
                            {/* Mobile header inside tab content */}
                            <div className="xl:hidden px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#0080C5]" />
                                    <span className="text-[#0A0F1E] text-[12px] font-bold tracking-tight">{section.title}</span>
                                </div>
                                <span className="text-[#0080C5] text-[9px] font-semibold">aktifitas</span>
                            </div>

                            <div className="flex flex-col">
                                {section.items.map((item, iIdx) => (
                                    <div key={iIdx} className={`p-3 md:p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${iIdx !== section.items.length - 1 ? 'border-b border-slate-50' : 'rounded-b-[16px] xl:rounded-b-2xl'}`}>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[#0A0F1E] text-[10px] md:text-[11px] font-bold">{item.name}</span>
                                            <span className="text-[#9298B0] text-[9px] md:text-[10px] font-normal line-clamp-1">{item.action}</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 md:gap-1.5 shrink-0">
                                            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-green-100">
                                                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${item.statusColor}`} />
                                            </div>
                                            <span className="text-[#C4C8D8] text-[8px] md:text-[10px] font-normal whitespace-nowrap">{item.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <AdminLayout title="Dashboard">
            {isPjGrup 
                ? renderPJDashboard() 
                : isFasilitator 
                    ? renderFasilitatorDashboard() 
                    : renderAdminDashboard()}
        </AdminLayout>
    );
};

export default DashboardPage;
