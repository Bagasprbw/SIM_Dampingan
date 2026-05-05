import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { LayoutGrid } from 'lucide-react';

const KelolaDampinganPage = () => {
    const dataGrup = [
        {
            namaGrup: 'Kelompok Tani Makmur',
            anggota: 15,
            bidang: 'Pertanian Terpadu',
            provinsi: 'D.I. Yogyakarta',
            kabupaten: 'Bantul',
            kecamatan: 'Piyungan',
        },
        {
            namaGrup: 'Kelompok Josjis',
            anggota: 12,
            bidang: 'Peternakan',
            provinsi: 'Jawa Tengah',
            kabupaten: 'Magelang',
            kecamatan: 'Mertoyudan',
        },
    ];

    return (
        <AdminLayout title="Kelola Dampingan">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200">

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 bg-blue-50 text-[#0080C5] rounded-xl flex items-center justify-center">
                            <LayoutGrid size={18} />
                        </div>
                        <h2 className="text-[#0A0F1E] text-base font-bold tracking-tight">Daftar Grup Dampingan</h2>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">NAMA GRUP</th>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">BIDANG DAMPINGAN</th>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">PROVINSI</th>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">KABUPATEN</th>
                                    <th className="py-3 px-4 text-left text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">KECAMATAN</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {dataGrup.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-5 px-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[#0A0F1E] text-sm font-bold">{item.namaGrup}</span>
                                                <span className="text-[#9298B0] text-xs font-normal">{item.anggota} anggota</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-4 text-[#0A0F1E] text-xs font-bold">{item.bidang}</td>
                                        <td className="py-5 px-4 text-[#9298B0] text-xs font-medium">{item.provinsi}</td>
                                        <td className="py-5 px-4 text-[#9298B0] text-xs font-medium">{item.kabupaten}</td>
                                        <td className="py-5 px-4 text-[#9298B0] text-xs font-medium">{item.kecamatan}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                        <p className="text-slate-400 text-xs font-normal">
                            Menampilkan <span className="font-bold text-slate-950">{dataGrup.length}</span> Grup Dampingan
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default KelolaDampinganPage;
