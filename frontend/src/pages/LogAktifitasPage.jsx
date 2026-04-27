import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { 
    Clock, 
    ChevronDown, 
    Calendar,
    CheckSquare,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const LogAktifitasPage = () => {
    const [roleFilter, setRoleFilter] = useState('Semua Role');

    const logs = [
        { role: 'Admin Daerah', color: 'violet', name: 'Provinsi Jawa Tengah', initial: 'JT', action: 'Menambahkan data fasilitator baru', time: '1 jam lalu' },
        { role: 'Admin Daerah', color: 'violet', name: 'Provinsi Jawa Barat', initial: 'JB', action: 'Mengubah data grup dampingan', time: '2 jam lalu' },
        { role: 'Fasilitator', color: 'blue', name: 'Paijo Pamungkas', initial: 'PP', action: 'Menambahkan laporan kegiatan baru', time: '1 jam lalu' },
        { role: 'Fasilitator', color: 'blue', name: 'Budi Santoso', initial: 'BS', action: 'Memperbarui data anggota dampingan', time: '4 jam lalu' },
        { role: 'PJ Dampingan', color: 'orange', name: 'PJ Mbejen', initial: 'PJ', action: 'Menambahkan anggota dampingan baru', time: '1 jam lalu' },
        { role: 'Admin Daerah', color: 'violet', name: 'Provinsi Kalimantan Tengah', initial: 'KT', action: 'Menambahkan grup dampingan baru', time: '10 jam lalu' },
        { role: 'Fasilitator', color: 'blue', name: 'Ahmad Fauzi', initial: 'AF', action: 'Menyelesaikan laporan bulanan', time: '12 jam lalu' },
        { role: 'Admin Daerah', color: 'violet', name: 'Provinsi Sulawesi Utara', initial: 'SU', action: 'Mengubah data admin daerah', time: '13 jam lalu' },
        { role: 'PJ Dampingan', color: 'orange', name: 'PJ Mojosongo', initial: 'PM', action: 'Mengunggah laporan kegiatan bulanan', time: '14 jam lalu' },
        { role: 'Fasilitator', color: 'blue', name: 'Rini Wahyuni', initial: 'RW', action: 'Memperbarui profil anggota dampingan', time: '15 jam lalu' },
    ];

    const getRoleStyles = (role) => {
        switch (role) {
            case 'Admin Daerah':
                return { bg: 'bg-[#EDE9FE]', text: 'text-[#7C3AED]', dot: 'bg-[#7C3AED]', avatarBg: 'bg-[#EDE9FE]', avatarText: 'text-[#7C3AED]' };
            case 'Fasilitator':
                return { bg: 'bg-[#DBEAFE]', text: 'text-[#0080C5]', dot: 'bg-[#0080C5]', avatarBg: 'bg-[#DBEAFE]', avatarText: 'text-[#0080C5]' };
            case 'PJ Dampingan':
                return { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', dot: 'bg-[#F97316]', avatarBg: 'bg-[#FFF7ED]', avatarText: 'text-[#C2410C]' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', avatarBg: 'bg-gray-100', avatarText: 'text-gray-600' };
        }
    };

    return (
        <AdminLayout title="Log Aktifitas">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                
                {/* Main Content Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    
                    {/* Header Log */}
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#0080C5]/10 rounded-full flex items-center justify-center text-[#0080C5]">
                                <Clock size={20} />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="text-lg font-bold text-slate-950 tracking-tight">Log Aktifitas</h3>
                                <p className="text-xs text-slate-400 font-normal">Riwayat seluruh aktifitas pengguna sistem</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Date Picker Filter */}
                            <div className="h-10 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-3 text-slate-950 cursor-pointer hover:bg-slate-50 transition-all">
                                <Calendar size={16} className="text-slate-400" />
                                <span className="text-xs font-bold">19/20/2000</span>
                            </div>

                            {/* Role Filter */}
                            <div className="h-10 px-4 min-w-[140px] bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-slate-950 cursor-pointer hover:bg-slate-50 transition-all">
                                <span className="text-xs font-bold">{roleFilter}</span>
                                <ChevronDown size={16} className="text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#FAFBFD] border-b border-slate-100">
                                    <th className="py-4 px-8 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest w-[20%]">ROLE</th>
                                    <th className="py-4 px-6 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest w-[25%]">NAMA</th>
                                    <th className="py-4 px-6 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest w-[40%]">KETERANGAN AKTIFITAS</th>
                                    <th className="py-4 px-6 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest w-[15%]">WAKTU</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {logs.map((log, index) => {
                                    const style = getRoleStyles(log.role);
                                    return (
                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-5 px-8">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 ${style.bg} ${style.text} rounded-full`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></div>
                                                    <span className="text-[11px] font-bold">{log.role}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 ${style.avatarBg} ${style.avatarText} rounded-full flex items-center justify-center text-xs font-bold`}>
                                                        {log.initial}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-950">{log.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-2">
                                                    <CheckSquare size={16} className="text-[#00BC7D]" />
                                                    <span className="text-xs text-slate-600 font-medium">{log.action}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <span className="text-xs text-slate-400 font-medium">{log.time}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Section */}
                    <div className="px-8 py-5 border-t border-slate-100 flex justify-between items-center bg-white">
                        <div className="text-xs font-medium">
                            <span className="text-slate-400">Menampilkan </span>
                            <span className="text-slate-950 font-bold">10</span>
                            <span className="text-slate-400"> dari </span>
                            <span className="text-slate-950 font-bold">15</span>
                            <span className="text-slate-400"> aktifitas</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                            <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-all">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center bg-[#0080C5] text-white rounded-lg text-xs font-bold">
                                1
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-950 text-xs font-bold hover:bg-slate-50 transition-all">
                                2
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-all">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default LogAktifitasPage;
