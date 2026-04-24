import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { 
    Plus, 
    Printer, 
    Search, 
    ChevronDown, 
    ChevronLeft, 
    ChevronRight,
    Edit,
    Trash2,
    Lock,
    Settings,
    Eye,
    FileText
} from 'lucide-react';
import AddFacilitatorModal from '../components/modals/AddFacilitatorModal';
import EditFacilitatorModal from '../components/modals/EditFacilitatorModal';
import DeleteFacilitatorModal from '../components/modals/DeleteFacilitatorModal';
import ResetFacilitatorPasswordModal from '../components/modals/ResetFacilitatorPasswordModal';
import FacilitatorDetailModal from '../components/modals/FacilitatorDetailModal';
import ManageBidangModal from '../components/modals/ManageBidangModal';

const DataFasilitatorPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isManageBidangOpen, setIsManageBidangOpen] = useState(false);
    const [selectedFasilitator, setSelectedFasilitator] = useState(null);

    // Data dummy sesuai screenshot Figma
    const dataFasilitator = Array(10).fill({
        id: 1,
        nama: "Anindhia Salsabila",
        username: "anindhia.salsa",
        bidang: "Perekonomian, Buruh",
        grup: "Srawung Batik Laweyan, KOKAP"
    });

    return (
        <AdminLayout title="Data Fasilitator">
            <div className="p-8 font-['Poppins']">
                {/* Main Card Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
                    
                    {/* Top Action Buttons */}
                    <div className="flex justify-end items-center gap-3.5 mb-6">
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2.5 px-6 py-2.5 bg-[#0080C5] text-white rounded-[10px] hover:bg-[#006da8] transition-colors"
                        >
                            <Plus size={18} strokeWidth={3} />
                            <span className="text-xs font-semibold">Tambah</span>
                        </button>
                        <div className="relative group">
                            <button className="flex items-center gap-2.5 px-6 py-2.5 bg-[#22C55E] text-white rounded-[10px] hover:bg-green-600 transition-colors">
                                <FileText size={18} />
                                <span className="text-xs font-semibold">Cetak Data</span>
                                <ChevronDown size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="space-y-6 mb-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                                <Search size={18} />
                            </div>
                            <input 
                                type="text" 
                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#F1F5F9] rounded-[10px] focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-400 transition-all"
                                placeholder="Cari nama, username, bidang, grup dampingan..."
                            />
                        </div>

                        {/* Filter & Sub-Action Row */}
                        <div className="flex items-center gap-3">
                            <div className="relative min-w-[260px]">
                                <div className="flex items-center justify-between px-4 py-3 bg-white rounded-[10px] border border-[#E5E7EB] hover:border-slate-300 transition-colors cursor-pointer group text-left">
                                    <span className="text-[#9298B0] text-xs font-semibold">Pilih Bidang Dampingan</span>
                                    <ChevronDown size={16} className="text-[#9298B0]" />
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsManageBidangOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-[#0080C5] text-white rounded-[10px] hover:bg-[#006da8] transition-colors"
                            >
                                <Settings size={18} />
                                <span className="text-xs font-semibold">Kelola Bidang</span>
                            </button>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100 border-b-2 border-slate-100">
                                    <th className="p-4 text-xs font-bold text-[#0A0F1E] uppercase tracking-wider rounded-tl-xl w-12 text-center">NO</th>
                                    <th className="p-4 text-xs font-bold text-[#0A0F1E] uppercase tracking-wider min-w-[150px]">Nama</th>
                                    <th className="p-4 text-xs font-bold text-[#0A0F1E] uppercase tracking-wider min-w-[150px]">Username</th>
                                    <th className="p-4 text-xs font-bold text-[#0A0F1E] uppercase tracking-wider min-w-[180px]">Bidang Dampingan</th>
                                    <th className="p-4 text-xs font-bold text-[#0A0F1E] uppercase tracking-wider min-w-[250px]">Grup Dampingan</th>
                                    <th className="p-4 text-xs font-bold text-[#0A0F1E] uppercase tracking-wider text-center w-28">Aksi</th>
                                    <th className="p-4 text-xs font-bold text-[#0A0F1E] uppercase tracking-wider text-center rounded-tr-xl w-24">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {dataFasilitator.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                                        <td className="p-4 text-xs text-slate-400 font-medium text-center">{index + 1}</td>
                                        <td className="p-4 text-xs text-[#0080C5] font-semibold">{item.nama}</td>
                                        <td className="p-4 text-xs text-[#0080C5] font-normal">{item.username}</td>
                                        <td className="p-4 text-xs text-[#0A0F1E] font-normal">{item.bidang}</td>
                                        <td className="p-4 text-xs text-[#0A0F1E] font-normal">{item.grup}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedFasilitator(item);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="w-6 h-6 rounded-md bg-[#FB923C]/10 flex items-center justify-center text-[#FB923C] hover:bg-[#FB923C] hover:text-white transition-all"
                                                >
                                                    <Edit size={12} />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedFasilitator(item);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="w-6 h-6 rounded-md bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedFasilitator(item);
                                                        setIsResetModalOpen(true);
                                                    }}
                                                    className="w-6 h-6 rounded-md bg-[#FBBF24]/10 flex items-center justify-center text-[#FBBF24] hover:bg-[#FBBF24] hover:text-white transition-all"
                                                >
                                                    <Lock size={12} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => {
                                                    setSelectedFasilitator(item);
                                                    setIsDetailModalOpen(true);
                                                }}
                                                className="px-4 py-2 bg-[#0080C5] text-white text-[10px] font-bold rounded-lg hover:bg-[#006da8] transition-all"
                                            >
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Section */}
                    <div className="mt-8 flex items-center justify-between">
                        <p className="text-slate-400 text-xs font-normal">Menampilkan 1-10 dari 15 data</p>
                        <div className="flex items-center gap-1.5">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-slate-400 hover:bg-slate-50">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0080C5] text-white text-xs font-semibold shadow-md shadow-blue-100">
                                1
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#0A0F1E] text-xs font-semibold hover:bg-slate-50">
                                2
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-slate-400 hover:bg-slate-50">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AddFacilitatorModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
            />
            <EditFacilitatorModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                data={selectedFasilitator}
            />
            <DeleteFacilitatorModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                data={selectedFasilitator}
            />
            <ResetFacilitatorPasswordModal 
                isOpen={isResetModalOpen} 
                onClose={() => setIsResetModalOpen(false)} 
                data={selectedFasilitator}
            />
            <FacilitatorDetailModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
                data={selectedFasilitator}
            />
            <ManageBidangModal 
                isOpen={isManageBidangOpen} 
                onClose={() => setIsManageBidangOpen(false)} 
            />
        </AdminLayout>
    );
};

export default DataFasilitatorPage;
