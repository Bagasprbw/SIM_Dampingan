import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import { 
    ArrowLeft,
    Info,
    MapPin,
    Calendar,
    Clock,
    Users,
    Image as ImageIcon,
    FileText,
    Plus,
    X,
    Save,
    ChevronDown,
    Trash2
} from 'lucide-react';

import Swal from 'sweetalert2';

const EditKegiatanPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [charCount, setCharCount] = useState(0);

    const handleBack = () => navigate('/kelola-kegiatan');

    const handleSave = () => {
        Swal.fire({
            title: 'Berhasil!',
            text: 'Perubahan pada kegiatan telah disimpan.',
            icon: 'success',
            confirmButtonColor: '#0080C5',
            customClass: {
                popup: 'rounded-3xl font-["Poppins"]',
                confirmButton: 'rounded-xl px-10'
            }
        }).then(() => {
            navigate('/kelola-kegiatan');
        });
    };

    return (
        <AdminLayout title="Kelola Kegiatan">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                
                {/* Main Card Container */}
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden relative border border-gray-100">
                    
                    {/* 1. Header Section (Blue Gradient) */}
                    <div className="bg-gradient-to-b from-[#0080C5] to-[#0099E6] px-8 py-6 flex justify-between items-center text-white">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleBack}
                                className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div className="flex flex-col">
                                <h2 className="text-lg font-bold leading-tight tracking-tight">Edit Kegiatan</h2>
                                <p className="text-white/80 text-[11px] font-medium uppercase tracking-wider">
                                    Pelatihan Pengolahan Hasil Tani Berkelanjutan
                                </p>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-3">
                            <div className="px-4 py-1.5 bg-white/20 rounded-full flex items-center gap-2 text-xs font-medium">
                                <Calendar size={14} />
                                <span>10 Apr 2026</span>
                            </div>
                            <div className="px-4 py-1.5 bg-white/20 rounded-full flex items-center gap-2 text-xs font-medium">
                                <Clock size={14} />
                                <span>08:00 – 13:30</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Form Body */}
                    <div className="p-8 space-y-10">
                        {/* SECTION: INFORMASI UTAMA */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#0080C5] rounded-lg text-white">
                                    <Info size={16} />
                                </div>
                                <h3 className="text-[#0080C5] text-[11px] font-semibold tracking-wider uppercase">Informasi Utama</h3>
                                <div className="flex-1 h-px bg-gray-100"></div>
                            </div>

                            <div className="space-y-6 pl-11">
                                {/* Judul Kegiatan */}
                                <div className="space-y-2">
                                    <label className="text-gray-700 text-[11px] font-semibold flex items-center gap-1">
                                        Judul Kegiatan <span className="text-red-500 font-normal">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        defaultValue="Pelatihan Pengolahan Hasil Tani Berkelanjutan"
                                        className="w-full h-11 px-4 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-700 focus:border-[#0080C5] focus:outline-none transition-all"
                                    />
                                </div>

                                {/* Deskripsi */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <label className="text-gray-700 text-[11px] font-semibold flex items-center gap-1">
                                                Deskripsi <span className="text-red-500 font-normal">*</span>
                                            </label>
                                            <p className="text-slate-400 text-[10px]">Minimal 500 karakter</p>
                                        </div>
                                    </div>
                                    <textarea 
                                        className="w-full h-40 p-4 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-700 focus:border-[#0080C5] focus:outline-none transition-all resize-none"
                                        placeholder="Masukkan deskripsi kegiatan..."
                                    ></textarea>
                                    <div className="flex justify-end">
                                        <span className="text-red-500 text-[10px] font-bold">0 / 500</span>
                                    </div>
                                </div>

                                {/* Masalah & Solusi */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-gray-700 text-[11px] font-semibold flex items-center gap-1">
                                            Masalah <span className="text-red-500 font-normal">*</span>
                                        </label>
                                        <textarea 
                                            className="w-full h-32 p-4 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-700 focus:border-[#0080C5] focus:outline-none transition-all resize-none"
                                            placeholder="Masukkan masalah..."
                                        ></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-700 text-[11px] font-semibold flex items-center gap-1">
                                            Solusi <span className="text-red-500 font-normal">*</span>
                                        </label>
                                        <textarea 
                                            className="w-full h-32 p-4 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-700 focus:border-[#0080C5] focus:outline-none transition-all resize-none"
                                            placeholder="Masukkan solusi..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION: LOKASI & WAKTU */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#10B981] rounded-lg text-white">
                                    <MapPin size={16} />
                                </div>
                                <h3 className="text-[#10B981] text-[11px] font-semibold tracking-wider uppercase">Lokasi & Waktu</h3>
                                <div className="flex-1 h-px bg-gray-100"></div>
                            </div>

                            <div className="space-y-6 pl-11">
                                {/* Alamat */}
                                <div className="space-y-2">
                                    <label className="text-gray-700 text-[11px] font-semibold flex items-center gap-1">
                                        Alamat Kegiatan <span className="text-red-500 font-normal">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        defaultValue="Balai Desa Maju Sejahtera, Jl. Raya Pertanian No. 12, RT 03/RW 07"
                                        className="w-full h-11 px-4 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-700 focus:border-[#10B981] focus:outline-none transition-all"
                                    />
                                </div>

                                {/* Wilayah Selects */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-gray-700 text-[11px] font-semibold flex items-center gap-1">Provinsi <span className="text-red-500 font-normal">*</span></label>
                                        <div className="relative">
                                            <select className="w-full h-11 px-4 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-400 appearance-none focus:outline-none focus:border-[#10B981] cursor-pointer">
                                                <option>Pilih...</option>
                                            </select>
                                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-700 text-[11px] font-semibold flex items-center gap-1">Kabupaten / Kota <span className="text-red-500 font-normal">*</span></label>
                                        <div className="relative">
                                            <select className="w-full h-11 px-4 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-400 appearance-none focus:outline-none focus:border-[#10B981] cursor-pointer">
                                                <option>Pilih...</option>
                                            </select>
                                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-700 text-[11px] font-semibold flex items-center gap-1">Kecamatan <span className="text-red-500 font-normal">*</span></label>
                                        <div className="relative">
                                            <select className="w-full h-11 px-4 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-400 appearance-none focus:outline-none focus:border-[#10B981] cursor-pointer">
                                                <option>Pilih...</option>
                                            </select>
                                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Tanggal & Waktu */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-gray-700 text-[11px] font-semibold flex items-center gap-1">Tanggal Pelaksanaan <span className="text-red-500 font-normal">*</span></label>
                                        <input type="date" className="w-full h-11 px-4 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#10B981]" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-700 text-[11px] font-semibold flex items-center gap-1">Waktu Pelaksanaan <span className="text-red-500 font-normal">*</span></label>
                                        <div className="flex items-center gap-3">
                                            <input type="time" className="flex-1 h-11 px-4 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#10B981]" />
                                            <span className="text-slate-400 text-[11px] font-semibold">s/d</span>
                                            <input type="time" className="flex-1 h-11 px-4 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#10B981]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION: BIDANG & GRUP */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#7C3AED] rounded-lg text-white">
                                    <Users size={16} />
                                </div>
                                <h3 className="text-[#7C3AED] text-[11px] font-semibold tracking-wider uppercase">Bidang & Grup Dampingan</h3>
                                <div className="flex-1 h-px bg-gray-100"></div>
                            </div>

                            <div className="space-y-6 pl-11">
                                <div className="space-y-2">
                                    <label className="text-gray-700 text-[11px] font-semibold flex items-center gap-1">Bidang Dampingan <span className="text-red-500 font-normal">*</span></label>
                                    <div className="relative">
                                        <select className="w-full h-11 px-4 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-400 appearance-none focus:outline-none focus:border-[#7C3AED] cursor-pointer">
                                            <option>Pilih...</option>
                                        </select>
                                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-gray-700 text-[11px] font-semibold flex items-center gap-1">Grup Dampingan <span className="text-red-500 font-normal">*</span></label>
                                        <span className="text-slate-400 text-[10px]">3 grup dipilih</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <div className="px-3 py-1.5 bg-[#0080C5]/10 rounded-full border border-[#0080C5]/20 flex items-center gap-2">
                                            <span className="text-[#0080C5] text-[11px] font-bold tracking-tight">Kelompok Tani Makmur</span>
                                            <X size={12} className="text-[#0080C5] cursor-pointer hover:bg-white rounded-full p-0.5" />
                                        </div>
                                        <div className="px-3 py-1.5 bg-[#0080C5]/10 rounded-full border border-[#0080C5]/20 flex items-center gap-2">
                                            <span className="text-[#0080C5] text-[11px] font-bold tracking-tight">Kelompok Josjis</span>
                                            <X size={12} className="text-[#0080C5] cursor-pointer hover:bg-white rounded-full p-0.5" />
                                        </div>
                                        <div className="px-3 py-1.5 bg-[#0080C5]/10 rounded-full border border-[#0080C5]/20 flex items-center gap-2">
                                            <span className="text-[#0080C5] text-[11px] font-bold tracking-tight">Grup Dampingan Sejahtera</span>
                                            <X size={12} className="text-[#0080C5] cursor-pointer hover:bg-white rounded-full p-0.5" />
                                        </div>
                                        <button className="px-4 py-1.5 bg-white border border-[#0080C5] rounded-full flex items-center gap-2 text-[#0080C5] hover:bg-sky-50 transition-all">
                                            <Plus size={14} strokeWidth={3} />
                                            <span className="text-[11px] font-bold tracking-tight">+ Grup</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION: DOKUMENTASI */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#F59E0B] rounded-lg text-white">
                                    <ImageIcon size={16} />
                                </div>
                                <h3 className="text-[#F59E0B] text-[11px] font-semibold tracking-wider uppercase">Dokumentasi</h3>
                                <div className="flex-1 h-px bg-gray-100"></div>
                            </div>

                            <div className="space-y-8 pl-11">
                                {/* Foto Gallery */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <label className="text-gray-700 text-[11px] font-semibold uppercase">Foto Kegiatan</label>
                                            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[#9298B0] text-[10px] font-bold">Opsional</span>
                                        </div>
                                        <span className="px-3 py-1 bg-[#F59E0B]/10 rounded-full text-[#B45309] text-[11px] font-bold tracking-tight">4 foto tersimpan</span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                        {[1,2,3,4].map((i) => (
                                            <div key={i} className="group relative h-28 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 shadow-sm transition-all hover:ring-2 hover:ring-[#F59E0B]">
                                                <img src={`https://placehold.co/174x110?text=Foto+${i}`} className="w-full h-full object-cover" alt={`Dokumentasi ${i}`} />
                                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-white text-[8px] truncate">foto-kegiatan-{i}.jpg</span>
                                                </div>
                                                <button className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        <button className="h-28 bg-slate-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-slate-100 hover:border-[#F59E0B] transition-all text-gray-400 hover:text-[#F59E0B]">
                                            <Plus size={18} />
                                            <span>Tambah</span>
                                        </button>
                                    </div>
                                </div>

                                {/* PDF Upload */}
                                <div className="space-y-3">
                                    <label className="text-gray-700 text-[11px] font-semibold uppercase">Laporan Kegiatan (PDF)</label>
                                    <div className="p-4 bg-red-50 rounded-2xl border border-red-500 flex items-center gap-4 group">
                                        <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
                                            <FileText size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-slate-950 text-[11px] font-semibold truncate">Laporan-Pelatihan-Pengolahan-Hasil-Tani-Apr2026.pdf</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-slate-400 text-[10px]">2.4 MB · PDF</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="text-[#0080C5] text-[10px] font-bold tracking-tight uppercase">Tersimpan</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="h-8 px-4 bg-white border border-gray-200 rounded-lg text-gray-700 text-[10px] font-bold tracking-tight hover:bg-gray-50 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all">
                                                <div className="w-2.5 h-1 border-b border-gray-700"></div>
                                                Ganti
                                            </button>
                                            <button className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Bottom Footer */}
                    <div className="bg-white border-t border-gray-100 px-8 py-6 flex items-center justify-end gap-3 rounded-b-2xl">
                        <button 
                            onClick={handleBack}
                            className="h-11 px-8 bg-white border border-gray-200 text-gray-500 text-[11px] font-semibold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Batal
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
            </div>
        </AdminLayout>
    );
};

export default EditKegiatanPage;
