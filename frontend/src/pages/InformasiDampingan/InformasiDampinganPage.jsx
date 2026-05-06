import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
    Search, 
    Printer,
    Users,
    MapPin,
    Leaf,
    User,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import DetailDampinganModal from '../../components/modals/DetailDampinganModal';

const InformasiDampinganPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const dataAnggota = [
        { noAnggota: '340406030001', nama: 'Agil Lensana', gender: 'Perempuan', alamat: 'Munggur 004/- Sitimulyo, Piyungan, Bantul' },
        { noAnggota: '340406030002', nama: 'Budi Santoso', gender: 'Laki-laki', alamat: 'Munggur 004/- Sitimulyo, Piyungan, Bantul' },
        { noAnggota: '340406030003', nama: 'Siti Rahma', gender: 'Perempuan', alamat: 'Munggur 004/- Sitimulyo, Piyungan, Bantul' },
        { noAnggota: '340406030004', nama: 'Ahmad Fauzi', gender: 'Laki-laki', alamat: 'Munggur 004/- Sitimulyo, Piyungan, Bantul' },
        { noAnggota: '340406030005', nama: 'Dewi Lestari', gender: 'Perempuan', alamat: 'Munggur 004/- Sitimulyo, Piyungan, Bantul' },
        { noAnggota: '340406030006', nama: 'Rudi Hartono', gender: 'Laki-laki', alamat: 'Munggur 004/- Sitimulyo, Piyungan, Bantul' },
        { noAnggota: '340406030007', nama: 'Nur Hidayah', gender: 'Perempuan', alamat: 'Munggur 004/- Sitimulyo, Piyungan, Bantul' },
        { noAnggota: '340406030008', nama: 'Eko Prasetyo', gender: 'Laki-laki', alamat: 'Munggur 004/- Sitimulyo, Piyungan, Bantul' },
        { noAnggota: '340406030009', nama: 'Fitri Andriani', gender: 'Perempuan', alamat: 'Munggur 004/- Sitimulyo, Piyungan, Bantul' },
    ];

    const handleDetail = (item) => {
        setSelectedData(item);
        setIsDetailOpen(true);
    };

    return (
        <AdminLayout title="Informasi Dampingan">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                
                {/* Header Card (Kelompok Info) */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200 mb-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-[#0080C5] rounded-xl flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-[#0A0F1E] text-lg font-bold tracking-tight">Kelompok Tani Makmur</h2>
                                <p className="text-[#0080C5] text-[11px] font-semibold">Grup Dampingan</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
                                    <Leaf size={16} className="text-[#10B981]" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">BIDANG DAMPINGAN</span>
                                    <span className="text-[#0A0F1E] text-sm font-bold">Pertanian Terpadu</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#FFF7ED] flex items-center justify-center shrink-0">
                                    <MapPin size={16} className="text-[#F59E0B]" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">ALAMAT DAMPINGAN</span>
                                    <span className="text-[#0A0F1E] text-sm font-bold">Bantul, D.I. Yogyakarta</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                    <User size={16} className="text-[#0080C5]" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">FASILITATOR</span>
                                    <span className="text-[#0A0F1E] text-sm font-bold">Siti Aminah</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200">
                    
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Cari nama, no.anggota, alamat..." 
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0080C5] transition-all text-slate-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border-spacing-0">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-4 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">NO. ANGGOTA</th>
                                    <th className="py-4 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">NAMA</th>
                                    <th className="py-4 px-4 text-center text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">JENIS KELAMIN</th>
                                    <th className="py-4 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">ALAMAT</th>
                                    <th className="py-4 px-4 text-center text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">AKSI</th>
                                    <th className="py-4 px-4 text-center text-[#6B7280] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">DETAIL</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F2F8]">
                                {dataAnggota.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-4 text-[#0080C5] text-[11px] font-semibold whitespace-nowrap">{item.noAnggota}</td>
                                        <td className="py-4 px-4 text-left whitespace-nowrap">
                                            <span className="text-[#0A0F1E] text-[11px] font-bold">{item.nama}</span>
                                        </td>
                                        <td className="py-4 px-4 text-center whitespace-nowrap">
                                            <div className={`inline-flex items-center px-3 py-1 rounded-full ${item.gender === 'Laki-laki' ? 'bg-blue-50 text-[#0080C5]' : 'bg-pink-50 text-pink-500'} text-[10px] font-bold`}>
                                                {item.gender}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-left text-[#6B7280] text-[11px] font-medium">{item.alamat}</td>
                                        <td className="py-4 px-4 text-center">
                                            <button className="text-[#0080C5] hover:text-[#006da8] transition-colors">
                                                <Printer size={18} />
                                            </button>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <button 
                                                onClick={() => handleDetail(item)}
                                                className="h-8 px-4 bg-[#0080C5] text-white rounded-lg inline-flex items-center justify-center hover:bg-sky-700 transition-all shadow-sm text-[11px] font-semibold"
                                            >
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-between items-center">
                        <span className="text-[#9298B0] text-[11px] font-medium">Menampilkan 1-9 dari 15 data</span>
                        <div className="flex items-center gap-2">
                            <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-all">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="w-8 h-8 bg-[#0080C5] text-white rounded-lg flex items-center justify-center text-[11px] font-bold shadow-sm">
                                1
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-600 text-[11px] font-bold hover:bg-slate-50 transition-all">
                                2
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-all">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Modals */}
                <DetailDampinganModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} data={selectedData} />
            </div>
        </AdminLayout>
    );
};

export default InformasiDampinganPage;
