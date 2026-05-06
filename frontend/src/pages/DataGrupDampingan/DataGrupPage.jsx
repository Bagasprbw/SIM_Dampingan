import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
    Search, 
    ChevronDown, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    Plus,
    Printer
} from 'lucide-react';
import AddGrupModal from '../../components/modals/AddGrupModal';
import EditGrupModal from '../../components/modals/EditGrupModal';
import DeleteGrupModal from '../../components/modals/DeleteGrupModal';

const DataGrupPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGrup, setSelectedGrup] = useState(null);

    // Dummy data sesuai gambar
    const [dataGrup] = useState([
        ...Array(10).fill({
            grup: 'Asongan',
            bidang: 'Perekonomian',
            jenis: 'Provinsi',
            provinsi: 'Daerah Istimewa Yogyakarta',
            kabupaten: 'Kota Yogyakarta',
            kecamatan: 'Kraton',
            fasilitator: ['Fasilitator 5', 'Azizah']
        })
    ]);

    return (
        <AdminLayout title="Data Grup Dampingan">
            <div className="p-8 font-['Poppins']">
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8 min-h-[calc(100vh-160px)]">
                
                {/* Action Bar (Tambah & Cetak) */}
                <div className="flex justify-end items-center gap-3.5 mb-6">
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"
                    >
                        <Plus size={18} />
                        <span>Tambah</span>
                    </button>
                    <button className="h-9 px-4 bg-[#22C55E] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-sm text-[13px] font-semibold">
                        <Printer size={18} />
                        <span>Cetak Data</span>
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="space-y-4 mb-6 text-left">
                    {/* Search Bar */}
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Cari grup dampingan, bidang, jenis..."
                            className="w-full h-11 pl-12 pr-4 bg-white rounded-[10px] border-2 border-gray-100 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all font-['Poppins']"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters Grid */}
                    <div className="grid grid-cols-5 gap-4 font-['Poppins']">
                        {['Pilih Dampingan', 'Pilih Jenis', 'Pilih Provinsi', 'Pilih Kabupaten', 'Pilih Kecamatan'].map((label, idx) => (
                            <div key={idx} className="relative group">
                                <select 
                                    defaultValue=""
                                    className="w-full h-10 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-400 text-[11px] font-semibold focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer"
                                >
                                    <option value="" disabled>{label}</option>
                                    <option value="1">Opsi 1</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5] transition-colors" size={16} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-[#F1F5F9]">
                                <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold rounded-tl-xl text-center w-12">NO</th>
                                <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Grup Dampingan</th>
                                <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold text-center">Bidang</th>
                                <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold text-center">Jenis</th>
                                <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Provinsi</th>
                                <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Kabupaten</th>
                                <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Kecamatan</th>
                                <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold">Fasilitator</th>
                                <th className="py-3 px-4 text-[#0A0F1E] text-[11px] font-semibold rounded-tr-xl text-center w-20">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {dataGrup.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-2.5 px-4 text-[#0A0F1E] text-[11px] font-semibold text-center">{index + 1}</td>
                                    <td className="py-2.5 px-4 text-[#0080C5] text-[11px] font-semibold">{item.grup}</td>
                                    <td className="py-2.5 px-4 text-center text-[#0A0F1E] text-xs font-normal">{item.bidang}</td>
                                    <td className="py-2.5 px-4 text-center text-[#0080C5] text-[11px] font-semibold">{item.jenis}</td>
                                    <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.provinsi}</td>
                                    <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.kabupaten}</td>
                                    <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">{item.kecamatan}</td>
                                    <td className="py-2.5 px-4 text-[#0A0F1E] text-xs font-normal">
                                        <div className="text-left truncate max-w-[200px]" title={item.fasilitator.join(', ')}>
                                            {item.fasilitator.join(', ')}
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 ">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button 
                                                onClick={() => {
                                                    setSelectedGrup(item);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="w-7 h-7 rounded-md bg-[#FB923C]/12 flex items-center justify-center text-[#FB923C] hover:bg-[#FB923C] hover:text-white transition-all"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setSelectedGrup(item);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="w-7 h-7 rounded-md bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6 font-['Poppins']">
                    <p className="text-slate-400 text-xs font-normal">Menampilkan 1-10 dari 15 data</p>
                    <div className="flex items-center gap-1.5">
                        <button className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50">
                            <ChevronLeft size={14} />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-md bg-[#0080C5] text-white text-[11px] font-semibold shadow-sm">1</button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-600 text-[11px] font-semibold hover:bg-slate-50 transition-all">2</button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
            </div>

            {/* Modals */}
            <AddGrupModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
            />
            <EditGrupModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                data={selectedGrup}
            />
            <DeleteGrupModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                data={selectedGrup}
            />
        </AdminLayout>
    );
};

export default DataGrupPage;
