import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
    User, 
    Phone, 
    MapPin, 
    Calendar, 
    Briefcase, 
    Award, 
    ChevronRight, 
    CheckCircle2, 
    Users,
    Activity,
    Info,
    BookOpen,
    Loader2
} from 'lucide-react';
import { publicService } from '../../services/publicService';

const ProfilAnggotaPublicPage = () => {
    const { id } = useParams();

    const { data: profileResponse, isLoading, isError } = useQuery({
        queryKey: ['public-profile', id],
        queryFn: () => publicService.getProfilAnggota(id),
        retry: false
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-[#0080C5]" size={48} />
                    <p className="text-slate-500 font-medium animate-pulse">Memuat Profil Dampingan...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Info size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Profil Tidak Ditemukan</h2>
                    <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                        Maaf, profil dampingan yang Anda cari tidak tersedia atau belum diaktivasi oleh sistem.
                    </p>
                    <a href="/" className="inline-flex items-center justify-center px-6 py-3 bg-[#0080C5] text-white rounded-xl font-bold hover:bg-[#00669D] transition-all shadow-lg shadow-blue-200">
                        Kembali ke Beranda
                    </a>
                </div>
            </div>
        );
    }

    const anggota = profileResponse?.data;
    const activities = anggota?.peserta_kegiatans || [];

    // Helper for generating image URL
    const getImageUrl = (path) => {
        if (!path) return null;
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        const baseUrl = apiUrl.replace('/api', '');
        return `${baseUrl}/storage/${path}`;
    };

    return (
        <div className="min-h-screen bg-[#0F172A] py-8 px-4 sm:px-6 lg:px-8 font-['Poppins']">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
                
                {/* SIDEBAR LEFT */}
                <div className="w-full lg:w-[320px] shrink-0">
                    <div className="bg-white rounded-[24px] overflow-hidden shadow-2xl h-full flex flex-col border border-white/20">
                        {/* Avatar & Header Section */}
                        <div className="bg-gradient-to-br from-[#0080C5] to-[#005C8F] p-8 text-center relative overflow-hidden">
                            {/* Decorative background shapes */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
                            
                            <div className="relative mb-6">
                                <div className="w-28 h-28 mx-auto rounded-full border-4 border-white/30 p-1 bg-white/20 backdrop-blur-sm overflow-hidden shadow-xl">
                                    {anggota.foto ? (
                                        <img 
                                            src={getImageUrl(anggota.foto)} 
                                            alt={anggota.name} 
                                            className="w-full h-full object-cover rounded-full bg-slate-100"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#0080C5] flex items-center justify-center text-white">
                                            <User size={48} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h1 className="text-white text-xl font-bold mb-2 drop-shadow-md">{anggota.name}</h1>
                            <div className="inline-flex items-center px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white/90 text-[10px] font-bold tracking-widest uppercase">
                                Anggota
                            </div>
                        </div>

                        {/* Profile Summary Section */}
                        <div className="p-6 space-y-6">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nomor Anggota</p>
                                <p className="text-[#0A0F1E] text-lg font-black tracking-tight">{anggota.no_anggota || '-'}</p>
                            </div>

                            <div className="bg-[#10B981]/5 border border-[#10B981]/10 rounded-2xl p-4 flex items-center gap-4">
                                <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse shadow-[0_0_8px_#10B981]"></div>
                                <div>
                                    <p className="text-[#10B981] text-xs font-bold leading-none mb-1">Status Aktif</p>
                                    <p className="text-slate-400 text-[10px] font-medium leading-none">Terdaftar sejak {new Date(anggota.created_at).getFullYear()}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 space-y-5">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Dampingan</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-slate-400 font-medium">Status</span>
                                        <span className="text-xs font-bold text-[#0080C5] capitalize">{anggota.status}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-slate-400 font-medium">Bidang Dampingan</span>
                                        <span className="text-xs font-bold text-slate-700">{anggota.bidang?.name || '-'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-slate-400 font-medium">Grup Dampingan</span>
                                        <span className="text-xs font-bold text-slate-700">{anggota.grup_dampingan?.name || '-'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-slate-400 font-medium">Peran</span>
                                        <span className="text-xs font-bold text-slate-700">Anggota</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT RIGHT */}
                <div className="flex-1 space-y-6">
                    
                    {/* DATA PRIBADI CARD */}
                    <div className="bg-white rounded-[24px] p-8 shadow-xl border border-white/20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-blue-50 text-[#0080C5] rounded-xl flex items-center justify-center">
                                <Info size={20} />
                            </div>
                            <h2 className="text-[#0A0F1E] text-base font-bold tracking-tight uppercase">Data Pribadi</h2>
                        </div>

                        <div className="grid gap-px bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 bg-white p-5 items-center hover:bg-slate-50/50 transition-colors">
                                <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
                                    <MapPin size={14} /> Tempat, Tanggal Lahir
                                </span>
                                <span className="text-slate-300 hidden md:block">:</span>
                                <span className="text-sm font-bold text-slate-700">
                                    {anggota.tempat_lahir || '-'}, {anggota.tgl_lahir ? new Date(anggota.tgl_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 bg-white p-5 items-center hover:bg-slate-50/50 transition-colors">
                                <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
                                    <Users size={14} /> Jenis Kelamin
                                </span>
                                <span className="text-slate-300 hidden md:block">:</span>
                                <span className="text-sm font-bold text-slate-700">
                                    {anggota.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 bg-white p-5 items-center hover:bg-slate-50/50 transition-colors">
                                <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
                                    <Award size={14} /> Agama
                                </span>
                                <span className="text-slate-300 hidden md:block">:</span>
                                <span className="text-sm font-bold text-slate-700">{anggota?.agama || '-'}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 bg-white p-5 items-center hover:bg-slate-50/50 transition-colors">
                                <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
                                    <Briefcase size={14} /> Pekerjaan Utama
                                </span>
                                <span className="text-slate-300 hidden md:block">:</span>
                                <span className="text-sm font-bold text-slate-700">{anggota.pekerjaan?.name || '-'}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 bg-white p-5 items-center hover:bg-slate-50/50 transition-colors">
                                <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
                                    <Phone size={14} /> No. Telepon
                                </span>
                                <span className="text-slate-300 hidden md:block">:</span>
                                <span className="text-sm font-bold text-[#0080C5]">{anggota.no_telp || '-'}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 bg-white p-5 items-center hover:bg-slate-50/50 transition-colors">
                                <span className="text-xs text-slate-400 font-medium flex items-center gap-2 flex-shrink-0">
                                    <MapPin size={14} /> Alamat
                                </span>
                                <span className="text-slate-300 hidden md:block">:</span>
                                <span className="text-sm font-bold text-slate-700 leading-relaxed">{anggota.alamat || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* RIWAYAT DAMPINGAN */}
                    <div className="bg-white rounded-[24px] p-8 shadow-xl border border-white/20 min-h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
                                    <Activity size={20} />
                                </div>
                                <h2 className="text-[#0A0F1E] text-base font-bold tracking-tight uppercase">Riwayat Dampingan</h2>
                            </div>
                            <div className="px-4 py-1.5 bg-blue-50 text-[#0080C5] rounded-full text-xs font-bold border border-blue-100 flex items-center gap-2 shadow-sm">
                                <span>{activities.length} Program</span>
                            </div>
                        </div>

                        {activities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                                    <Calendar size={32} />
                                </div>
                                <p className="text-slate-400 text-sm font-medium">Belum ada riwayat kegiatan yang diikuti.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {activities.map((item, index) => (
                                    <div key={item.id_peserta_kegiatan} className="group relative bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-100 transition-all duration-300">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-9 h-9 bg-[#0080C5] text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0 shadow-lg shadow-blue-200">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <h3 className="text-[#0A0F1E] text-xs font-bold leading-snug group-hover:text-[#0080C5] transition-colors line-clamp-1">{item.kegiatan?.judul}</h3>
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full shrink-0 border border-emerald-100">
                                                        <CheckCircle2 size={10} />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Selesai</span>
                                                    </div>
                                                </div>
                                                <p className="text-slate-400 text-[10px] font-medium flex items-center gap-1.5">
                                                    <Calendar size={12} /> 
                                                    {new Date(item.kegiatan?.tanggal).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-50">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Bidang</span>
                                                <span className="text-[10px] font-bold text-slate-700 truncate">{item.kegiatan?.bidang?.name || anggota.bidang?.name}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Grup</span>
                                                <span className="text-[10px] font-bold text-slate-700 truncate">{anggota.grup_dampingan?.name}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Fasilitator</span>
                                                <span className="text-[10px] font-bold text-[#0080C5] truncate">{item.kegiatan?.fasilitator?.name || '-'}</span>
                                            </div>
                                        </div>

                                        {item.sertifikat && (
                                            <div className="mt-4">
                                                <a 
                                                    href={getImageUrl(item.sertifikat.file)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full py-2 bg-blue-50 text-[#0080C5] rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-[#0080C5] hover:text-white transition-all"
                                                >
                                                    <Award size={14} /> Lihat Sertifikat
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer / Copyright */}
            <div className="max-w-6xl mx-auto mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                    <div className="w-6 h-6 bg-[#0080C5] rounded-full flex items-center justify-center p-1">
                        <BookOpen size={12} className="text-white" />
                    </div>
                    <p className="text-white/40 text-[10px] font-medium tracking-wide">
                        &copy; 2026 MPM Muhammadiyah. Sistem Informasi Manajemen Dampingan.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfilAnggotaPublicPage;
