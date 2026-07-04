import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, Save, ArrowRight, ArrowLeft, X, Plus, Upload, Image, FileText, Check, UserCircle2, Search, Loader2, Clock } from 'lucide-react';

import Swal from 'sweetalert2';
import { useKegiatanMutations } from '../../hooks/mutations/useKegiatanMutation';
import { kegiatanService } from '../../services/kegiatanService';
import { grupDampinganService } from '../../services/grupDampinganService';
import { useBidangs } from '../../hooks/queries/useBidangQuery';
import { useLevelKegiatans } from '../../hooks/queries/useLevelKegiatanQuery';
import { useProvinsi, useKabupaten, useKecamatan } from '../../hooks/queries/useWilayahQuery';
import { useGrupDampingans } from '../../hooks/queries/useGrupDampinganQuery';
import { getUser } from '../../utils/storage';

// ─── Step Indicator ───────────────────────────────────────────────────────────
const StepIndicator = ({ step }) => {
    const steps = ['Informasi Kegiatan', 'Absensi Peserta', 'Ringkasan'];
    return (
        <div className="flex items-center gap-0 mb-8">
            {steps.map((label, i) => {
                const idx = i + 1;
                const done = step > idx;
                const active = step === idx;
                return (
                    <React.Fragment key={idx}>
                        <div className="flex items-center gap-2 shrink-0">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${done ? 'bg-[#10B981] border-[#10B981] text-white' : active ? 'bg-[#0080C5] border-[#0080C5] text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                                {done ? <Check size={14} /> : idx}
                            </div>
                            <span className={`text-xs font-semibold ${active ? 'text-[#0080C5]' : done ? 'text-[#10B981]' : 'text-slate-400'}`}>{label}</span>
                        </div>
                        {i < 2 && <div className={`flex-1 h-px mx-3 ${step > idx ? 'bg-[#10B981]' : 'bg-slate-200'}`} />}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

// ─── Step 1: Informasi Kegiatan ───────────────────────────────────────────────
const Step1 = ({
    data,
    onChange,
    onWilayahChange,
    bidangs,
    levelLabel,
    provinsiList,
    kabupatenList,
    kecamatanList,
    isProvDisabled,
    isKabDisabled,
    isKecDisabled,
}) => {
    const charCount = (data.deskripsi || '').length;
    const valid = charCount >= 500;
    return (
        <div className="space-y-5">
            <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">Judul Kegiatan <span className="text-red-500">*</span></label>
                <input value={data.judul || ''} onChange={e => onChange('judul', e.target.value)} placeholder="Pelatihan Pengolahan Hasil Tani" className="w-full h-11 px-4 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all" />
            </div>
            <div>
                <div className="flex justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-800">Deskripsi <span className="text-red-500">*</span></label>
                    <span className="text-xs text-slate-400">Min. 500 karakter</span>
                </div>
                <textarea value={data.deskripsi || ''} onChange={e => onChange('deskripsi', e.target.value)} placeholder="Tuliskan deskripsi kegiatan secara lengkap, minimal 500 karakter..." rows={5} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all resize-none" />
                {!valid && <div className="flex items-center gap-1.5 mt-1"><span className="text-red-400 text-[10px]">⚠ Belum memenuhi syarat</span><span className="ml-auto text-[10px] text-slate-400">{charCount} / 500</span></div>}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">Masalah <span className="text-red-500">*</span></label>
                    <textarea value={data.masalah || ''} onChange={e => onChange('masalah', e.target.value)} placeholder="Tuliskan masalah yang dihadapi..." rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all resize-none" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">Solusi <span className="text-red-500">*</span></label>
                    <textarea value={data.solusi || ''} onChange={e => onChange('solusi', e.target.value)} placeholder="Tuliskan solusi yang ditawarkan..." rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all resize-none" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">Lokasi Pelaksanaan <span className="text-red-500">*</span></label>
                <input value={data.lokasi || ''} onChange={e => onChange('lokasi', e.target.value)} placeholder="Balai Desa Maju, Jl. Raya Sejahtera No. 12" className="w-full h-11 px-4 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all" />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">Provinsi</label>
                    <div className="relative">
                        <select
                            value={data.kode_prov || ''}
                            onChange={(e) => onWilayahChange('kode_prov', e.target.value)}
                            disabled={isProvDisabled}
                            className={`w-full h-11 pl-4 pr-8 border rounded-lg text-xs appearance-none focus:outline-none transition-all ${isProvDisabled ? 'bg-slate-100 text-slate-400 border-slate-200' : 'border-slate-200 text-slate-700 focus:border-[#0080C5]'}`}
                        >
                            <option value="">Pilih...</option>
                            {provinsiList.map((prov) => (
                                <option key={prov.kode} value={prov.kode}>{prov.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">Kabupaten/Kota</label>
                    <div className="relative">
                        <select
                            value={data.kode_kab || ''}
                            onChange={(e) => onWilayahChange('kode_kab', e.target.value)}
                            disabled={isKabDisabled}
                            className={`w-full h-11 pl-4 pr-8 border rounded-lg text-xs appearance-none focus:outline-none transition-all ${isKabDisabled ? 'bg-slate-100 text-slate-400 border-slate-200' : 'border-slate-200 text-slate-700 focus:border-[#0080C5]'}`}
                        >
                            <option value="">Pilih...</option>
                            {kabupatenList.map((kab) => (
                                <option key={kab.kode} value={kab.kode}>{kab.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">Kecamatan</label>
                    <div className="relative">
                        <select
                            value={data.kode_kec || ''}
                            onChange={(e) => onWilayahChange('kode_kec', e.target.value)}
                            disabled={isKecDisabled}
                            className={`w-full h-11 pl-4 pr-8 border rounded-lg text-xs appearance-none focus:outline-none transition-all ${isKecDisabled ? 'bg-slate-100 text-slate-400 border-slate-200' : 'border-slate-200 text-slate-700 focus:border-[#0080C5]'}`}
                        >
                            <option value="">Pilih...</option>
                            {kecamatanList.map((kec) => (
                                <option key={kec.kode} value={kec.kode}>{kec.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">Tanggal Pelaksanaan <span className="text-red-500">*</span></label>
                    <input type="date" value={data.tanggal || ''} onChange={e => onChange('tanggal', e.target.value)} className="w-full h-11 px-4 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">Waktu <span className="text-red-500">*</span></label>
                    <input type="time" value={data.waktu || ''} onChange={e => onChange('waktu', e.target.value)} className="w-full h-11 px-4 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">Bidang Dampingan <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select
                            value={data.bidang_id || ''}
                            onChange={e => onChange('bidang_id', e.target.value)}
                            className="w-full h-11 pl-4 pr-8 border border-slate-200 rounded-lg text-xs text-slate-700 appearance-none focus:border-[#0080C5] focus:outline-none transition-all"
                        >
                            <option value="">Pilih...</option>
                            {bidangs.map((bidang) => (
                                <option key={bidang.id_bidang} value={bidang.id_bidang}>{bidang.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">Level Kegiatan</label>
                    <input value={levelLabel || '-'} disabled className="w-full h-11 px-4 border border-slate-200 rounded-lg text-xs bg-slate-100 text-slate-500" />
                </div>
            </div>
        </div>
    );
};

// ─── Step 2: Absensi Peserta ──────────────────────────────────────────────────
const Step2 = ({
    grupOptions,
    selectedGrupIds,
    onAddGrup,
    onRemoveGrup,
    activeGrupId,
    setActiveGrupId,
    grupDetails,
    loadingGrupIds,
    attendance,
    setAttendance,
    pesertaManual,
    setPesertaManual,
    isGrupLocked = false,
}) => {
    const [showGrupDropdown, setShowGrupDropdown] = useState(false);
    const [searchGrup, setSearchGrup] = useState('');
    const [namaTamu, setNamaTamu] = useState('');
    const [ketTamu, setKetTamu] = useState('');

    const COLORS = ['bg-[#0080C5]','bg-[#10B981]','bg-[#F59E0B]','bg-[#EF4444]','bg-[#8B5CF6]'];

    const selectedGrups = selectedGrupIds
        .map((id) => grupOptions.find((g) => g.id_grup_dampingan === id) || grupDetails[id])
        .filter(Boolean);

    const filteredAvailableGrups = grupOptions.filter(g =>
        !selectedGrupIds.includes(g.id_grup_dampingan) &&
        g.name.toLowerCase().includes(searchGrup.toLowerCase())
    );

    const activeGrupDetail = activeGrupId ? grupDetails[activeGrupId] : null;
    const activeMembers = activeGrupDetail?.anggota_grup_dampingans || [];
    const hadirCount = activeMembers.filter((m) => attendance[m.id_anggota_grup]).length;

    const allMemberIds = selectedGrupIds.flatMap((id) =>
        grupDetails[id]?.anggota_grup_dampingans?.map((m) => m.id_anggota_grup) || []
    );
    const totalHadirKeseluruhan = allMemberIds.filter((id) => attendance[id]).length + pesertaManual.length;

    const handleToggleHadir = (anggotaId) => {
        setAttendance((prev) => ({ ...prev, [anggotaId]: !prev[anggotaId] }));
    };

    const handleHadirSemua = () => {
        if (!activeGrupId || activeMembers.length === 0) return;
        setAttendance((prev) => {
            const updated = { ...prev };
            activeMembers.forEach((m) => {
                updated[m.id_anggota_grup] = true;
            });
            return updated;
        });
    };

    const getGroupHadirCount = (grupId) => {
        const members = grupDetails[grupId]?.anggota_grup_dampingans || [];
        return members.filter((m) => attendance[m.id_anggota_grup]).length;
    };

    const getGroupTotal = (grupId) => {
        return grupDetails[grupId]?.anggota_grup_dampingans?.length || 0;
    };

    return (
        <div className="space-y-6">
            {/* Grup chips */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-800">Pilih Grup Dampingan <span className="text-red-500">*</span></label>
                    <span className="text-[10px] text-slate-400">{selectedGrups.length} grup dipilih</span>
                </div>
                {isGrupLocked && (
                    <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-2">
                        Mode koreksi absensi — grup dampingan tidak dapat diubah. Hanya kehadiran peserta yang boleh disesuaikan.
                    </p>
                )}
                <div className="flex flex-wrap gap-2 relative">
                    {selectedGrups.map((gr) => (
                        <div key={gr.id_grup_dampingan} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0080C5]/10 text-[#0080C5] rounded-full text-xs font-semibold">
                            {gr.name}
                            <span className="bg-[#0080C5] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]">
                                {getGroupTotal(gr.id_grup_dampingan) || '-'}
                            </span>
                            {!isGrupLocked && (
                                <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => onRemoveGrup(gr.id_grup_dampingan)} />
                            )}
                        </div>
                    ))}
                    {!isGrupLocked && (
                    <div className="relative">
                        <button onClick={() => setShowGrupDropdown(!showGrupDropdown)} className="flex items-center gap-1 px-3 py-1.5 border border-dashed border-slate-300 text-slate-400 rounded-full text-xs hover:border-[#0080C5] hover:text-[#0080C5] transition-all bg-white">
                            <Plus size={14} /> Tambah Grup
                        </button>
                        
                        {showGrupDropdown && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                                <div className="p-2 border-b border-slate-100">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                            value={searchGrup} 
                                            onChange={e => setSearchGrup(e.target.value)} 
                                            placeholder="Cari grup..." 
                                            className="w-full h-8 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="max-h-48 overflow-y-auto p-1">
                                    {filteredAvailableGrups.length === 0 ? (
                                        <div className="p-3 text-center text-xs text-slate-400">Grup tidak ditemukan</div>
                                    ) : (
                                        filteredAvailableGrups.map(g => (
                                            <button key={g.id_grup_dampingan} onClick={() => onAddGrup(g.id_grup_dampingan)} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between group">
                                                <span>{g.name}</span>
                                                <span className="text-[10px] text-slate-400 group-hover:text-[#0080C5]">
                                                    {getGroupTotal(g.id_grup_dampingan) || '-'} anggota
                                                </span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            {selectedGrups.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="flex border-b border-slate-200 overflow-x-auto">
                        {selectedGrups.map((gr) => (
                            <button key={gr.id_grup_dampingan} onClick={() => setActiveGrupId(gr.id_grup_dampingan)} className={`whitespace-nowrap px-5 py-3 text-xs font-semibold transition-colors ${activeGrupId === gr.id_grup_dampingan ? 'text-[#0080C5] border-b-2 border-[#0080C5] bg-[#0080C5]/5' : 'text-slate-400 hover:text-slate-700'}`}>
                                {gr.name} {getGroupHadirCount(gr.id_grup_dampingan)}/{getGroupTotal(gr.id_grup_dampingan) || 0}
                            </button>
                        ))}
                    </div>
                    {activeGrupId && loadingGrupIds[activeGrupId] && (
                        <div className="p-6 flex items-center justify-center text-slate-400 text-xs">
                            <Loader2 size={16} className="animate-spin mr-2" /> Memuat data anggota...
                        </div>
                    )}
                    {activeGrupDetail && (
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                <span>NAMA ANGGOTA — {activeGrupDetail.name?.toUpperCase()}</span>
                                <button onClick={handleHadirSemua} className="text-[10px] font-semibold text-[#0080C5] hover:underline">
                                    Hadir Semua
                                </button>
                                <span>STATUS KEHADIRAN</span>
                            </div>
                            <div className="space-y-3">
                                {activeMembers.map((anggota, j) => {
                                    const anggotaId = anggota.id_anggota_grup;
                                    const isHadir = !!attendance[anggotaId];
                                    const initials = String(anggota.name || '').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
                                    return (
                                        <div key={anggotaId} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full ${COLORS[j % COLORS.length]} text-white flex items-center justify-center text-xs font-bold`}>{initials}</div>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-800">{anggota.name}</p>
                                                    <p className="text-[10px] text-slate-400">{anggota.pekerjaan?.name || '-'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs font-semibold ${isHadir ? 'text-[#0080C5]' : 'text-red-400'}`}>{isHadir ? 'Hadir' : 'Tidak Hadir'}</span>
                                                <button onClick={() => handleToggleHadir(anggotaId)} className={`w-10 h-5 rounded-full transition-all ${isHadir ? 'bg-[#0080C5]' : 'bg-slate-200'} relative`}>
                                                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${isHadir ? 'right-0.5' : 'left-0.5'}`} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Progress */}
                            <div className="mt-4 flex items-center gap-4">
                                <span className="text-[10px] text-[#10B981] font-medium">● Hadir: {hadirCount}</span>
                                <span className="text-[10px] text-red-400 font-medium">● Tidak Hadir: {activeMembers.length - hadirCount}</span>
                                <span className="text-[10px] text-slate-400 font-medium">● Total: {activeMembers.length}</span>
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#10B981] rounded-full transition-all" style={{ width: `${activeMembers.length > 0 ? (hadirCount / activeMembers.length) * 100 : 0}%` }} />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-600">{activeMembers.length > 0 ? Math.round((hadirCount / activeMembers.length) * 100) : 0}%</span>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="border border-slate-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                        <UserCircle2 size={24} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 mb-1">Belum Ada Grup yang Dipilih</h4>
                    <p className="text-[10px] text-slate-500 max-w-xs">Silakan tambah grup dampingan terlebih dahulu untuk mulai melakukan absensi peserta.</p>
                </div>
            )}

            {/* Peserta Manual */}
            <div className="border-t border-slate-100 pt-4 mt-6">
                <p className="text-center text-xs text-slate-400 mb-4">— Tamu Undangan / Peserta Luar —</p>
                <h4 className="text-xs font-bold text-slate-800 mb-3">Tambah Peserta Manual</h4>
                <div className="flex flex-col lg:flex-row gap-3 mb-4">
                    <input value={namaTamu} onChange={e => setNamaTamu(e.target.value)} placeholder="Masukkan nama tamu/peserta luar..." className="flex-1 h-11 lg:h-10 px-4 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all bg-white" />
                    <input value={ketTamu} onChange={e => setKetTamu(e.target.value)} placeholder="Narasumber, Undangan, dll..." className="flex-1 h-11 lg:h-10 px-4 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all bg-white" />
                    <button onClick={() => { if(namaTamu) { setPesertaManual(p => [...p, {nama: namaTamu, ket: ketTamu}]); setNamaTamu(''); setKetTamu(''); }}} className="h-11 lg:h-10 px-4 bg-[#0080C5] text-white rounded-lg text-xs font-semibold hover:bg-sky-700 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95"><Plus size={14} /> Tambah</button>
                </div>
                
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead><tr className="border-b border-slate-100"><th className="py-2 px-3 text-left text-[10px] text-slate-400 font-bold uppercase tracking-wide">#</th><th className="py-2 px-3 text-left text-[10px] text-slate-400 font-bold uppercase tracking-wide">NAMA PESERTA</th><th className="py-2 px-3 text-left text-[10px] text-slate-400 font-bold uppercase tracking-wide">KETERANGAN</th><th className="py-2 px-3 text-left text-[10px] text-slate-400 font-bold uppercase tracking-wide">AKSI</th></tr></thead>
                        <tbody>
                            {pesertaManual.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-6 text-slate-300 text-xs">Belum ada peserta manual</td></tr>
                            ) : pesertaManual.map((p, i) => (
                                <tr key={i} className="border-b border-slate-50">
                                    <td className="py-2 px-3 text-slate-500">{i + 1}</td>
                                    <td className="py-2 px-3 font-semibold text-slate-800">{p.nama}</td>
                                    <td className="py-2 px-3 text-slate-500">{p.ket}</td>
                                    <td className="py-2 px-3"><button onClick={() => setPesertaManual(prev => prev.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 transition-colors"><X size={14} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden flex flex-col gap-2">
                    {pesertaManual.length === 0 ? (
                        <div className="text-center py-6 text-slate-300 text-[11px]">Belum ada peserta manual</div>
                    ) : pesertaManual.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-white shadow-sm">
                            <div className="flex flex-col">
                                <span className="font-semibold text-slate-800 text-[11px]">{p.nama}</span>
                                <span className="text-[10px] text-slate-500">{p.ket}</span>
                            </div>
                            <button onClick={() => setPesertaManual(prev => prev.filter((_, j) => j !== i))} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total Peserta Hadir Kalkulasi Otomatis */}
            <div className="mt-6 bg-[#0080C5]/5 border border-[#0080C5]/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0080C5]/10 rounded-lg flex items-center justify-center text-[#0080C5]">
                        <UserCircle2 size={20} />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-800">Total Kehadiran Seluruh Peserta</h4>
                        <p className="text-[10px] text-slate-500">Kalkulasi otomatis dari absensi grup dan peserta manual</p>
                    </div>
                </div>
                <div className="text-2xl font-bold text-[#0080C5]">
                    {totalHadirKeseluruhan} <span className="text-sm font-medium text-slate-500">orang</span>
                </div>
            </div>
        </div>
    );
};

// ─── Step 3: Ringkasan (Upload) ───────────────────────────────────────────────
const UploadBox = ({ icon, title, subtitle, label, accept, hint, optional = false, multiple = false, files = [], onChange, existingFiles = [], existingFileUrl, onDeleteExisting, showImagePreview = false, onRemoveFile, inputKey }) => {
    const normalizedFiles = useMemo(() => {
        return Array.isArray(files) ? files : files ? [files] : [];
    }, [files]);
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const baseUrl = apiUrl ? apiUrl.replace('/api', '') : '';
    const imagePreviews = useMemo(() => {
        if (!showImagePreview) return [];
        return normalizedFiles
            .map((file, idx) => {
                if (!file || !file.type || !file.type.startsWith('image/')) return null;
                return { index: idx, name: file.name, url: URL.createObjectURL(file) };
            })
            .filter(Boolean);
    }, [normalizedFiles, showImagePreview]);

    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, [imagePreviews]);
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className={`px-5 py-3.5 flex items-center gap-3 ${icon === 'image' ? 'bg-amber-50 border-b border-slate-200' : 'bg-red-50 border-b border-slate-200'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${icon === 'image' ? 'bg-amber-100 text-amber-500' : 'bg-red-100 text-red-500'}`}>
                    {icon === 'image' ? <Image size={16} /> : <FileText size={16} />}
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-800">
                        {title} {!optional && <span className="text-red-500">*</span>}
                        {optional && <span className="text-slate-400 font-normal text-[10px] ml-1">(opsional)</span>}
                    </p>
                    <p className="text-[10px] text-slate-400">{subtitle}</p>
                </div>
            </div>
            <div className="p-4">
                {label && <p className="text-xs font-semibold text-slate-700 mb-1">{label}</p>}
                {hint && <p className="text-[10px] text-slate-400 mb-3">{hint}</p>}
                
                {existingFiles && existingFiles.length > 0 && (
                    <div className="mb-4 space-y-2">
                        <p className="text-[11px] font-semibold text-slate-700">File Tersimpan:</p>
                        {existingFiles.map((file) => (
                            <div key={file.id_foto || file.id_foto_absensi} className="flex items-center justify-between p-2.5 border border-slate-200 rounded-lg bg-slate-50">
                                <a href={`${baseUrl}/storage/${file.file}`} target="_blank" rel="noreferrer" className="text-[11px] text-[#0080C5] hover:underline truncate mr-2 font-medium">
                                    {file.file?.split('/').pop() || 'File'}
                                </a>
                                <button type="button" onClick={() => onDeleteExisting(file.id_foto || file.id_foto_absensi)} className="w-6 h-6 rounded-md bg-white border border-slate-200 text-red-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors shrink-0">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {existingFileUrl && (
                    <div className="mb-4">
                        <p className="text-[11px] font-semibold text-slate-700">File Laporan Saat Ini:</p>
                        <a href={`${baseUrl}/storage/${existingFileUrl}`} target="_blank" rel="noreferrer" className="inline-block mt-1 text-[11px] text-[#0080C5] hover:underline truncate font-medium p-2.5 border border-slate-200 rounded-lg bg-slate-50 w-full">
                            {existingFileUrl.split('/').pop() || 'File'}
                        </a>
                    </div>
                )}

                {showImagePreview && imagePreviews.length > 0 && (
                    <div className="mb-4">
                        <p className="text-[11px] font-semibold text-slate-700">Preview Foto ({normalizedFiles.length} foto dipilih):</p>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                            {imagePreviews.map((preview) => (
                                <div key={preview.url} className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                    <img src={preview.url} alt={preview.name} className="h-24 w-full object-cover" />
                                    {onRemoveFile && (
                                        <button
                                            type="button"
                                            onClick={() => onRemoveFile(preview.index)}
                                            className="absolute right-1 top-1 w-6 h-6 rounded-md bg-white/90 border border-slate-200 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <label className="block border-2 border-dashed border-slate-200 rounded-xl py-10 text-center cursor-pointer hover:border-[#0080C5] transition-all group">
                    <input key={inputKey} type="file" accept={accept} multiple={multiple} onChange={onChange} className="hidden" />
                    <Upload size={24} className="mx-auto text-slate-300 group-hover:text-[#0080C5] transition-colors mb-2" />
                    <p className="text-xs text-slate-400">Seret & lepas {icon === 'image' ? 'foto' : 'file'} di sini</p>
                    <p className="text-xs text-slate-400">atau <span className="text-[#0080C5] underline">klik untuk memilih {icon === 'image' ? 'foto' : 'file'}</span></p>
                    <p className="text-[10px] text-slate-300 mt-1">{multiple ? 'Klik lagi untuk menambah foto lebih banyak · ' : ''}{icon === 'image' ? 'JPG, PNG, WEBP · Dapat memilih lebih dari 1 foto' : accept.includes('image/*') ? 'JPG, PNG, WEBP, PDF · Maks. 5 MB' : 'Hanya file PDF · Maks. 10 MB'}</p>
                </label>
                {normalizedFiles.length > 0 && (
                    <div className="mt-3">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Clock size={11} className="text-amber-500 shrink-0" />
                            <span className="text-[10px] font-semibold text-amber-600">{normalizedFiles.length} file siap diupload</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#fbbf24 transparent' }}>
                        {normalizedFiles.map((file, idx) => (
                            <div key={`${file.name}-${idx}`} className="relative flex flex-col items-center justify-between w-20 min-w-[5rem] h-20 border border-amber-200 rounded-xl bg-amber-50 p-2 shrink-0 group/card">
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                        <FileText size={16} className="text-amber-500" />
                                    </div>
                                </div>
                                <span className="text-[9px] text-amber-800 font-medium w-full text-center leading-tight line-clamp-2 break-all">{file.name}</span>
                                {onRemoveFile && (
                                    <button
                                        type="button"
                                        onClick={() => onRemoveFile(idx)}
                                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white border border-amber-200 text-amber-400 flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors shadow-sm"
                                    >
                                        <X size={9} />
                                    </button>
                                )}
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Step3 = ({ uploads, onUploadChange, onRemoveUpload, existingData, onDeleteExisting, fotoInputKey, absensiInputKey }) => (
    <div className="space-y-5">
        <UploadBox
            icon="image"
            title="Bukti Foto Kegiatan"
            subtitle="Unggah foto dokumentasi kegiatan (dapat lebih dari 1 foto)"
            accept="image/*"
            multiple
            files={uploads.fotoKegiatan}
            onChange={(e) => onUploadChange('fotoKegiatan', Array.from(e.target.files || []))}
            showImagePreview
            onRemoveFile={(index) => onRemoveUpload('fotoKegiatan', index)}
            existingFiles={existingData?.fotoKegiatans}
            onDeleteExisting={(id) => onDeleteExisting('fotoKegiatan', id)}
            inputKey={fotoInputKey}
        />
        <UploadBox
            icon="pdf"
            title="Laporan Kegiatan"
            subtitle="Unggah laporan kegiatan dalam format PDF"
            label="Upload Laporan (PDF)"
            hint="Unggah file laporan kegiatan sebagai dokumen resmi pelaporan"
            accept=".pdf"
            files={uploads.laporan}
            onChange={(e) => onUploadChange('laporan', e.target.files?.[0] || null)}
            onRemoveFile={() => onRemoveUpload('laporan', 0)}
            existingFileUrl={existingData?.laporanUrl}
        />
        <UploadBox
            icon="pdf"
            title="Absen Kegiatan"
            subtitle="Unggah absen kegiatan dalam format gambar atau PDF (opsional, dapat lebih dari 1 file)"
            label="Upload Absen"
            accept=".pdf,image/*"
            optional
            multiple
            files={uploads.absensi}
            onChange={(e) => onUploadChange('absensi', Array.from(e.target.files || []))}
            onRemoveFile={(index) => onRemoveUpload('absensi', index)}
            existingFiles={existingData?.fotoAbsensis}
            onDeleteExisting={(id) => onDeleteExisting('fotoAbsensi', id)}
            inputKey={absensiInputKey}
        />
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const TambahKegiatanPage = ({ isEdit = false }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { createKegiatan, updateKegiatan } = useKegiatanMutations();
    const currentUser = getUser();
    const roleName = typeof currentUser?.role === 'object' && currentUser?.role !== null ? currentUser.role.name : currentUser?.role;
    const isSuperadmin = roleName === 'superadmin' || currentUser?.username === 'superadmin';
    const showDraftButton = !(isEdit && isSuperadmin);

    const { data: bidangsData } = useBidangs();
    const bidangs = useMemo(() => bidangsData?.data || [], [bidangsData]);

    const { data: levelData } = useLevelKegiatans();
    const levelOptions = useMemo(() => levelData?.data || [], [levelData]);

    const { data: grupData } = useGrupDampingans({ per_page: 200 });
    const grupOptions = useMemo(() => grupData?.data || [], [grupData]);

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        judul: '',
        deskripsi: '',
        masalah: '',
        solusi: '',
        lokasi: '',
        tanggal: '',
        waktu: '',
        bidang_id: '',
        level_id: '',
        kode_prov: '',
        kode_kab: '',
        kode_kec: '',
    });
    const { data: provinsiList = [] } = useProvinsi();
    const { data: kabupatenList = [] } = useKabupaten(formData.kode_prov);
    const { data: kecamatanList = [] } = useKecamatan(formData.kode_kab);
    const [selectedGrupIds, setSelectedGrupIds] = useState([]);
    const [activeGrupId, setActiveGrupId] = useState(null);
    const [grupDetails, setGrupDetails] = useState({});
    const [loadingGrupIds, setLoadingGrupIds] = useState({});
    const [attendance, setAttendance] = useState({});
    const [pesertaManual, setPesertaManual] = useState([]);
    const [uploads, setUploads] = useState({
        fotoKegiatan: [],
        laporan: null,
        absensi: [],
    });
    // Counter key untuk reset file input setelah setiap pemilihan — agar bisa klik lagi untuk tambah foto
    const [fotoInputKey, setFotoInputKey] = useState(0);
    const [absensiInputKey, setAbsensiInputKey] = useState(0);
    const [existingData, setExistingData] = useState({
        fotoKegiatans: [],
        fotoAbsensis: [],
        laporanUrl: null
    });

    const resolvedLevelName = useMemo(() => {
        if (currentUser?.kode_kec) return 'Kecamatan';
        if (currentUser?.kode_kab) return 'Kabupaten';
        if (currentUser?.kode_prov) return 'Provinsi';
        return 'Nasional';
    }, [currentUser?.kode_kec, currentUser?.kode_kab, currentUser?.kode_prov]);

    const selectedLevelLabel = useMemo(() => {
        const byId = levelOptions.find((lvl) => lvl.id_level === formData.level_id);
        return byId?.nama_level || resolvedLevelName;
    }, [formData.level_id, levelOptions, resolvedLevelName]);

    useEffect(() => {
        if (!isEdit) {
            setFormData((prev) => ({
                ...prev,
                kode_prov: currentUser?.kode_prov || prev.kode_prov,
                kode_kab: currentUser?.kode_kab || prev.kode_kab,
                kode_kec: currentUser?.kode_kec || prev.kode_kec,
            }));
        }
    }, [isEdit, currentUser?.kode_prov, currentUser?.kode_kab, currentUser?.kode_kec]);

    useEffect(() => {
        if (!levelOptions.length || formData.level_id) return;
        const match = levelOptions.find(
            (lvl) => String(lvl.nama_level || '').toLowerCase() === resolvedLevelName.toLowerCase()
        );
        if (match) {
            setFormData((prev) => ({ ...prev, level_id: match.id_level }));
        }
    }, [levelOptions, formData.level_id, resolvedLevelName]);

    useEffect(() => {
        if (isEdit && id) {
            const fetchKegiatan = async () => {
                try {
                    const response = await kegiatanService.getById(id);
                    const data = response?.data || response;
                    setFormData({
                        judul: data?.judul || '',
                        deskripsi: data?.deskripsi || '',
                        masalah: data?.masalah || '',
                        solusi: data?.solusi || '',
                        lokasi: data?.lokasi || '',
                        tanggal: data?.tanggal || '',
                        waktu: data?.waktu ? String(data.waktu).slice(0, 5) : '',
                        bidang_id: data?.bidang_id || data?.bidang?.id_bidang || '',
                        level_id: data?.level_id || data?.level?.id_level || '',
                        kode_prov: data?.kode_prov || '',
                        kode_kab: data?.kode_kab || '',
                        kode_kec: data?.kode_kec || '',
                    });
                    setExistingData({
                        fotoKegiatans: data?.foto_kegiatans || [],
                        fotoAbsensis: data?.foto_absensis || [],
                        laporanUrl: data?.laporan || null
                    });
                    
                    if (data?.peserta_kegiatans) {
                        const manual = [];
                        const att = {};
                        data.peserta_kegiatans.forEach(p => {
                            if (p.jenis_peserta === 'eksternal') {
                                const match = p.nama_peserta.match(/^(.*?) \((.*?)\)$/);
                                if (match) {
                                    manual.push({ nama: match[1], ket: match[2] });
                                } else {
                                    manual.push({ nama: p.nama_peserta, ket: '' });
                                }
                            } else if (p.jenis_peserta === 'anggota') {
                                att[p.anggota_id] = p.status_hadir === 'hadir';
                            }
                        });
                        setPesertaManual(manual);
                        setAttendance(prev => ({ ...prev, ...att }));
                    }

                    const grupIds = data?.kegiatan_grups?.map((g) => g.grup_dampingan_id) || [];
                    setSelectedGrupIds(grupIds);
                    setActiveGrupId(grupIds[0] || null);
                } catch (error) {
                    console.error('Failed to fetch kegiatan details:', error);
                }
            };
            fetchKegiatan();
        }
    }, [isEdit, id]);

    useEffect(() => {
        selectedGrupIds.forEach((grupId) => {
            if (grupDetails[grupId] || loadingGrupIds[grupId]) return;
            const fetchGrupDetail = async () => {
                setLoadingGrupIds((prev) => ({ ...prev, [grupId]: true }));
                try {
                    const response = await grupDampinganService.getById(grupId);
                    const detail = response?.data || response;
                    const activeMembers = (detail?.anggota_grup_dampingans || []).filter(
                        (anggota) => String(anggota.status || '').toLowerCase() === 'aktif'
                    );
                    const normalizedDetail = { ...detail, anggota_grup_dampingans: activeMembers };
                    setGrupDetails((prev) => ({ ...prev, [grupId]: normalizedDetail }));
                    setAttendance((prev) => {
                        const updated = { ...prev };
                        activeMembers.forEach((anggota) => {
                            if (updated[anggota.id_anggota_grup] === undefined) {
                                updated[anggota.id_anggota_grup] = false;
                            }
                        });
                        return updated;
                    });
                } catch (error) {
                    console.error('Failed to fetch grup detail:', error);
                } finally {
                    setLoadingGrupIds((prev) => ({ ...prev, [grupId]: false }));
                }
            };
            fetchGrupDetail();
        });
    }, [selectedGrupIds, grupDetails, loadingGrupIds]);

    const handleDeleteExisting = async (type, idFile) => {
        const result = await Swal.fire({
            title: 'Hapus file ini?',
            text: 'File akan dihapus secara permanen.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#94A3B8',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            customClass: { popup: 'rounded-2xl font-["Poppins"]' }
        });

        if (result.isConfirmed) {
            try {
                if (type === 'fotoKegiatan') {
                    await kegiatanService.deleteFotoKegiatan(id, idFile);
                    setExistingData(prev => ({
                        ...prev,
                        fotoKegiatans: prev.fotoKegiatans.filter(f => f.id_foto !== idFile)
                    }));
                } else if (type === 'fotoAbsensi') {
                    await kegiatanService.deleteFotoAbsensi(id, idFile);
                    setExistingData(prev => ({
                        ...prev,
                        fotoAbsensis: prev.fotoAbsensis.filter(f => f.id_foto_absensi !== idFile)
                    }));
                }
                Swal.fire({ title: 'Terhapus!', icon: 'success', timer: 1000, showConfirmButton: false, customClass: { popup: 'rounded-2xl font-["Poppins"]' }});
            } catch {
                Swal.fire({ title: 'Gagal', text: 'Terjadi kesalahan saat menghapus file', icon: 'error', confirmButtonColor: '#0080C5', customClass: { popup: 'rounded-2xl font-["Poppins"]' }});
            }
        }
    };

    const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

    const handleWilayahChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
            ...(field === 'kode_prov' ? { kode_kab: '', kode_kec: '' } : {}),
            ...(field === 'kode_kab' ? { kode_kec: '' } : {}),
        }));
    };

    const handleUploadChange = (field, value) => {
        if (field === 'fotoKegiatan') {
            // APPEND ke array yang ada, bukan replace — sehingga foto bisa ditambah secara bertahap
            setUploads((prev) => ({ ...prev, fotoKegiatan: [...prev.fotoKegiatan, ...value] }));
            // Reset input key agar element file input di-unmount & remount (bisa klik lagi untuk tambah lebih banyak)
            setFotoInputKey((k) => k + 1);
        } else if (field === 'absensi') {
            // APPEND ke array absensi yang ada
            setUploads((prev) => ({ ...prev, absensi: [...prev.absensi, ...value] }));
            // Reset input key agar bisa klik lagi
            setAbsensiInputKey((k) => k + 1);
        } else {
            // laporan: single file, replace seperti biasa
            setUploads((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleRemoveUpload = (field, index) => {
        setUploads((prev) => {
            const current = prev[field];
            if (!Array.isArray(current)) {
                return { ...prev, [field]: null };
            }
            return { ...prev, [field]: current.filter((_, i) => i !== index) };
        });
    };

    const handleAddGrup = (grupId) => {
        setSelectedGrupIds((prev) => {
            if (prev.includes(grupId)) return prev;
            return [...prev, grupId];
        });
        if (!activeGrupId) setActiveGrupId(grupId);
    };

    const handleRemoveGrup = (grupId) => {
        setSelectedGrupIds((prev) => prev.filter((idItem) => idItem !== grupId));
        if (activeGrupId === grupId) {
            const remaining = selectedGrupIds.filter((idItem) => idItem !== grupId);
            setActiveGrupId(remaining[0] || null);
        }
        const members = grupDetails[grupId]?.anggota_grup_dampingans || [];
        setAttendance((prev) => {
            const updated = { ...prev };
            members.forEach((anggota) => {
                delete updated[anggota.id_anggota_grup];
            });
            return updated;
        });
    };

    const computeAttendanceSummary = () => {
        const memberIds = selectedGrupIds.flatMap((grupId) =>
            grupDetails[grupId]?.anggota_grup_dampingans?.map((m) => m.id_anggota_grup) || []
        );
        const hadirCount = memberIds.filter((idMember) => attendance[idMember]).length;
        const totalMembers = memberIds.length;
        const totalHadir = hadirCount + pesertaManual.length;
        const totalTidak = totalMembers - hadirCount;
        return { totalMembers, totalHadir, totalTidak, memberIds };
    };

    const resolveAttendanceMemberIds = () => {
        const { memberIds } = computeAttendanceSummary();
        return memberIds.length > 0 ? memberIds : Object.keys(attendance);
    };

    const buildPesertaPayload = () => {
        const memberIds = resolveAttendanceMemberIds();
        const internalPeserta = memberIds.map((anggotaId) => ({
            jenis_peserta: 'anggota',
            anggota_id: anggotaId,
            status_hadir: attendance[anggotaId] ? 'hadir' : 'tidak',
        }));
        const eksternalPeserta = pesertaManual.map((p) => ({
            jenis_peserta: 'eksternal',
            nama_peserta: p.ket ? `${p.nama} (${p.ket})` : p.nama,
            status_hadir: 'hadir',
        }));
        return [...internalPeserta, ...eksternalPeserta];
    };

    const shouldSyncPeserta = (allPeserta) =>
        allPeserta.length > 0 || (selectedGrupIds.length === 0 && pesertaManual.length === 0);

    const buildFormDataPayload = (payload) => {
        const formDataPayload = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            if (Array.isArray(value)) {
                if (value.length === 0) return;
                value.forEach((item) => formDataPayload.append(`${key}[]`, item));
                return;
            }
            formDataPayload.append(key, value);
        });
        return formDataPayload;
    };

    const buildPayload = (status) => {
        const { totalMembers, totalHadir, totalTidak } = computeAttendanceSummary();
        const payload = {
            judul: formData.judul,
            deskripsi: formData.deskripsi,
            masalah: formData.masalah,
            solusi: formData.solusi,
            tanggal: formData.tanggal,
            waktu: formData.waktu,
            lokasi: formData.lokasi,
            level_id: formData.level_id,
            bidang_id: formData.bidang_id,
            kode_prov: formData.kode_prov || undefined,
            kode_kab: formData.kode_kab || undefined,
            kode_kec: formData.kode_kec || undefined,
            status,
        };

        if ((!isEdit || selectedGrupIds.length > 0) && !(isEdit && isSuperadmin)) {
            payload.grup_dampingan_ids = selectedGrupIds;
        }

        if (totalMembers > 0 || pesertaManual.length > 0) {
            payload.jumlah_hadir = totalHadir;
            payload.jumlah_tdk_hadir = totalTidak;
        }

        if (uploads.laporan) {
            payload.laporan = uploads.laporan;
        }

        return payload;
    };

    const submitKegiatan = async (status) => {
        const payload = buildPayload(status);
        const hasFile = payload.laporan instanceof File;
        const requestData = hasFile ? buildFormDataPayload(payload) : payload;
        if (isEdit) {
            return updateKegiatan.mutateAsync({ id, data: requestData });
        }
        return createKegiatan.mutateAsync(requestData);
    };

    const validateRequiredFields = () => {
        if (!formData.judul || !formData.level_id || !formData.bidang_id) {
            Swal.fire({
                title: 'Lengkapi data wajib',
                text: 'Judul kegiatan, bidang, dan level kegiatan wajib diisi.',
                icon: 'warning',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' },
            });
            return false;
        }
        return true;
    };

    const handleSaveDraft = async () => {
        if (!validateRequiredFields()) return;
        setIsLoading(true);
        try {
            const response = await submitKegiatan('draft');
            const kegiatanId = isEdit ? id : response?.data?.id_kegiatan;
            if (kegiatanId) {
                const allPeserta = buildPesertaPayload();
                if (shouldSyncPeserta(allPeserta)) {
                    await kegiatanService.syncPeserta(kegiatanId, allPeserta);
                }
            }
            Swal.fire({ title: 'Tersimpan sebagai Draft', icon: 'info', confirmButtonColor: '#0080C5', timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-2xl font-["Poppins"]' } })
                .then(() => navigate('/kelola-kegiatan'));
        } catch {
            Swal.fire({ title: 'Gagal!', text: 'Terjadi kesalahan saat menyimpan draft.', icon: 'error', confirmButtonColor: '#0080C5', customClass: { popup: 'rounded-2xl font-["Poppins"]' } });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!validateRequiredFields()) return;
        if (!isEdit) {
            if (!uploads.laporan) {
                Swal.fire({ title: 'Laporan wajib diunggah', text: 'Silakan unggah laporan kegiatan (PDF).', icon: 'warning', confirmButtonColor: '#0080C5', customClass: { popup: 'rounded-2xl font-["Poppins"]' } });
                return;
            }
            if (!uploads.fotoKegiatan || uploads.fotoKegiatan.length === 0) {
                Swal.fire({ title: 'Foto kegiatan wajib diunggah', text: 'Silakan unggah minimal 1 foto kegiatan.', icon: 'warning', confirmButtonColor: '#0080C5', customClass: { popup: 'rounded-2xl font-["Poppins"]' } });
                return;
            }
        }

        setIsLoading(true);
        try {
            const response = await submitKegiatan('published');
            const kegiatanId = isEdit ? id : response?.data?.id_kegiatan;

            if (kegiatanId) {
                if (uploads.fotoKegiatan.length > 0) {
                    await kegiatanService.uploadFotoKegiatan(kegiatanId, uploads.fotoKegiatan);
                }
                if (uploads.absensi.length > 0) {
                    await kegiatanService.uploadFotoAbsensi(kegiatanId, uploads.absensi);
                }
            }

            if (kegiatanId) {
                const allPeserta = buildPesertaPayload();
                if (shouldSyncPeserta(allPeserta)) {
                    await kegiatanService.syncPeserta(kegiatanId, allPeserta);
                }
            }

            Swal.fire({ title: 'Berhasil!', text: 'Laporan kegiatan berhasil disimpan.', icon: 'success', confirmButtonColor: '#0080C5', customClass: { popup: 'rounded-2xl font-["Poppins"]' } })
                .then(() => navigate('/kelola-kegiatan'));
        } catch {
            Swal.fire({ title: 'Gagal!', text: 'Terjadi kesalahan saat menyimpan laporan kegiatan.', icon: 'error', confirmButtonColor: '#0080C5', customClass: { popup: 'rounded-2xl font-["Poppins"]' } });
        } finally {
            setIsLoading(false);
        }
    };

    const isProvDisabled = !!currentUser?.kode_prov;
    const isKabDisabled = !!currentUser?.kode_kab || !formData.kode_prov;
    const isKecDisabled = !!currentUser?.kode_kec || !formData.kode_kab;

    return (
        <AdminLayout title="Kelola Kegiatan">
            <div className="font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                {/* Top Banner Desktop */}
                <div className="hidden lg:flex bg-[#0080C5] rounded-2xl px-6 py-4 items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <UserCircle2 size={22} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-white text-sm font-bold">{isEdit ? 'Edit Kegiatan' : 'Tambah Kegiatan'}</h2>
                        <p className="text-white/70 text-xs">
                            {step === 1 ? 'Lengkapi informasi kegiatan dampingan' : step === 2 ? 'Absensi peserta kegiatan — Mode Manual' : 'Dokumentasi & Laporan Kegiatan'}
                        </p>
                    </div>
                </div>

                                {/* Card Container */}
                <div className="bg-white rounded-b-[16px] lg:rounded-2xl border-x border-b lg:border-[0.8px] border-[#F0F2F8] lg:border-slate-200 shadow-sm p-4 lg:p-8">
                    {/* Stepper with horizontal scroll on mobile */}
                    <div className="mb-6 lg:mb-8 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
                        <StepIndicator step={step} />
                    </div>
                    
                    {/* Content Steps */}
                    <div className="min-h-[300px]">
                        {step === 1 && (
                            <Step1
                                data={formData}
                                onChange={handleChange}
                                onWilayahChange={handleWilayahChange}
                                bidangs={bidangs}
                                levelLabel={selectedLevelLabel}
                                provinsiList={provinsiList}
                                kabupatenList={kabupatenList}
                                kecamatanList={kecamatanList}
                                isProvDisabled={isProvDisabled}
                                isKabDisabled={isKabDisabled}
                                isKecDisabled={isKecDisabled}
                            />
                        )}
                        {step === 2 && (
                            <Step2
                                grupOptions={grupOptions}
                                selectedGrupIds={selectedGrupIds}
                                onAddGrup={handleAddGrup}
                                onRemoveGrup={handleRemoveGrup}
                                activeGrupId={activeGrupId}
                                setActiveGrupId={setActiveGrupId}
                                grupDetails={grupDetails}
                                loadingGrupIds={loadingGrupIds}
                                attendance={attendance}
                                setAttendance={setAttendance}
                                pesertaManual={pesertaManual}
                                setPesertaManual={setPesertaManual}
                                isGrupLocked={isEdit && isSuperadmin}
                            />
                        )}
                        {step === 3 && (
                            <Step3
                                uploads={uploads}
                                onUploadChange={handleUploadChange}
                                onRemoveUpload={handleRemoveUpload}
                                existingData={existingData}
                                onDeleteExisting={handleDeleteExisting}
                                fotoInputKey={fotoInputKey}
                                absensiInputKey={absensiInputKey}
                            />
                        )}
                    </div>

                    {/* Footer Actions Desktop */}
                    <div className="hidden lg:flex mt-8 pt-5 border-t border-slate-100 items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">Langkah {step} dari 3</span>
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/kelola-kegiatan')} className="h-10 px-5 border border-slate-200 rounded-[10px] text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-all">Batal</button>
                            {showDraftButton && (
                                <button onClick={handleSaveDraft} className="h-10 px-5 border border-slate-200 rounded-[10px] text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                                    <Save size={14} /> Simpan Draf
                                </button>
                            )}
                            {step > 1 && (
                                <button onClick={() => setStep(s => s - 1)} className="h-10 px-5 border border-slate-200 rounded-[10px] text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                                    <ArrowLeft size={14} /> Kembali
                                </button>
                            )}
                            {step < 3 ? (
                                <button onClick={() => setStep(s => s + 1)} className="h-10 px-5 bg-[#0080C5] text-white rounded-[10px] text-xs font-semibold hover:bg-sky-700 transition-all flex items-center gap-2">
                                    Selanjutnya <ArrowRight size={14} />
                                </button>
                            ) : (
                                <button onClick={handleSubmit} disabled={isLoading} className="h-10 px-5 bg-[#10B981] text-white rounded-[10px] text-xs font-semibold hover:bg-emerald-600 transition-all flex items-center gap-2 disabled:opacity-50">
                                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                    {isLoading ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions Mobile */}
                    <div className="lg:hidden mt-6 pt-4 border-t-[0.8px] border-[#F0F2F8] flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            {step > 1 && (
                                <button onClick={() => setStep(s => s - 1)} className="flex-1 h-11 border border-[#E5E7EB] bg-white rounded-[12px] text-[12px] font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95">
                                    <ArrowLeft size={14} /> Kembali
                                </button>
                            )}
                            {step < 3 ? (
                                <button onClick={() => setStep(s => s + 1)} className="flex-1 h-11 bg-[#0080C5] text-white rounded-[12px] text-[12px] font-semibold hover:bg-sky-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                                    Selanjutnya <ArrowRight size={14} />
                                </button>
                            ) : (
                                <button onClick={handleSubmit} disabled={isLoading} className="flex-1 h-11 bg-[#10B981] text-white rounded-[12px] text-[12px] font-semibold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95">
                                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                    {isLoading ? 'Menyimpan...' : 'Simpan Laporan'}
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => navigate('/kelola-kegiatan')} className="flex-1 h-10 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
                                Batal
                            </button>
                            {showDraftButton && (
                                <button onClick={handleSaveDraft} className="flex-1 h-10 text-[11px] font-bold text-[#0080C5] hover:text-sky-700 transition-colors flex items-center justify-center gap-1.5">
                                    <Save size={12} /> Simpan Draf
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default TambahKegiatanPage;
