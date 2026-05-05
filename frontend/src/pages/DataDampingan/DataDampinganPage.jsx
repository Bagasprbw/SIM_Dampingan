import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import AddDampinganModal from '../../components/modals/AddDampinganModal';
import EditDampinganModal from '../../components/modals/EditDampinganModal';
import DeleteDampinganModal from '../../components/modals/DeleteDampinganModal';
import DetailDampinganModal from '../../components/modals/DetailDampinganModal';
import { 
    Search, 
    ChevronDown, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    Plus,
    Printer,
    FileDown
} from 'lucide-react';

const DataDampinganPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const handleEdit = (item) => {
        setSelectedData(item);
        setIsEditModalOpen(true);
    };

    const handleDelete = (item) => {
        setSelectedData(item);
        setIsDeleteModalOpen(true);
    };

    const handleDetail = (item) => {
        setSelectedData(item);
        setIsDetailModalOpen(true);
    };

    const dataDampingan = [
        ...Array(10).fill({
            noAnggota: '340406030002',
            nama: 'Agil Lensana',
            gender: 'Perempuan',
            alamat: 'Munggur 004/- Sitimulyo, Piyungan, Bantul',
            bidang: 'Pertanian Terpadu',
            grup: 'MARDIKO'
        })
    ];

    return (
        <AdminLayout title="Data Dampingan">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                
                {/* Unified Card Container */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E7EB]">
                    
                    {/* Row 1: Action Buttons (Top Right) */}
                    <div className="flex justify-end items-center gap-3 mb-6">
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"
                        >
                            <Plus size={18} />
                            <span>Tambah</span>
                        </button>
                        <button className="h-9 px-4 bg-[#22C55E] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-sm text-[13px] font-semibold">
                            <FileDown size={18} />
                            <span>Cetak Data</span>
                            <ChevronDown size={18} />
                        </button>
                    </div>

                    {/* Row 2: Search Bar (Full Width) */}
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Cari nama, no.anggota, alamat..."
                            className="w-full h-12 pl-12 pr-4 bg-white rounded-xl border border-gray-200 focus:border-[#0080C5] focus:outline-none text-sm text-[#9298B0] font-medium transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9298B0]" size={20} />
                    </div>

                    {/* Row 3: Filters Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                        <div className="relative group">
                            <select className="w-full h-12 pl-4 pr-10 bg-white rounded-xl border border-gray-200 appearance-none text-[#9298B0] text-sm font-semibold focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9298B0] pointer-events-none" size={18} />
                        </div>
                        <div className="relative group">
                            <select className="w-full h-12 pl-4 pr-10 bg-white rounded-xl border border-gray-200 appearance-none text-[#9298B0] text-sm font-semibold focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                <option value="">Pilih Bidang Dampingan</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9298B0] pointer-events-none" size={18} />
                        </div>
                        <div className="relative group">
                            <select className="w-full h-12 pl-4 pr-10 bg-white rounded-xl border border-gray-200 appearance-none text-[#9298B0] text-sm font-semibold focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer">
                                <option value="">Pilih Grup Dampingan</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9298B0] pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Row 4: Table Content with Gray Header */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 bg-[#F8FAFC] text-center text-slate-900 text-[11px] font-semibold border-y border-l border-slate-100 rounded-tl-xl whitespace-nowrap">NO.Anggota</th>
                                    <th className="py-3 px-4 bg-[#F8FAFC] text-left text-slate-900 text-[11px] font-semibold border-y border-slate-100 whitespace-nowrap">Nama</th>
                                    <th className="py-3 px-4 bg-[#F8FAFC] text-center text-slate-900 text-[11px] font-semibold border-y border-slate-100 whitespace-nowrap">Jenis Kelamin</th>
                                    <th className="py-3 px-4 bg-[#F8FAFC] text-left text-slate-900 text-[11px] font-semibold border-y border-slate-100 whitespace-nowrap">Alamat</th>
                                    <th className="py-3 px-4 bg-[#F8FAFC] text-center text-slate-900 text-[11px] font-semibold border-y border-slate-100 leading-tight whitespace-nowrap">Bidang Dampingan</th>
                                    <th className="py-3 px-4 bg-[#F8FAFC] text-center text-slate-900 text-[11px] font-semibold border-y border-slate-100 leading-tight whitespace-nowrap">Grup Dampingan</th>
                                    <th className="py-3 px-4 bg-[#F8FAFC] text-center text-slate-900 text-[11px] font-semibold border-y border-slate-100 whitespace-nowrap">Aksi</th>
                                    <th className="py-3 px-4 bg-[#F8FAFC] text-center text-slate-900 text-[11px] font-semibold border-y border-r border-slate-100 rounded-tr-xl whitespace-nowrap">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F2F8]">
                                {dataDampingan.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-2.5 px-4 text-center text-[#9298B0] text-[12px] font-medium border-x-0">{item.noAnggota}</td>
                                        <td className="py-2.5 px-4 text-left border-x-0">
                                            <span className="text-[#0080C5] text-[12px] font-bold hover:underline cursor-pointer">{item.nama}</span>
                                        </td>
                                        <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-[12px] font-normal border-x-0">{item.gender}</td>
                                        <td className="py-2.5 px-4 text-left text-[#0A0F1E] text-[12px] font-normal max-w-[220px] leading-relaxed border-x-0">
                                            {item.alamat}
                                        </td>
                                        <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-[12px] font-normal border-x-0">{item.bidang}</td>
                                        <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-[12px] font-normal border-x-0">{item.grup}</td>
                                        <td className="py-2.5 px-4 border-x-0 text-center">
                                            <div className="flex items-center justify-center gap-2.5">
                                                <button onClick={() => handleEdit(item)} className="w-7 h-7 flex items-center justify-center bg-[#FB923C]/12 text-[#FB923C] rounded-md hover:bg-[#FB923C] hover:text-white transition-all shadow-sm">
                                                    <Edit size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(item)} className="w-7 h-7 flex items-center justify-center bg-[#EF4444]/10 text-[#EF4444] rounded-md hover:bg-[#EF4444] hover:text-white transition-all shadow-sm">
                                                    <Trash2 size={14} />
                                                </button>
                                                <button className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold">
                                                    <Printer size={14} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-center border-x-0">
                                            <button 
                                                onClick={() => handleDetail(item)}
                                                className="h-7 px-3 bg-[#0080C5]/10 text-[#0080C5] rounded-md flex items-center justify-center hover:bg-[#0080C5] hover:text-white transition-all text-[11px] font-bold mx-auto"
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
                    <div className="mt-8 flex items-center justify-between">
                        <span className="text-[#9298B0] text-[11px] font-medium">Menampilkan 1-10 dari 15 data</span>
                        <div className="flex items-center gap-3">
                            <button className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all"><ChevronLeft size={14} /></button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-md bg-[#0080C5] text-white text-[11px] font-semibold shadow-sm">1</button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-600 text-[11px] font-semibold hover:bg-slate-50 transition-all">2</button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all"><ChevronRight size={14} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddDampinganModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <EditDampinganModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} data={selectedData} />
            <DeleteDampinganModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} data={selectedData} />
            <DetailDampinganModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} data={selectedData} />
        </AdminLayout>
    );
};

export default DataDampinganPage;
