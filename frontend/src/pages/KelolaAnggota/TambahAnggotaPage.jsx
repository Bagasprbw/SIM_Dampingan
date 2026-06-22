import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronDown, 
    Save, 
    ArrowLeft, 
    Plus, 
    Upload, 
    Trash2, 
    Users, 
    UserPlus, 
    Loader2 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useQueryClient } from '@tanstack/react-query';

import AdminLayout from '../../components/layout/AdminLayout';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { usePjGrup, useGrupDampingans } from '../../hooks/queries/useGrupDampinganQuery';
import { useBidangs, usePekerjaans } from '../../hooks/queries/useMasterQuery';
import { anggotaService } from '../../services/anggotaService';
import { pengajuanAnggotaService } from '../../services/pengajuanAnggotaService';
import { queryKeys } from '../../constants/queryKeys';

const TambahAnggotaPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useCurrentUser();
    const isPjGrup = user?.role === 'pj_grup';

    // Master Data Queries
    const { data: bidangsData } = useBidangs();
    const { data: pekerjaansData } = usePekerjaans();
    const { data: grupsData } = useGrupDampingans({ per_page: 200 });
    const { data: pjGrupData } = usePjGrup();

    const bidangs = bidangsData?.data || [];
    const pekerjaans = pekerjaansData?.data || [];
    const grups = grupsData?.data || [];
    const grup = pjGrupData?.data;

    // Form selection states (for Bidang & Grup Dampingan)
    const [selectedBidangId, setSelectedBidangId] = useState('');
    const [selectedGrupId, setSelectedGrupId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Auto-fill Bidang & Grup for PJ Grup
    useEffect(() => {
        if (isPjGrup && grup) {
            setSelectedGrupId(grup.id_grup_dampingan);
            setSelectedBidangId(grup.bidang_id);
        }
    }, [isPjGrup, grup]);

    // Member rows state
    const createEmptyMember = () => ({
        nama: '',
        no_telepon: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        agama: '',
        pekerjaan: '',
        alamat: '',
        jenis_kelamin: 'L',
        status: 'aktif',
        foto: null,
        selectedImage: null
    });

    const [members, setMembers] = useState([createEmptyMember()]);
    const membersRef = useRef(members);
    membersRef.current = members;

    // Cleanup object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            membersRef.current.forEach(member => {
                if (member.selectedImage) {
                    URL.revokeObjectURL(member.selectedImage);
                }
            });
        };
    }, []);

    const addMemberRow = () => {
        setMembers(prev => [...prev, createEmptyMember()]);
    };

    const removeMemberRow = (index) => {
        const oldImage = members[index].selectedImage;
        if (oldImage) {
            URL.revokeObjectURL(oldImage);
        }
        setMembers(prev => prev.filter((_, i) => i !== index));
    };

    const handleMemberChange = (index, field, value) => {
        setMembers(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleImageChange = (index, file) => {
        if (file) {
            const oldImage = members[index].selectedImage;
            if (oldImage) {
                URL.revokeObjectURL(oldImage);
            }
            const imageUrl = URL.createObjectURL(file);
            setMembers(prev => {
                const updated = [...prev];
                updated[index] = { 
                    ...updated[index], 
                    foto: file,
                    selectedImage: imageUrl
                };
                return updated;
            });
        }
    };

    const saveAll = async () => {
        // Validation Checks
        if (!selectedBidangId || !selectedGrupId) {
            Swal.fire({
                icon: 'warning',
                title: 'Pilihan Belum Lengkap',
                text: isPjGrup 
                    ? 'Akun Anda belum terasosiasi dengan kelompok dampingan apa pun. Silakan hubungi Admin.'
                    : 'Silakan pilih Bidang Dampingan dan Grup Dampingan terlebih dahulu.',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' }
            });
            return;
        }

        for (let i = 0; i < members.length; i++) {
            if (!members[i].nama?.trim()) {
                Swal.fire({
                    icon: 'warning',
                    title: `Nama Kosong (Baris #${i + 1})`,
                    text: `Silakan masukkan nama lengkap pada baris ke-${i + 1}.`,
                    confirmButtonColor: '#0080C5',
                    customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                });
                return;
            }
        }

        setIsLoading(true);
        try {
            // Process uploads and POST requests sequentially
            for (let i = 0; i < members.length; i++) {
                const member = members[i];
                const form = new FormData();
                
                form.append('name', member.nama);
                form.append('no_telp', member.no_telepon || '');
                form.append('tempat_lahir', member.tempat_lahir || '');
                form.append('tgl_lahir', member.tanggal_lahir || '');
                form.append('agama', member.agama || '');
                form.append('alamat', member.alamat || '');
                form.append('bidang_id', selectedBidangId);
                form.append('grup_id', selectedGrupId);
                form.append('jenis_kelamin', member.jenis_kelamin);
                
                if (member.pekerjaan) {
                    form.append('pekerjaan_id', member.pekerjaan);
                }

                if (!isPjGrup) {
                    form.append('status', member.status || 'aktif');
                }
                if (member.foto) {
                    form.append('foto', member.foto);
                }

                if (isPjGrup) {
                    await pengajuanAnggotaService.create(form);
                } else {
                    await anggotaService.create(form);
                }
            }

            // Invalidate React Query Cache
            if (isPjGrup) {
                queryClient.invalidateQueries({ queryKey: [queryKeys.PENGAJUAN_ANGGOTA] });
            } else {
                queryClient.invalidateQueries({ queryKey: [queryKeys.ANGGOTA] });
            }

            Swal.fire({
                title: 'Berhasil!',
                text: isPjGrup 
                    ? 'Semua pengajuan anggota berhasil dikirim dan menunggu verifikasi.' 
                    : 'Semua data masyarakat berhasil ditambahkan.',
                icon: 'success',
                confirmButtonColor: '#0080C5',
                timer: 2000,
                showConfirmButton: false,
                customClass: { popup: 'rounded-2xl font-["Poppins"]' }
            });
            navigate(-1);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data anggota.';
            Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: errorMsg,
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' }
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout title="Tambah Anggota">
            <div className="font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left p-4 lg:p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    
                    {/* Header */}
                    <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => navigate(-1)} 
                                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                <ArrowLeft size={16} className="text-slate-600" />
                            </button>
                            <div>
                                <h2 className="text-[#0A0F1E] text-base font-bold">Pendaftaran Anggota (Multiple)</h2>
                                <p className="text-xs text-slate-400">Daftarkan beberapa anggota dampingan sekaligus</p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => navigate(-1)}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 self-start sm:self-center"
                        >
                            Kembali
                        </button>
                    </div>

                    {/* Group Selection (For Admin/Fasilitator) */}
                    {!isPjGrup && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                            <h3 className="text-sm font-bold text-slate-800">Tentukan Grup Dampingan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-slate-700 text-xs font-semibold leading-5">Bidang Dampingan <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <select 
                                            value={selectedBidangId} 
                                            onChange={(e) => {
                                                setSelectedBidangId(e.target.value);
                                                setSelectedGrupId('');
                                            }} 
                                            className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border border-gray-200 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer"
                                        >
                                            <option value="" disabled className="text-slate-500">Pilih bidang dampingan...</option>
                                            {bidangs.map(b => (
                                                <option key={b.id_bidang} value={b.id_bidang} className="text-slate-900">{b.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-slate-700 text-xs font-semibold leading-5">Grup Dampingan <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <select 
                                            value={selectedGrupId} 
                                            onChange={(e) => setSelectedGrupId(e.target.value)} 
                                            disabled={!selectedBidangId}
                                            className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border border-gray-200 appearance-none text-slate-900 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                                        >
                                            <option value="" disabled className="text-slate-500">
                                                {selectedBidangId ? 'Pilih grup dampingan...' : 'Pilih bidang terlebih dahulu'}
                                            </option>
                                            {grups
                                                .filter(g => g.bidang_id === selectedBidangId)
                                                .map(g => (
                                                    <option key={g.id_grup_dampingan} value={g.id_grup_dampingan} className="text-slate-900">{g.name}</option>
                                                ))
                                            }
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PJ Grup Info Header (For PJ Grup) */}
                    {isPjGrup && (
                        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#0080C5]/10 border border-[#0080C5] flex items-center justify-center shrink-0">
                                <Users size={20} className="text-[#0080C5]" />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                                <h3 className="text-slate-900 text-sm font-bold leading-tight truncate">{grup?.name || 'Loading Grup...'}</h3>
                                <p className="text-[#0080C5] text-xs font-semibold">Grup Dampingan Anda (Otomatis)</p>
                                <p className="text-slate-400 text-[10px] mt-0.5 font-medium truncate">Bidang: {grup?.bidang?.name || '-'}</p>
                            </div>
                        </div>
                    )}

                    {/* Member Cards List */}
                    <div className="space-y-6">
                        {members.map((member, index) => (
                            <div 
                                key={index} 
                                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                            >
                                {/* Card Header */}
                                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-[#0080C5] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                            {index + 1}
                                        </span>
                                        <h3 className="text-slate-800 text-sm font-bold">Data Anggota Dampingan</h3>
                                    </div>
                                    {members.length > 1 && (
                                        <button 
                                            type="button"
                                            onClick={() => removeMemberRow(index)}
                                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 border border-red-100"
                                        >
                                            <Trash2 size={14} />
                                            <span>Hapus Baris</span>
                                        </button>
                                    )}
                                </div>

                                {/* Card Body */}
                                <div className="p-6 space-y-5">
                                    {/* Photo Upload Section */}
                                    <div className="flex items-center gap-5">
                                        <label className="w-16 h-16 rounded-full border-2 border-dashed border-[#0080C5] bg-slate-50 flex items-center justify-center text-[#0080C5] relative overflow-hidden cursor-pointer">
                                            {member.selectedImage ? (
                                                <img src={member.selectedImage} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <UserPlus size={24} />
                                            )}
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                onChange={(e) => handleImageChange(index, e.target.files?.[0])} 
                                                accept="image/*" 
                                            />
                                        </label>
                                        <div className="space-y-1">
                                            <label className="px-4 py-2 w-max bg-white border border-[#0080C5] border-dashed rounded-[10px] text-[#0080C5] text-xs font-bold flex items-center gap-2 hover:bg-[#0080C5]/10 transition-all cursor-pointer">
                                                <Upload size={16} />
                                                Upload Foto
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    onChange={(e) => handleImageChange(index, e.target.files?.[0])} 
                                                    accept="image/*" 
                                                />
                                            </label>
                                            <p className="text-slate-400 text-[10px] font-normal tracking-tight">Format: JPG, PNG. Maks. 2 MB (opsional)</p>
                                        </div>
                                    </div>

                                    <hr className="border-slate-100" />

                                    {/* Nama & No Telp Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-slate-700 text-xs font-semibold leading-5">Nama Lengkap <span className="text-red-500">*</span></label>
                                            <input 
                                                value={member.nama}
                                                onChange={(e) => handleMemberChange(index, 'nama', e.target.value)}
                                                type="text" 
                                                placeholder="Masukkan nama lengkap"
                                                className="w-full h-11 px-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-slate-700 text-xs font-semibold leading-5">No. Telepon</label>
                                            <input 
                                                value={member.no_telepon}
                                                onChange={(e) => handleMemberChange(index, 'no_telepon', e.target.value)}
                                                type="text" 
                                                placeholder="08xxxxxxxxxx"
                                                className="w-full h-11 px-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Tempat & Tanggal Lahir Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-slate-700 text-xs font-semibold leading-5">Tempat Lahir</label>
                                            <input 
                                                value={member.tempat_lahir}
                                                onChange={(e) => handleMemberChange(index, 'tempat_lahir', e.target.value)}
                                                type="text" 
                                                placeholder="Masukkan tempat lahir"
                                                className="w-full h-11 px-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-slate-700 text-xs font-semibold leading-5">Tanggal Lahir</label>
                                            <input 
                                                value={member.tanggal_lahir}
                                                onChange={(e) => handleMemberChange(index, 'tanggal_lahir', e.target.value)}
                                                type="date" 
                                                className="w-full h-11 px-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Jenis Kelamin & Agama Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-slate-700 text-xs font-semibold leading-5">Jenis Kelamin</label>
                                            <div className="flex gap-3">
                                                <button 
                                                    type="button"
                                                    onClick={() => handleMemberChange(index, 'jenis_kelamin', 'L')}
                                                    className={`flex-1 h-11 px-3.5 rounded-[10px] border flex items-center gap-2 transition-all ${member.jenis_kelamin === 'L' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-200 text-slate-400'}`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full border-[5px] flex items-center justify-center ${member.jenis_kelamin === 'L' ? 'border-[#0080C5]' : 'border-gray-200'}`} />
                                                    <span className="text-xs font-semibold">Laki-laki</span>
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => handleMemberChange(index, 'jenis_kelamin', 'P')}
                                                    className={`flex-1 h-11 px-3.5 rounded-[10px] border flex items-center gap-2 transition-all ${member.jenis_kelamin === 'P' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-200 text-slate-400'}`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full border-[5px] flex items-center justify-center ${member.jenis_kelamin === 'P' ? 'border-[#0080C5]' : 'border-gray-200'}`} />
                                                    <span className="text-xs font-semibold">Perempuan</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-slate-700 text-xs font-semibold leading-5">Agama</label>
                                            <div className="relative group">
                                                <select 
                                                    value={member.agama} 
                                                    onChange={(e) => handleMemberChange(index, 'agama', e.target.value)}
                                                    className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border border-gray-200 appearance-none text-slate-700 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer"
                                                >
                                                    <option value="">Pilih agama...</option>
                                                    <option value="Islam">Islam</option>
                                                    <option value="Kristen">Kristen</option>
                                                    <option value="Katolik">Katolik</option>
                                                    <option value="Hindu">Hindu</option>
                                                    <option value="Buddha">Buddha</option>
                                                    <option value="Konghucu">Konghucu</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pekerjaan & Status Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-slate-700 text-xs font-semibold leading-5">Pekerjaan Utama</label>
                                            <div className="relative group">
                                                <select 
                                                    value={member.pekerjaan} 
                                                    onChange={(e) => handleMemberChange(index, 'pekerjaan', e.target.value)} 
                                                    className="w-full h-11 pl-4 pr-10 bg-white rounded-[10px] border border-gray-200 appearance-none text-slate-700 text-xs font-medium focus:border-[#0080C5] focus:outline-none transition-all cursor-pointer"
                                                >
                                                    <option value="">Pilih pekerjaan...</option>
                                                    {pekerjaans.map(p => (
                                                        <option key={p.id_pekerjaan} value={p.id_pekerjaan}>{p.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#0080C5]" size={16} />
                                            </div>
                                        </div>
                                        {!isPjGrup && (
                                            <div className="space-y-1.5">
                                                <label className="text-slate-700 text-xs font-semibold leading-5">Status</label>
                                                <div className="flex gap-3">
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleMemberChange(index, 'status', 'aktif')}
                                                        className={`flex-1 h-11 px-3.5 rounded-[10px] border flex items-center gap-2 transition-all ${member.status !== 'non-aktif' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-200 text-slate-400'}`}
                                                    >
                                                        <div className={`w-4 h-4 rounded-full border-[5px] flex items-center justify-center ${member.status !== 'non-aktif' ? 'border-[#0080C5]' : 'border-gray-200'}`} />
                                                        <span className="text-xs font-semibold">Aktif</span>
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleMemberChange(index, 'status', 'non-aktif')}
                                                        className={`flex-1 h-11 px-3.5 rounded-[10px] border flex items-center gap-2 transition-all ${member.status === 'non-aktif' ? 'bg-[#0080C5]/5 border-[#0080C5] text-[#0080C5]' : 'bg-white border-gray-200 text-slate-400'}`}
                                                    >
                                                        <div className={`w-4 h-4 rounded-full border-[5px] flex items-center justify-center ${member.status === 'non-aktif' ? 'border-[#0080C5]' : 'border-gray-200'}`} />
                                                        <span className="text-xs font-semibold">Non-Aktif</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Alamat */}
                                    <div className="space-y-1.5">
                                        <label className="text-slate-700 text-xs font-semibold leading-5">Alamat</label>
                                        <textarea 
                                            value={member.alamat}
                                            onChange={(e) => handleMemberChange(index, 'alamat', e.target.value)}
                                            placeholder="Masukkan alamat lengkap..."
                                            className="w-full h-24 p-4 bg-white rounded-[10px] border border-gray-200 focus:border-[#0080C5] focus:outline-none text-xs text-slate-600 transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Member Row Button */}
                    <button 
                        type="button"
                        onClick={addMemberRow}
                        className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-[#0080C5] text-slate-500 hover:text-[#0080C5] bg-slate-50 hover:bg-[#0080C5]/5 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition-all hover:shadow-sm"
                    >
                        <Plus size={16} />
                        <span>Tambah Baris Anggota Baru</span>
                    </button>

                    {/* Footer Actions */}
                    <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-slate-100 flex items-center justify-end gap-3">
                        <button 
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 h-11 bg-white border border-gray-200 rounded-[10px] text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-all"
                        >
                            Batal
                        </button>
                        <button 
                            type="button"
                            onClick={saveAll}
                            disabled={isLoading}
                            className="h-11 px-6 bg-[#0080C5] text-white rounded-[10px] flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-xs font-semibold disabled:opacity-50 min-w-[140px]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    <span>Simpan Semua</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default TambahAnggotaPage;
