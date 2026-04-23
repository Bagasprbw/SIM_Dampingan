import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { 
    Search, 
    ChevronDown, 
    Edit,
    Trash2, 
    Lock, 
    ChevronLeft, 
    ChevronRight,
    FileText,
    Printer
} from 'lucide-react';

import EditPjModal from '../components/modals/EditPjModal';
import DeletePjModal from '../components/modals/DeletePjModal';
import ResetPjPasswordModal from '../components/modals/ResetPjPasswordModal';
import PjDetailModal from '../components/modals/PjDetailModal';

const DataPjPage = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPj, setSelectedPj] = useState(null);

    // Data dummy sesuai screenshot Figma
    const dataPj = Array(10).fill({
        nama: "Anindhia Salsabila",
        username: "anindhia.salsa",
        grup: "Srawung Batik Laweyan"
    });

    return (
        <AdminLayout title="Data PJ Dampingan">
            <div className="p-8 font-['Poppins']">
                {/* Main Card Container - Shadow/Size synced with Facilitator */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
                    
                    {/* Header Action Row */}
                    <div className="flex justify-end items-center mb-6">
                        <button className="flex items-center gap-2.5 px-6 py-2.5 bg-[#22C55E] text-white rounded-[10px] hover:bg-green-600 transition-colors text-left">
                            <FileText size={18} />
                            <span className="text-xs font-semibold">Cetak Data</span>
                            <ChevronDown size={16} />
                        </button>
                    </div>

                    {/* Filter & Search Section - Reverted to PJ Figma Layout (Single Row) */}
                    <div className="flex items-center gap-5 mb-6 text-left">
                        <div className="flex-1 relative text-left">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                                <Search size={18} />
                            </div>
                            <input 
                                type="text" 
                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#F1F5F9] rounded-[10px] focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-400 transition-all text-left"
                                placeholder="Cari nama, username, grup dampingan..."
                            />
                        </div>
                        <div className="relative min-w-[260px] text-left">
                            <div className="flex items-center justify-between px-4 py-3 bg-white rounded-[10px] border border-[#E5E7EB] hover:border-slate-300 transition-colors cursor-pointer group text-left">
                                <span className="text-[#9298B0] text-xs font-semibold text-left">Pilih Bidang Dampingan</span>
                                <ChevronDown size={16} className="text-[#9298B0]" />
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-x-auto text-left">
                        <table className="w-full text-left border-collapse text-left">
                            <thead>
                                <tr className="bg-slate-100 border-b-2 border-slate-100 text-left">
                                    <th className="p-4 text-xs font-bold text-[#0A0F1E] uppercase tracking-wider rounded-tl-xl w-12 text-center text-left">No</th>
                                    <th className="p-4 text-xs font-bold text-[#0A0F1E] uppercase tracking-wider text-left">Nama</th>
                                    <th className="p-4 text-xs font-bold text-[#0A0F1E] uppercase tracking-wider text-left">Username</th>
                                    <th className="p-4 text-xs font-bold text-[#0A0F1E] uppercase tracking-wider text-left">Grup Dampingan</th>
                                    <th className="p-4 text-xs font-bold text-[#0A0F1E] uppercase tracking-wider text-center w-32">Aksi</th>
                                    <th className="p-4 text-xs font-bold text-[#0A0F1E] uppercase tracking-wider text-center rounded-tr-xl w-24">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-left">
                                {dataPj.map((item, index) => (
                                    <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 text-center border-b border-[#F1F5F9] text-[#9298B0] text-xs font-medium">{index + 1}</td>
                                        <td className="p-4 border-b border-[#F1F5F9] text-[#0080C5] text-xs font-medium text-left">{item.nama}</td>
                                        <td className="p-4 border-b border-[#F1F5F9] text-[#0080C5] text-xs font-normal text-left">{item.username}</td>
                                        <td className="p-4 border-b border-[#F1F5F9] text-[#0A0F1E] text-xs font-normal text-left">{item.grup}</td>
                                        <td className="p-4 border-b border-[#F1F5F9]">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Edit Action - Orange #FB923C (12%) */}
                                                <button 
                                                    onClick={() => {
                                                        setSelectedPj(item);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="w-6 h-6 rounded-md bg-[#FB923C]/12 flex items-center justify-center text-[#FB923C] hover:bg-[#FB923C] hover:text-white transition-all"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                {/* Delete Action - Red #EF4444 (10%) */}
                                                <button 
                                                    onClick={() => {
                                                        setSelectedPj(item);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="w-6 h-6 rounded-md bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                {/* Reset Password - Amber #FBBF24 (12%) */}
                                                <button 
                                                    onClick={() => {
                                                        setSelectedPj(item);
                                                        setIsResetModalOpen(true);
                                                    }}
                                                    className="w-6 h-6 rounded-md bg-[#FBBF24]/12 flex items-center justify-center text-[#FBBF24] hover:bg-[#FBBF24] hover:text-white transition-all"
                                                >
                                                    <Lock size={14} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center border-b border-[#F1F5F9]">
                                            <button 
                                                onClick={() => {
                                                    setSelectedPj(item);
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
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-[#9298B0] text-xs font-normal">Menampilkan 1-10 dari 15 data</span>
                        <div className="flex items-center gap-1">
                            <button className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#9298B0] hover:bg-gray-50">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="w-8 h-8 rounded-lg bg-[#0080C5] flex items-center justify-center text-white text-xs font-semibold">1</button>
                            <button className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#0A0F1E] text-xs font-semibold hover:bg-gray-50">2</button>
                            <button className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#9298B0] hover:bg-gray-50">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modals */}
            <EditPjModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                data={selectedPj}
            />
            <DeletePjModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                data={selectedPj}
            />
            <ResetPjPasswordModal 
                isOpen={isResetModalOpen} 
                onClose={() => setIsResetModalOpen(false)} 
                data={selectedPj}
            />
            <PjDetailModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
                data={selectedPj}
            />
        </AdminLayout>
    );
};

export default DataPjPage;
