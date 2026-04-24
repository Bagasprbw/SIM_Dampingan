import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { 
    ChevronDown,
    Info,
    TrendingUp,
    Clock,
    FileUser,
    UserPlus,
    Users,
    LayoutGrid
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';

const DashboardPage = () => {
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
                { id: 'PJ', name: 'Provinsi Jawa Tengah', action: 'menambahkan data fasilitator baru', time: '1 jam lalu', statusColor: 'bg-[#43DE20]' },
            ]
        },
        { 
            title: 'Fasilitator', 
            items: [
                { id: 'PJ', name: 'Paijo Pamungkas', action: 'menambahkan laporan baru', time: '1 jam lalu', statusColor: 'bg-[#43DE20]' },
                { id: 'PJ', name: 'Paijo Pamungkas', action: 'menambahkan laporan baru', time: '1 jam lalu', statusColor: 'bg-[#43DE20]' },
                { id: 'PJ', name: 'Paijo Pamungkas', action: 'menambahkan laporan baru', time: '1 jam lalu', statusColor: 'bg-[#43DE20]' },
            ]
        },
        { 
            title: 'PJ Dampingan', 
            items: [
                { id: 'PJ', name: 'PJ Mbejen', action: 'menambahkan anggota baru', time: '1 jam lalu', statusColor: 'bg-[#43DE20]' },
                { id: 'PJ', name: 'PJ Mbejen', action: 'menambahkan anggota baru', time: '1 jam lalu', statusColor: 'bg-[#43DE20]' },
                { id: 'PJ', name: 'PJ Mbejen', action: 'menambahkan anggota baru', time: '1 jam lalu', statusColor: 'bg-[#43DE20]' },
            ]
        }
    ];

    return (
        <AdminLayout title="Dashboard">
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
                        <div className="flex-1 min-h-0 relative">
                            <ResponsiveContainer width="100%" height="100%">
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
                            <div className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold cursor-pointer">April <ChevronDown size={14} /></div>
                            <div className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold cursor-pointer">2026 <ChevronDown size={14} /></div>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[#9298B0] text-xs font-normal">Total Kegiatan Bulan ini: </span>
                            <span className="text-[#0A0F1E] text-xs font-bold">0</span>
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
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f2f8" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#636364' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#636364' }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="grup" stroke="#8979FF" strokeWidth={2} dot={{ r: 4, fill: 'white', stroke: '#8979FF', strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center items-center gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-[2px] bg-[#8979FF]" />
                                <div className="w-2 h-2 rounded-full border border-[#8979FF] bg-white -ml-3" />
                                <span className="text-black/70 text-[10px]">Jumlah Grup</span>
                            </div>
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
                                            <div className="w-9 h-9 bg-[#0080C5] rounded-[10px] flex items-center justify-center text-white text-xs font-medium">{item.id}</div>
                                            <div className="flex flex-col">
                                                <span className="text-[#0A0F1E] text-xs font-semibold">{item.name}</span>
                                                <span className="text-[#9298B0] text-[10px] font-normal line-clamp-1">{item.action}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            {/* Titik Hijau - Sekarang bulat sempurna */}
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
        </AdminLayout>
    );
};

export default DashboardPage;
