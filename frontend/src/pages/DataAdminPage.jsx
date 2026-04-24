import React from 'react';
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
    FileText
} from 'lucide-react';
import AddAdminModal from '../components/modals/AddAdminModal';
import EditAdminModal from '../components/modals/EditAdminModal';
import DeleteAdminModal from '../components/modals/DeleteAdminModal';
import ResetPasswordModal from '../components/modals/ResetPasswordModal';

const DataAdminPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = React.useState(false);
    const [selectedAdmin, setSelectedAdmin] = React.useState(null);

    // Data dummy sesuai screenshot Figma
    const dataAdmin = Array(10).fill({
        id: 1,
        nama: 'Jawa Barat',
        username: 'prov.jawabarat',
        alamat: 'Alamat',
        telp: '089501010101',
        role: 'Admin Provinsi',
        provinsi: 'Jawa barat',
        kabupaten: 'Kabupaten',
        kecamatan: 'Kecamatan'
    });

    return (
        <AdminLayout title="Data Admin">
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
                            <button className="flex items-center gap-2.5 px-6 py-2.5 bg-[#22C55E] text-white rounded-[10px] hover:bg-[#1ba84d] transition-colors">
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
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search size={18} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Cari nama, username, alamat, no. telp..."
                                className="w-full pl-12 pr-4 py-3 bg-white rounded-[10px] border-2 border-[#F1F5F9] focus:border-[#0080C5] focus:outline-none text-xs text-[#0A0F1E] placeholder:text-slate-400 transition-all"
                            />
                        </div>

                        {/* Filter Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {['Pilih Role', 'Pilih Provinsi', 'Pilih Kecamatan', 'Pilih Kabupaten'].map((filter, idx) => (
                                <div key={idx} className="relative cursor-pointer">
                                    <div className="flex items-center justify-between px-4 py-3 bg-white rounded-[10px] border border-[#E5E7EB] hover:border-slate-300 transition-colors">
                                        <span className="text-[#9298B0] text-xs font-semibold">{filter}</span>
                                        <ChevronDown size={16} className="text-[#9298B0]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-[#F1F5F9]">
                                    <th className="p-3.5 text-[#0A0F1E] text-xs font-semibold rounded-tl-xl text-center">NO</th>
                                    <th className="p-3.5 text-[#0A0F1E] text-xs font-semibold">Nama</th>
                                    <th className="p-3.5 text-[#0A0F1E] text-xs font-semibold">Username</th>
                                    <th className="p-3.5 text-[#0A0F1E] text-xs font-semibold">Alamat</th>
                                    <th className="p-3.5 text-[#0A0F1E] text-xs font-semibold">No.Telp</th>
                                    <th className="p-3.5 text-[#0A0F1E] text-xs font-semibold">Role</th>
                                    <th className="p-3.5 text-[#0A0F1E] text-xs font-semibold">Provinsi</th>
                                    <th className="p-3.5 text-[#0A0F1E] text-xs font-semibold">Kabupaten</th>
                                    <th className="p-3.5 text-[#0A0F1E] text-xs font-semibold">Kecamatan</th>
                                    <th className="p-3.5 text-[#0A0F1E] text-xs font-semibold rounded-tr-xl text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {dataAdmin.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4 text-[#0A0F1E] text-xs font-semibold text-center">{index + 1}</td>
                                        <td className="p-4 text-[#0A0F1E] text-xs font-normal">{item.nama}</td>
                                        <td className="p-4 text-[#0A0F1E] text-xs font-normal">{item.username}</td>
                                        <td className="p-4 text-[#0A0F1E] text-xs font-normal">{item.alamat}</td>
                                        <td className="p-4 text-[#0A0F1E] text-xs font-normal">{item.telp}</td>
                                        <td className="p-4 text-[#0A0F1E] text-xs font-normal">{item.role}</td>
                                        <td className="p-4 text-[#0A0F1E] text-xs font-normal">{item.provinsi}</td>
                                        <td className="p-4 text-[#0A0F1E] text-xs font-normal">{item.kabupaten}</td>
                                        <td className="p-4 text-[#0A0F1E] text-xs font-normal">{item.kecamatan}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-1.5">
                                                {/* Edit Button (Orange #FB923C 12%) */}
                                                <button 
                                                    onClick={() => {
                                                        setSelectedAdmin(item);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="w-6 h-6 rounded-md bg-[#FB923C]/12 flex items-center justify-center text-[#FB923C] hover:bg-[#FB923C] hover:text-white transition-all"
                                                >
                                                    <Edit size={12} />
                                                </button>
                                                {/* Delete Button (Red #EF4444 10%) */}
                                                <button 
                                                    onClick={() => {
                                                        setSelectedAdmin(item);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="w-6 h-6 rounded-md bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                                {/* Lock/Reset Button (Amber #FBBF24 12%) */}
                                                <button 
                                                    onClick={() => {
                                                        setSelectedAdmin(item);
                                                        setIsResetModalOpen(true);
                                                    }}
                                                    className="w-6 h-6 rounded-md bg-[#FBBF24]/12 flex items-center justify-center text-[#FBBF24] hover:bg-[#FBBF24] hover:text-white transition-all"
                                                >
                                                    <Lock size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Section */}
                    <div className="mt-8 flex items-center justify-between">
                        <p className="text-[#9298B0] text-xs font-normal">Menampilkan 1-10 dari 15 data</p>
                        <div className="flex items-center gap-1.5">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-slate-400 hover:bg-slate-50">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0080C5] text-white text-xs font-semibold">
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

            <AddAdminModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
            />
            <EditAdminModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                data={selectedAdmin}
            />
            <DeleteAdminModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                data={selectedAdmin}
            />
            <ResetPasswordModal 
                isOpen={isResetModalOpen} 
                onClose={() => setIsResetModalOpen(false)} 
                data={selectedAdmin}
            />
        </AdminLayout>
    );
};

export default DataAdminPage;
