import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
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
import AddGrupModal from '../components/modals/AddGrupModal';
import EditGrupModal from '../components/modals/EditGrupModal';
import DeleteGrupModal from '../components/modals/DeleteGrupModal';

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
            <div className="bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] p-8 min-h-[calc(100vh-160px)]">
                
                {/* Action Bar (Tambah & Cetak) */}
                <div className="flex justify-end items-center gap-3.5 mb-6">
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="h-10 px-6 bg-[#0080C5] text-white rounded-[10px] flex items-center justify-center gap-2.5 hover:bg-sky-700 transition-all shadow-sm"
                    >
                        <Plus size={18} />
                        <span className="text-xs font-semibold uppercase tracking-wider">Tambah</span>
                    </button>
                    <button className="h-10 px-6 bg-[#22C55E] text-white rounded-[10px] flex items-center justify-center gap-2.5 hover:bg-green-600 transition-all shadow-sm">
                        <Printer size={18} />
                        <span className="text-xs font-semibold uppercase tracking-wider">Cetak Data</span>
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
                                    className="w-full h-10 pl-4 pr-10 bg-white rounded-[10px] border-2 border-gray-100 appearance-none text-slate-400 text-xs font-semibold focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer"
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
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="font-['Poppins']">
                                <th className="p-4 bg-slate-50 text-[#0A0F1E] text-xs font-bold uppercase tracking-wider text-center rounded-tl-xl border-b border-gray-200 w-12">NO</th>
                                <th className="p-4 bg-slate-50 text-[#0A0F1E] text-xs font-bold uppercase tracking-wider text-left border-b border-gray-200">Grup Dampingan</th>
                                <th className="p-4 bg-slate-50 text-[#0A0F1E] text-xs font-bold uppercase tracking-wider text-center border-b border-gray-200">Bidang Dampingan</th>
                                <th className="p-4 bg-slate-50 text-[#0A0F1E] text-xs font-bold uppercase tracking-wider text-center border-b border-gray-200">Jenis Dampingan</th>
                                <th className="p-4 bg-slate-50 text-[#0A0F1E] text-xs font-bold uppercase tracking-wider text-center border-b border-gray-200">Provinsi</th>
                                <th className="p-4 bg-slate-50 text-[#0A0F1E] text-xs font-bold uppercase tracking-wider text-left border-b border-gray-200">Kabupaten</th>
                                <th className="p-4 bg-slate-50 text-[#0A0F1E] text-xs font-bold uppercase tracking-wider text-left border-b border-gray-200">Kecamatan</th>
                                <th className="p-4 bg-slate-50 text-[#0A0F1E] text-xs font-bold uppercase tracking-wider text-left border-b border-gray-200">Fasilitator</th>
                                <th className="p-4 bg-slate-50 text-[#0A0F1E] text-xs font-bold uppercase tracking-wider text-center rounded-tr-xl border-b border-gray-200 w-24">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-['Poppins']">
                            {dataGrup.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4 text-center text-slate-400 text-xs font-medium border-b border-gray-100">{index + 1}</td>
                                    <td className="p-4 text-[#0080C5] text-xs font-bold border-b border-gray-100">{item.grup}</td>
                                    <td className="p-4 text-center text-[#0A0F1E] text-xs font-medium border-b border-gray-100">{item.bidang}</td>
                                    <td className="p-4 text-center text-[#0080C5] text-xs font-bold border-b border-gray-100">{item.jenis}</td>
                                    <td className="p-4 text-center text-[#0A0F1E] text-xs font-medium border-b border-gray-100">{item.provinsi}</td>
                                    <td className="p-4 text-[#0A0F1E] text-xs font-normal border-b border-gray-100">{item.kabupaten}</td>
                                    <td className="p-4 text-[#0A0F1E] text-xs font-normal border-b border-gray-100">{item.kecamatan}</td>
                                    <td className="p-4 text-[#0A0F1E] text-xs font-normal border-b border-gray-100">
                                        <div className="flex flex-col gap-1 text-left">
                                            {item.fasilitator.map((f, i) => (
                                                <span key={i}>{i + 1}. {f}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-gray-100">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => {
                                                    setSelectedGrup(item);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="w-6 h-6 rounded-md bg-[#FB923C]/12 flex items-center justify-center text-[#FB923C] hover:bg-[#FB923C] hover:text-white transition-all"
                                            >
                                                <Edit size={12} />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setSelectedGrup(item);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="w-6 h-6 rounded-md bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
                                            >
                                                <Trash2 size={12} />
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
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0080C5] text-white text-xs font-semibold shadow-sm">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-slate-950 text-xs font-semibold hover:bg-slate-50 transition-all">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-slate-400 hover:bg-slate-50 transition-all">
                            <ChevronRight size={16} />
                        </button>
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
