import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Search, ChevronDown, Check, X, Users } from 'lucide-react';
import Swal from 'sweetalert2';

const KonfirmasiAnggotaPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const dataAjuan = [
        { noAnggota: '340406030002', nama: 'Ahmad Fauzi',  gender: 'Laki-Laki',  bidang: 'Pertanian',   grup: 'Kelompok Josjis', tglAjuan: '10 April 1945' },
        { noAnggota: '340406040004', nama: 'Siti Aminah',  gender: 'Perempuan',   bidang: 'Perternakan', grup: 'Kelompok Josjis', tglAjuan: '10 April 1945' },
        ...Array(6).fill({
            noAnggota: '340406030002', nama: 'Ahmad Fauzi', gender: 'Laki-Laki', bidang: 'Pertanian', grup: 'Kelompok Josjis', tglAjuan: '10 April 1945'
        }),
    ];

    const filtered = dataAjuan.filter(
        (d) => d.nama.toLowerCase().includes(searchTerm.toLowerCase()) || d.noAnggota.includes(searchTerm)
    );

    const handleApprove = (nama) => {
        Swal.fire({
            title: 'Konfirmasi Persetujuan',
            text: `Anda akan menyetujui ajuan dari ${nama}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10B981',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Ya, Setujui!',
            cancelButtonText: 'Batal',
            customClass: { popup: 'rounded-2xl font-["Poppins"]' }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({ title: 'Disetujui!', text: `Ajuan ${nama} telah disetujui.`, icon: 'success', confirmButtonColor: '#10B981', timer: 1800, showConfirmButton: false, customClass: { popup: 'rounded-2xl font-["Poppins"]' } });
            }
        });
    };

    const handleReject = (nama) => {
        Swal.fire({
            title: 'Tolak Ajuan?',
            text: `Anda akan menolak ajuan dari ${nama}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Ya, Tolak!',
            cancelButtonText: 'Batal',
            customClass: { popup: 'rounded-2xl font-["Poppins"]' }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({ title: 'Ditolak!', text: `Ajuan ${nama} telah ditolak.`, icon: 'error', confirmButtonColor: '#EF4444', timer: 1800, showConfirmButton: false, customClass: { popup: 'rounded-2xl font-["Poppins"]' } });
            }
        });
    };

    return (
        <AdminLayout title="Konfirmasi Anggota">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-blue-50 text-[#0080C5] rounded-xl flex items-center justify-center">
                                <Users size={18} />
                            </div>
                            <h2 className="text-[#0A0F1E] text-base font-bold tracking-tight">Daftar Ajuan Anggota</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="Cari kegiatan..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium w-52 focus:outline-none focus:border-[#0080C5] transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all">
                                <span className="text-xs font-medium text-slate-600">Semua Bidang</span>
                                <ChevronDown size={14} className="text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">NO.ANGGOTA</th>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">NAMA</th>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">JENIS KELAMIN</th>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">BIDANG</th>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">GRUP DAMPINGAN</th>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">TGL AJUAN</th>
                                    <th className="py-3 px-4 text-center text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">AKSI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4 px-4 text-[#0A0F1E] text-xs font-semibold">{item.noAnggota}</td>
                                        <td className="py-4 px-4 text-[#0A0F1E] text-xs font-bold">{item.nama}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${item.gender === 'Laki-Laki' ? 'bg-[#0080C5]' : 'bg-[#D52BCA]'}`} />
                                                <span className="text-[#0A0F1E] text-xs font-semibold">{item.gender}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-[#0A0F1E] text-xs font-bold">{item.bidang}</td>
                                        <td className="py-4 px-4 text-[#9298B0] text-xs font-medium">{item.grup}</td>
                                        <td className="py-4 px-4 text-[#9298B0] text-xs font-medium">{item.tglAjuan}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleApprove(item.nama)}
                                                    className="w-7 h-7 bg-[#10B981]/10 text-[#10B981] rounded-lg flex items-center justify-center hover:bg-[#10B981] hover:text-white transition-all"
                                                >
                                                    <Check size={13} strokeWidth={3} />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(item.nama)}
                                                    className="w-7 h-7 bg-[#EF4444]/10 text-[#EF4444] rounded-lg flex items-center justify-center hover:bg-[#EF4444] hover:text-white transition-all"
                                                >
                                                    <X size={13} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                        <p className="text-slate-400 text-xs font-normal">
                            Menampilkan <span className="font-bold text-slate-950">{filtered.length}</span> dari <span className="font-bold text-slate-950">{dataAjuan.length}</span> Ajuan
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default KonfirmasiAnggotaPage;
