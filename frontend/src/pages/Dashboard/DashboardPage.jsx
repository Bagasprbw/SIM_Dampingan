import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getUser } from '../../utils/storage';
import { ROLES } from '../../constants/roles';
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
    XCircle
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';

const DashboardPage = () => {
    const user = getUser();
    const isPjGrup = user?.role === ROLES.PJ_DAMPINGAN;
    const isFasilitator = user?.role === ROLES.FASILITATOR;

    const pieData = [
        { name: 'Jawa Tengah', value: 35, color: '#2332DB' },
        { name: 'Kalimantan Tengah', value: 25, color: '#D52BCA' },
        { name: 'Aceh Utara', value: 20, color: '#8B5CF6' },
        { name: 'Papua Barat', value: 20, color: '#F59E0B' },
    ];

    const lineData = [
        { name: 'Pusat', grup: 25 },
        { name: 'Provinsi', grup: 18 },
        { name: 'Kecamatan', grup: 75 },
        { name: 'Kabupaten', grup: 40 },
    ];

    const renderPJDashboard = () => {
        return (
            <div className="flex flex-col gap-8 font-['Poppins']">
                {/* Total Masyarakat Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                    <div className="w-14 h-14 bg-[#FFF7ED] rounded-2xl flex items-center justify-center">
                        <UsersRound size={24} className="text-[#F59E0B]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#9298B0] text-xs font-normal tracking-tight">Total Masyarakat</span>
                        <span className="text-[#0A0F1E] text-[32px] font-extrabold tracking-tight leading-none mt-1">118</span>
                    </div>
                </div>

                {/* Second Row: Status Pengajuan & Jumlah Kegiatan */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    
                    {/* Status Pengajuan */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-sm h-[340px]">
                        <div className="flex flex-col">
                            <h3 className="text-[#0A0F1E] text-sm font-bold tracking-tight">Status Pengajuan</h3>
                            <p className="text-[#9298B0] text-xs font-normal tracking-tight">Ringkasan & update terbaru</p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-[#FFF7ED] p-3 rounded-xl border-t-2 border-[#F59E0B] flex flex-col gap-1">
                                <Clock size={14} className="text-[#F59E0B]" />
                                <span className="text-[#F59E0B] text-lg font-bold">4</span>
                                <span className="text-[#F59E0B] text-[10px] font-medium">Menunggu</span>
                            </div>
                            <div className="bg-[#ECFDF5] p-3 rounded-xl border-t-2 border-[#10B981] flex flex-col gap-1">
                                <CheckCircle2 size={14} className="text-[#10B981]" />
                                <span className="text-[#10B981] text-lg font-bold">12</span>
                                <span className="text-[#10B981] text-[10px] font-medium">Disetujui</span>
                            </div>
                            <div className="bg-[#FEF2F2] p-3 rounded-xl border-t-2 border-[#EF4444] flex flex-col gap-1">
                                <XCircle size={14} className="text-[#EF4444]" />
                                <span className="text-[#EF4444] text-lg font-bold">2</span>
                                <span className="text-[#EF4444] text-[10px] font-medium">Ditolak</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 mt-2 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-1.5 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-[#0A0F1E] text-xs font-semibold">Data Dampingan Budi Ditolak</span>
                                    <span className="text-[#9298B0] text-[10px]">2j lalu</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-1.5 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-[#0A0F1E] text-xs font-semibold">Data Dampingan Siti Menunggu Aksi</span>
                                    <span className="text-[#9298B0] text-[10px]">3j lalu</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-[#0A0F1E] text-xs font-semibold">Data Dampingan Rudi disetujui</span>
                                    <span className="text-[#9298B0] text-[10px]">5j lalu</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Jumlah Kegiatan Grup Dampingan */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-sm h-[340px]">
                        <h3 className="text-[#0A0F1E] text-sm font-bold tracking-tight">Jumlah Kegiatan Grup Dampingan</h3>
                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-[11px] font-semibold cursor-pointer">April <ChevronDown size={14} /></div>
                            <div className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-[11px] font-semibold cursor-pointer">2026 <ChevronDown size={14} /></div>
                            <div className="flex items-center gap-1 ml-auto">
                                <span className="text-[#9298B0] text-[10px] font-normal">Total Kegiatan Bulan ini: </span>
                                <span className="text-[#0A0F1E] text-[11px] font-semibold">0</span>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><Info size={20} className="text-slate-300" /></div>
                            <h4 className="text-slate-400 text-xs font-bold">Tidak ada kegiatan</h4>
                            <p className="text-[#9298B0] text-[10px] font-medium px-8 leading-relaxed">Kegiatan tidak ditemukan pada bulan ini.</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Clock size={20} className="text-[#0080C5]" />
                    <h2 className="text-[#0A0F1E] text-base font-bold tracking-tight">Log Aktifitas</h2>
                    <span className="bg-[#0080C5]/10 text-[#0080C5] text-[10px] font-semibold px-2 py-0.5 rounded-md">Semua Aktifitas</span>
                </div>

                <div className="grid grid-cols-1 gap-5">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-[#0080C5]" />
                                <span className="text-[#0A0F1E] text-sm font-bold tracking-tight">PJ Dampingan</span>
                            </div>
                            <span className="text-[#0080C5] text-[10px] font-semibold">aktifitas</span>
                        </div>
                        <div className="flex flex-col">
                            {[1,2,3].map((item, iIdx) => (
                                <div key={iIdx} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${iIdx !== 2 ? 'border-b border-slate-50' : 'rounded-b-2xl'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold">PJ</div>
                                        <div className="flex flex-col">
                                            <span className="text-[#0A0F1E] text-[11px] font-semibold">PJ Dampingan Santoso</span>
                                            <span className="text-[#9298B0] text-[10px] font-normal line-clamp-1">Mengajukan Data Dampingan Baru</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <div className={`w-2.5 h-2.5 rounded-full bg-[#43DE20]`} />
                                        <span className="text-[#C4C8D8] text-[10px] font-normal">1 jam lalu</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        );
    };

    const renderFasilitatorDashboard = () => {
        const fasilitatorPieData = [
            { name: 'Karanganyar', value: 30, color: '#2332DB' },
            { name: 'Sukoharjo', value: 25, color: '#D52BCA' },
            { name: 'Surakarta', value: 25, color: '#10B981' },
            { name: 'Klaten', value: 20, color: '#F59E0B' },
        ];
        const fasilitatorLineData = [
            { name: 'January', kegiatan: 10 },
            { name: 'April', kegiatan: 5 },
            { name: 'July', kegiatan: 80 },
            { name: 'Oktober', kegiatan: 55 },
            { name: 'Desember', kegiatan: 30 },
        ];

        return (
            <div className="flex flex-col gap-6 font-['Poppins'] p-8 bg-[#F0F2F8] min-h-screen">
                {/* Top Stats Cards */}
                <div className="grid grid-cols-2 gap-5">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                        <div className="w-14 h-14 bg-[#FFF7ED] rounded-2xl flex items-center justify-center">
                            <UsersRound size={24} className="text-[#F59E0B]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#9298B0] text-xs font-normal tracking-tight">Total Dampingan</span>
                            <span className="text-[#0A0F1E] text-[32px] font-extrabold tracking-tight leading-none mt-1">118</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                        <div className="w-14 h-14 bg-[#ECFDF5] rounded-2xl flex items-center justify-center">
                            <LayoutGrid size={24} className="text-[#10B981]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#9298B0] text-xs font-normal tracking-tight">Total Grup Dampingan</span>
                            <span className="text-[#0A0F1E] text-[32px] font-extrabold tracking-tight leading-none mt-1">118</span>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-3 gap-5">
                    {/* Statistik Dampingan - Donut */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-sm h-[340px]">
                        <div>
                            <h3 className="text-[#0A0F1E] text-sm font-bold tracking-tight">Statistik Dampingan</h3>
                            <p className="text-[#9298B0] text-xs font-normal">Total Anggota Aktif</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie data={fasilitatorPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                                        {fasilitatorPieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full">
                                {fasilitatorPieData.map((item, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                        <span className="text-[10px] text-slate-500 font-medium">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Jumlah Kegiatan */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-sm h-[340px]">
                        <h3 className="text-[#0A0F1E] text-sm font-bold tracking-tight">Jumlah Kegiatan Grup Dampingan</h3>
                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-[11px] font-semibold cursor-pointer">April <ChevronDown size={14} /></div>
                            <div className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-[11px] font-semibold cursor-pointer">2026 <ChevronDown size={14} /></div>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[#9298B0] text-[10px] font-normal">Total Kegiatan Bulan ini: </span>
                            <span className="text-[#0A0F1E] text-[11px] font-semibold">0</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><Info size={20} className="text-slate-300" /></div>
                            <h4 className="text-slate-400 text-xs font-bold">Tidak ada kegiatan</h4>
                            <p className="text-[#9298B0] text-[10px] font-medium leading-relaxed">Kegiatan tidak ditemukan pada bulan ini.</p>
                        </div>
                    </div>

                    {/* Data Kegiatan Dampingan - Line Chart */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-sm h-[340px]">
                        <div>
                            <div className="flex items-center gap-1.5">
                                <TrendingUp size={14} className="text-[#0080C5]" />
                                <h3 className="text-[#0A0F1E] text-sm font-bold tracking-tight">Data Kegiatan Dampingan</h3>
                            </div>
                            <p className="text-[#9298B0] text-xs font-normal">Distribusi Kegiatan Dampingan</p>
                        </div>
                        <div className="flex-1" style={{ minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height={180}>
                                <LineChart data={fasilitatorLineData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#9298B0' }} />
                                    <YAxis tick={{ fontSize: 9, fill: '#9298B0' }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="kegiatan" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', r: 3 }} name="Jumlah Kegiatan" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center">
                            <div className="w-5 border-t-2 border-dashed border-[#8B5CF6]" />
                            <span className="text-[10px] text-slate-500 font-medium">Jumlah Kegiatan</span>
                        </div>
                    </div>
                </div>

                {/* Log Aktifitas */}
                <div className="flex items-center gap-3">
                    <Clock size={20} className="text-[#0080C5]" />
                    <h2 className="text-[#0A0F1E] text-base font-bold tracking-tight">Log Aktifitas</h2>
                    <span className="bg-[#0080C5]/10 text-[#0080C5] text-[10px] font-semibold px-2 py-0.5 rounded-md">Semua Aktifitas</span>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-[#0080C5]" />
                            <span className="text-[#0A0F1E] text-sm font-bold tracking-tight">Fasilitator</span>
                        </div>
                        <span className="text-[#0080C5] text-[10px] font-semibold">aktifitas</span>
                    </div>
                    <div className="flex flex-col">
                        {[1,2,3].map((_, iIdx) => (
                            <div key={iIdx} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${iIdx !== 2 ? 'border-b border-slate-50' : 'rounded-b-2xl'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-[#0080C5] text-white rounded-lg flex items-center justify-center text-[11px] font-bold">PJ</div>
                                    <div className="flex flex-col">
                                        <span className="text-[#0A0F1E] text-[11px] font-semibold">Fasilitator {user?.name || 'Siti Aminah'}</span>
                                        <span className="text-[#9298B0] text-[10px] font-normal">menambahkan data kegiatan baru</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-[#43DE20]/20 rounded-full flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#43DE20]" />
                                    </div>
                                    <span className="text-[#C4C8D8] text-[10px] font-normal">1 jam lalu</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderAdminDashboard = () => {
        const stats = [
            { label: 'Total Admin Daerah', value: '118', icon: <Users size={24} className="text-[#8B5CF6]" />, bgColor: 'bg-[#8B5CF6]/10' },
            { label: 'Total Fasilitator', value: '118', icon: <UserPlus size={24} className="text-[#0080C5]" />, bgColor: 'bg-[#0080C5]/10' },
            { label: 'Total Dampingan', value: '118', icon: <Users size={24} className="text-[#F59E0B]" />, bgColor: 'bg-[#F59E0B]/10' },
            { label: 'Total Grup Dampingan', value: '118', icon: <LayoutGrid size={24} className="text-[#10B981]" />, bgColor: 'bg-[#10B981]/10' },
        ];
    
        const activities = [
            { 
                title: 'Admin Daerah', 
                items: [
                    { id: 'PJ', name: 'Provinsi Jawa Tengah', action: 'menambahkan data fasilitator baru', time: '1 jam lalu', statusColor: 'bg-[#43DE20]' },
                    { id: 'PJ', name: 'Provinsi Jawa Tengah', action: 'menambahkan data fasilitator baru', time: '1 jam lalu', statusColor: 'bg-[#43DE20]' },
                ]
            },
            { 
                title: 'Fasilitator', 
                items: [
                    { id: 'PJ', name: 'Paijo Pamungkas', action: 'menambahkan laporan baru', time: '1 jam lalu', statusColor: 'bg-[#43DE20]' },
                    { id: 'PJ', name: 'Paijo Pamungkas', action: 'menambahkan laporan baru', time: '1 jam lalu', statusColor: 'bg-[#43DE20]' },
                ]
            },
            { 
                title: 'PJ Dampingan', 
                items: [
                    { id: 'PJ', name: 'PJ Mbejen', action: 'menambahkan anggota baru', time: '1 jam lalu', statusColor: 'bg-[#43DE20]' },
                    { id: 'PJ', name: 'PJ Mbejen', action: 'menambahkan anggota baru', time: '1 jam lalu', statusColor: 'bg-[#43DE20]' },
                ]
            }
        ];

        return (
            <div className="flex flex-col gap-8 font-['Poppins']">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                            <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center`}>
                                {stat.icon}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#9298B0] text-xs font-normal tracking-tight">{stat.label}</span>
                                <span className="text-[#0A0F1E] text-[32px] font-extrabold tracking-tight leading-none mt-1">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-sm h-80">
                        <div className="text-center">
                            <h3 className="text-[#0A0F1E] text-base font-bold tracking-tight">Statistik Dampingan</h3>
                            <p className="text-[#9298B0] text-xs font-normal tracking-tight">Total Anggota Aktif</p>
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
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                            {pieData.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-[#636364] text-[10px] font-medium tracking-tight whitespace-nowrap">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-sm h-80">
                        <h3 className="text-[#0A0F1E] text-sm font-bold tracking-tight">Jumlah Kegiatan Per Grup</h3>
                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-[11px] font-semibold cursor-pointer">April <ChevronDown size={14} /></div>
                            <div className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-[11px] font-semibold cursor-pointer">2026 <ChevronDown size={14} /></div>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[#9298B0] text-xs font-normal">Total Kegiatan Bulan ini: </span>
                            <span className="text-[#0A0F1E] text-[11px] font-semibold">0</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><Info size={20} className="text-slate-300" /></div>
                            <p className="text-[#9298B0] text-xs font-medium px-8 leading-relaxed">Kegiatan tidak ditemukan pada bulan ini.</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-sm h-80">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={20} className="text-[#0A0F1E]" />
                                <h3 className="text-[#0A0F1E] text-sm font-bold tracking-tight">Jumlah Grup Dampingan</h3>
                            </div>
                            <p className="text-[#9298B0] text-xs font-normal ml-7 tracking-tight">Distribusi Tingkat Dampingan</p>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height={160}>
                                <LineChart data={lineData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f2f8" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#636364' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#636364' }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="grup" stroke="#8979FF" strokeWidth={2} dot={{ r: 4, fill: 'white', stroke: '#8979FF', strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <TrendingUp size={20} className="text-[#0080C5]" />
                    <h2 className="text-[#0A0F1E] text-base font-bold tracking-tight">Log Aktifitas</h2>
                    <span className="bg-[#0080C5]/10 text-[#0080C5] text-[10px] font-semibold px-2 py-0.5 rounded-md">Semua Aktifitas</span>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    {activities.map((section, sIdx) => (
                        <div key={sIdx} className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-[#0080C5]" />
                                    <span className="text-[#0A0F1E] text-sm font-bold tracking-tight">{section.title}</span>
                                </div>
                                <span className="text-[#0080C5] text-[10px] font-semibold">aktifitas</span>
                            </div>
                            <div className="flex flex-col">
                                {section.items.map((item, iIdx) => (
                                    <div key={iIdx} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${iIdx !== section.items.length - 1 ? 'border-b border-slate-50' : 'rounded-b-2xl'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold">{item.id}</div>
                                            <div className="flex flex-col">
                                                <span className="text-[#0A0F1E] text-[11px] font-semibold">{item.name}</span>
                                                <span className="text-[#9298B0] text-[10px] font-normal line-clamp-1">{item.action}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div className={`w-2.5 h-2.5 rounded-full ${item.statusColor}`} />
                                            <span className="text-[#C4C8D8] text-[10px] font-normal">{item.time}</span>
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
