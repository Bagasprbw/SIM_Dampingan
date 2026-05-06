import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
    RotateCcw, 
    Save, 
    User, 
    UserCheck, 
    Users, 
    Globe, 
    Info,
    LayoutDashboard,
    Database,
    Map
} from 'lucide-react';
import Swal from 'sweetalert2';

const Toggle = ({ enabled, onChange, colorClass = "bg-[#0080C5]" }) => (
    <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? colorClass : 'bg-gray-200'}`}
    >
        <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
        />
    </button>
);

const KelolaHakAksesPage = () => {
    const [access, setAccess] = useState({
        admin: {
            fasilitator: true,
            adminBawahan: true,
            masyarakat: true,
            grup: true
        },
        fasilitator: {
            crudLaporan: true,
            validasiWarga: true
        },
        pj: {
            pendaftaranWarga: true
        },
        global: {
            dashboard: { admin: true, fasilitator: true, pj: true },
            dataAdmin: { admin: true, fasilitator: true, pj: true },
            dataMasyarakat: { admin: true, fasilitator: true, pj: true },
            peta: { admin: true, fasilitator: true, pj: true }
        }
    });

    const handleSave = () => {
        Swal.fire({
            html: `
                <div class="flex flex-col items-center py-4 px-4">
                    <div class="w-24 h-24 bg-gradient-to-b from-[#00C878]/20 to-[#00C878]/5 rounded-[48px] border border-[#00B96E] flex items-center justify-center mb-8">
                        <div class="w-20 h-20 bg-[#00B96E] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#00B96E]/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <h2 class="text-[#0A0F1E] text-2xl font-bold tracking-tight">Perubahan Berhasil!</h2>
                        <p class="text-[#636364] text-base font-normal">Perubahan Telah Disimpan</p>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            timer: 2000,
            width: '460px',
            customClass: {
                popup: 'rounded-[48px] p-12 font-["Poppins"] shadow-2xl',
            }
        });
    };

    const handleReset = () => {
        Swal.fire({
            html: `
                <div class="flex flex-col items-center py-4 px-4">
                    <div class="w-24 h-24 bg-gradient-to-b from-[#00C878]/20 to-[#00C878]/5 rounded-[48px] border border-[#00B96E] flex items-center justify-center mb-8">
                        <div class="w-20 h-20 bg-[#00B96E] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#00B96E]/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <h2 class="text-[#0A0F1E] text-2xl font-bold tracking-tight">Reset Berhasil!</h2>
                        <p class="text-[#636364] text-base font-normal">Fitur Di Reset Ke Setelan Awal</p>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            timer: 2000,
            width: '460px',
            customClass: {
                popup: 'rounded-[48px] p-12 font-["Poppins"] shadow-2xl',
            }
        });
    };

    return (
        <AdminLayout title="Kelola Hak Akses">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                
                {/* Header Section */}
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <h2 className="text-base font-bold text-slate-950 tracking-tight">Konfigurasi Fitur per Role</h2>
                        <p className="text-xs text-slate-400 font-normal">Gunakan toggle untuk mengaktifkan atau menonaktifkan fitur pada setiap role.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleReset}
                            className="h-10 px-5 bg-white border border-gray-200 rounded-xl text-[#0080C5] text-[11px] font-semibold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <RotateCcw size={16} />
                            Reset Default
                        </button>
                        <button 
                            onClick={handleSave}
                            className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold"
                        >
                            <Save size={16} />
                            Simpan Perubahan
                        </button>
                    </div>
                </div>

                {/* 1. Role Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Role Admin */}
                    <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm space-y-7">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-[#0080C5]">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-950">Role Admin</h3>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Provinsi - Kabupaten - Kecamatan</p>
                            </div>
                        </div>
                        <div className="space-y-5">
                            {[
                                { id: 'fasilitator', label: 'Kelola Data Fasilitator', desc: 'Hanya menampilkan fasilitator di wilayah bawahnya' },
                                { id: 'adminBawahan', label: 'Kelola Data Admin Bawahan', desc: 'Khusus Provinsi & Kabupaten' },
                                { id: 'masyarakat', label: 'Kelola Data Masyarakat', desc: 'Sesuai wilayah tanggung jawab' },
                                { id: 'grup', label: 'Kelola Grup Dampingan', desc: 'Sesuai wilayah tanggung jawab' }
                            ].map(item => (
                                <div key={item.id} className="flex items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-semibold text-slate-800">{item.label}</p>
                                        <p className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                    <Toggle 
                                        enabled={access.admin[item.id]} 
                                        onChange={() => setAccess({...access, admin: {...access.admin, [item.id]: !access.admin[item.id]}})}
                                        colorClass="bg-[#0080C5]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Role Fasilitator */}
                    <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm space-y-7">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#EA580C]">
                                <UserCheck size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-950">Role Fasilitator</h3>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Pengelola Lapangan & Validasi</p>
                            </div>
                        </div>
                        <div className="space-y-5">
                            {[
                                { id: 'crudLaporan', label: 'CRUD Laporan Kegiatan', desc: 'Tambah, ubah, dan hapus laporan yang dibuat' },
                                { id: 'validasiWarga', label: 'Validasi Warga Baru', desc: 'Setujui atau tolak pengajuan pendaftaran warga baru' }
                            ].map(item => (
                                <div key={item.id} className="flex items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-semibold text-slate-800">{item.label}</p>
                                        <p className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                    <Toggle 
                                        enabled={access.fasilitator[item.id]} 
                                        onChange={() => setAccess({...access, fasilitator: {...access.fasilitator, [item.id]: !access.fasilitator[item.id]}})}
                                        colorClass="bg-[#EA580C]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Role PJ Dampingan */}
                    <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm space-y-7">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-[#6366F1]">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-950">Role PJ Dampingan</h3>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Pengurus Anggota Grup</p>
                            </div>
                        </div>
                        <div className="space-y-5">
                            {[
                                { id: 'pendaftaranWarga', label: 'Pendaftaran Warga Baru', desc: 'Input formulir calon warga untuk divalidasi Fasilitator' }
                            ].map(item => (
                                <div key={item.id} className="flex items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-semibold text-slate-800">{item.label}</p>
                                        <p className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                    <Toggle 
                                        enabled={access.pj[item.id]} 
                                        onChange={() => setAccess({...access, pj: {...access.pj, [item.id]: !access.pj[item.id]}})}
                                        colorClass="bg-[#6366F1]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Fitur Global Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-4 flex items-center gap-4 border-b border-gray-50">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-gray-100">
                            <Globe size={20} />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-sm font-bold text-slate-950">Fitur Global</h3>
                            <p className="text-[10px] text-slate-400 font-normal">Dapat dikonfigurasi per role secara individual</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#FAFBFD]">
                                    <th className="py-4 px-8 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest w-[45%]">FITUR</th>
                                    <th className="py-4 px-6 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#0080C5]"></div>
                                            ADMIN
                                        </div>
                                    </th>
                                    <th className="py-4 px-6 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#EA580C]"></div>
                                            FASILITATOR
                                        </div>
                                    </th>
                                    <th className="py-4 px-6 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#6366F1]"></div>
                                            PJ DAMPINGAN
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[
                                    { id: 'dashboard', label: 'Dashboard Statistik', desc: 'Ringkasan statistik sistem sesuai batasan akses masing-masing role.' },
                                    { id: 'dataAdmin', label: 'Data Admin', desc: 'Manajemen data user dengan level akses administratif.' },
                                    { id: 'dataMasyarakat', label: 'Data Masyarakat', desc: 'Akses ke data profil dan histori masyarakat dampingan.' },
                                    { id: 'peta', label: 'Peta Sebaran', desc: 'Visualisasi geografis titik lokasi masyarakat dan grup dampingan.' }
                                ].map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-8">
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-semibold text-slate-800">{item.label}</p>
                                                <p className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <Toggle 
                                                enabled={access.global[item.id].admin} 
                                                onChange={() => setAccess({...access, global: {...access.global, [item.id]: {...access.global[item.id], admin: !access.global[item.id].admin}}})} 
                                                colorClass="bg-[#0080C5]"
                                            />
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <Toggle 
                                                enabled={access.global[item.id].fasilitator} 
                                                onChange={() => setAccess({...access, global: {...access.global, [item.id]: {...access.global[item.id], fasilitator: !access.global[item.id].fasilitator}}})} 
                                                colorClass="bg-[#EA580C]"
                                            />
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <Toggle 
                                                enabled={access.global[item.id].pj} 
                                                onChange={() => setAccess({...access, global: {...access.global, [item.id]: {...access.global[item.id], pj: !access.global[item.id].pj}}})} 
                                                colorClass="bg-[#6366F1]"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-8 py-4 bg-slate-50/50 flex items-center gap-3 border-t border-gray-50">
                        <Info size={14} className="text-slate-400" />
                        <p className="text-[10px] text-slate-400 font-medium">Perubahan fitur global berlaku setelah disimpan. Setiap role dapat dikonfigurasi secara independen.</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default KelolaHakAksesPage;
