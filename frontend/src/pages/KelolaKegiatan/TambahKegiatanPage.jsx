import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, Save, ArrowRight, ArrowLeft, X, Plus, Upload, Image, FileText, Check, UserCircle2, Search, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useKegiatanMutations } from '../../hooks/mutations/useKegiatanMutation';
import { kegiatanService } from '../../services/kegiatanService';

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
const Step1 = ({ data, onChange }) => {
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
            <div className="grid grid-cols-2 gap-4">
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
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">Alamat Pelaksanaan <span className="text-red-500">*</span></label>
                <input value={data.alamat || ''} onChange={e => onChange('alamat', e.target.value)} placeholder="Balai Desa Maju, Jl. Raya Sejahtera No. 12" className="w-full h-11 px-4 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all" />
            </div>
            <div className="grid grid-cols-3 gap-4">
                {['Provinsi','Kabupaten/Kota','Kecamatan'].map(lbl => (
                    <div key={lbl}>
                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">{lbl} <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select className="w-full h-11 pl-4 pr-8 border border-slate-200 rounded-lg text-xs text-slate-400 appearance-none focus:border-[#0080C5] focus:outline-none transition-all">
                                <option>Pilih...</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">Tanggal Pelaksanaan <span className="text-red-500">*</span></label>
                    <input type="date" value={data.tanggal || ''} onChange={e => onChange('tanggal', e.target.value)} className="w-full h-11 px-4 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">Waktu <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2">
                        <input type="time" value={data.waktuMulai || ''} onChange={e => onChange('waktuMulai', e.target.value)} className="flex-1 h-11 px-4 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all" />
                        <span className="text-slate-400 text-xs font-medium">s/d</span>
                        <input type="time" value={data.waktuSelesai || ''} onChange={e => onChange('waktuSelesai', e.target.value)} className="flex-1 h-11 px-4 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all" />
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">Bidang Dampingan <span className="text-red-500">*</span></label>
                <div className="relative">
                    <select className="w-full h-11 pl-4 pr-8 border border-slate-200 rounded-lg text-xs text-slate-400 appearance-none focus:border-[#0080C5] focus:outline-none transition-all">
                        <option>Pilih...</option>
                        <option>Pertanian</option>
                        <option>Peternakan</option>
                        <option>Perikanan</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

// ─── Step 2: Absensi Peserta ──────────────────────────────────────────────────
const Step2 = () => {
    const allGrups = [
        { id: 1, nama: 'Kelompok Tani Makmur', total: 5, anggota: ['Budi Santoso','Siti Rahma','Ahmad Fauzi','Dewi Lestari','Rudi Hartono'], jabatan: ['Ketua','Anggota','Anggota','Sekretaris','Anggota'] },
        { id: 2, nama: 'Kelompok Josjis', total: 4, anggota: ['Hendra','Rina','Bowo','Tari'], jabatan: ['Ketua','Anggota','Anggota','Anggota'] },
        { id: 3, nama: 'Kelompok Sumber Rejeki', total: 3, anggota: ['Joko', 'Widodo', 'Amin'], jabatan: ['Ketua', 'Anggota', 'Anggota'] },
        { id: 4, nama: 'Kelompok Sido Makmur', total: 6, anggota: ['Andi', 'Eko', 'Sari', 'Yanto', 'Bambang', 'Cici'], jabatan: ['Ketua', 'Sekretaris', 'Bendahara', 'Anggota', 'Anggota', 'Anggota'] },
    ];
    
    const [selectedGrups, setSelectedGrups] = useState([]);
    const [activeGrupId, setActiveGrupId] = useState(null);
    const [showGrupDropdown, setShowGrupDropdown] = useState(false);
    const [searchGrup, setSearchGrup] = useState('');
    
    const [hadir, setHadir] = useState({});
    const [pesertaManual, setPesertaManual] = useState([]);
    const [namaTamu, setNamaTamu] = useState('');
    const [ketTamu, setKetTamu] = useState('');

    const COLORS = ['bg-[#0080C5]','bg-[#10B981]','bg-[#F59E0B]','bg-[#EF4444]','bg-[#8B5CF6]'];
    
    const handleAddGrup = (grup) => {
        if (!selectedGrups.find(g => g.id === grup.id)) {
            const newSelected = [...selectedGrups, grup];
            setSelectedGrups(newSelected);
            if (!activeGrupId) setActiveGrupId(grup.id);
        }
        setShowGrupDropdown(false);
        setSearchGrup('');
    };

    const handleRemoveGrup = (grupId) => {
        const newSelected = selectedGrups.filter(g => g.id !== grupId);
        setSelectedGrups(newSelected);
        if (activeGrupId === grupId) {
            setActiveGrupId(newSelected.length > 0 ? newSelected[0].id : null);
        }
        const newHadir = { ...hadir };
        Object.keys(newHadir).forEach(key => {
            if (key.startsWith(`${grupId}-`)) delete newHadir[key];
        });
        setHadir(newHadir);
    };

    const filteredAvailableGrups = allGrups.filter(g => 
        !selectedGrups.find(sg => sg.id === g.id) && 
        g.nama.toLowerCase().includes(searchGrup.toLowerCase())
    );

    const activeGrup = selectedGrups.find(g => g.id === activeGrupId);
    let hadirCount = 0;
    if (activeGrup) {
        hadirCount = activeGrup.anggota.filter((_, i) => hadir[`${activeGrup.id}-${i}`]).length;
    }

    const totalHadirKeseluruhan = Object.values(hadir).filter(Boolean).length + pesertaManual.length;

    return (
        <div className="space-y-6">
            {/* Grup chips */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-800">Pilih Grup Dampingan <span className="text-red-500">*</span></label>
                    <span className="text-[10px] text-slate-400">{selectedGrups.length} grup dipilih</span>
                </div>
                <div className="flex flex-wrap gap-2 relative">
                    {selectedGrups.map((gr) => (
                        <div key={gr.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0080C5]/10 text-[#0080C5] rounded-full text-xs font-semibold">
                            {gr.nama} <span className="bg-[#0080C5] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]">{gr.total}</span>
                            <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => handleRemoveGrup(gr.id)} />
                        </div>
                    ))}
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
                                            <button key={g.id} onClick={() => handleAddGrup(g)} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between group">
                                                <span>{g.nama}</span>
                                                <span className="text-[10px] text-slate-400 group-hover:text-[#0080C5]">{g.total} anggota</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            {selectedGrups.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="flex border-b border-slate-200 overflow-x-auto">
                        {selectedGrups.map((gr) => (
                            <button key={gr.id} onClick={() => setActiveGrupId(gr.id)} className={`whitespace-nowrap px-5 py-3 text-xs font-semibold transition-colors ${activeGrupId === gr.id ? 'text-[#0080C5] border-b-2 border-[#0080C5] bg-[#0080C5]/5' : 'text-slate-400 hover:text-slate-700'}`}>
                                {gr.nama} {gr.anggota.filter((_, j) => hadir[`${gr.id}-${j}`]).length}/{gr.total}
                            </button>
                        ))}
                    </div>
                    {activeGrup && (
                        <div className="p-4">
                            <div className="flex justify-between mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                <span>NAMA ANGGOTA — {activeGrup.nama.toUpperCase()}</span>
                                <span>STATUS KEHADIRAN</span>
                            </div>
                            <div className="space-y-3">
                                {activeGrup.anggota.map((nama, j) => {
                                    const key = `${activeGrup.id}-${j}`;
                                    const isHadir = !!hadir[key];
                                    const initials = nama.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
                                    return (
                                        <div key={j} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full ${COLORS[j % COLORS.length]} text-white flex items-center justify-center text-xs font-bold`}>{initials}</div>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-800">{nama}</p>
                                                    <p className="text-[10px] text-slate-400">{activeGrup.jabatan[j]}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs font-semibold ${isHadir ? 'text-[#0080C5]' : 'text-red-400'}`}>{isHadir ? 'Hadir' : 'Tidak Hadir'}</span>
                                                <button onClick={() => setHadir(p => ({...p, [key]: !p[key]}))} className={`w-10 h-5 rounded-full transition-all ${isHadir ? 'bg-[#0080C5]' : 'bg-slate-200'} relative`}>
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
                                <span className="text-[10px] text-red-400 font-medium">● Tidak Hadir: {activeGrup.total - hadirCount}</span>
                                <span className="text-[10px] text-slate-400 font-medium">● Total: {activeGrup.total}</span>
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#10B981] rounded-full transition-all" style={{ width: `${(hadirCount / activeGrup.total) * 100}%` }} />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-600">{Math.round((hadirCount / activeGrup.total) * 100)}%</span>
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
            <div className="border-t border-slate-100 pt-4">
                <p className="text-center text-xs text-slate-400 mb-4">— Tamu Undangan / Peserta Luar —</p>
                <h4 className="text-xs font-bold text-slate-800 mb-3">Tambah Peserta Manual</h4>
                <div className="flex gap-3 mb-3">
                    <input value={namaTamu} onChange={e => setNamaTamu(e.target.value)} placeholder="Masukkan nama tamu/peserta luar..." className="flex-1 h-10 px-4 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all" />
                    <input value={ketTamu} onChange={e => setKetTamu(e.target.value)} placeholder="Narasumber, Undangan, dll..." className="flex-1 h-10 px-4 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all" />
                    <button onClick={() => { if(namaTamu) { setPesertaManual(p => [...p, {nama: namaTamu, ket: ketTamu}]); setNamaTamu(''); setKetTamu(''); }}} className="h-10 px-4 bg-[#0080C5] text-white rounded-lg text-xs font-semibold hover:bg-sky-700 transition-all flex items-center gap-1.5 whitespace-nowrap"><Plus size={14} /> Tambah</button>
                </div>
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
const UploadBox = ({ icon, title, subtitle, label, accept, hint, optional = false }) => (
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
            <label className="block border-2 border-dashed border-slate-200 rounded-xl py-10 text-center cursor-pointer hover:border-[#0080C5] transition-all group">
                <input type="file" accept={accept} className="hidden" />
                <Upload size={24} className="mx-auto text-slate-300 group-hover:text-[#0080C5] transition-colors mb-2" />
                <p className="text-xs text-slate-400">Seret & lepas {icon === 'image' ? 'foto' : 'file PDF'} di sini</p>
                <p className="text-xs text-slate-400">atau <span className="text-[#0080C5] underline">klik untuk memilih {icon === 'image' ? 'foto' : 'file'}</span></p>
                <p className="text-[10px] text-slate-300 mt-1">{icon === 'image' ? 'JPG, PNG, WEBP · Dapat memilih lebih dari 1 foto' : 'Hanya file PDF · Maks. 10 MB'}</p>
            </label>
        </div>
    </div>
);

const Step3 = () => (
    <div className="space-y-5">
        <UploadBox icon="image" title="Bukti Foto Kegiatan" subtitle="Unggah foto dokumentasi kegiatan (dapat lebih dari 1 foto)" accept="image/*" />
        <UploadBox icon="pdf" title="Laporan Kegiatan" subtitle="Unggah laporan kegiatan dalam format PDF" label="Upload Laporan (PDF)" hint="Unggah file laporan kegiatan sebagai dokumen resmi pelaporan" accept=".pdf" />
        <UploadBox icon="pdf" title="Absen Kegiatan" subtitle="Unggah absen kegiatan dalam format PDF (opsional)" label="Upload Absen (PDF)" accept=".pdf" optional />
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const TambahKegiatanPage = ({ isEdit = false }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { createKegiatan, updateKegiatan } = useKegiatanMutations();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (isEdit && id) {
            const fetchKegiatan = async () => {
                try {
                    const data = await kegiatanService.getById(id);
                    setFormData(data); // Assume data matches form shape or map it appropriately
                } catch (error) {
                    console.error('Failed to fetch kegiatan details:', error);
                }
            };
            fetchKegiatan();
        }
    }, [isEdit, id]);

    const handleChange = (field, value) => setFormData(p => ({ ...p, [field]: value }));

    const handleSaveDraft = () => {
        setIsLoading(true);
        const dataToSave = { ...formData, status: 'Draft' };
        const mutation = isEdit ? updateKegiatan : createKegiatan;
        const payload = isEdit ? { id, data: dataToSave } : dataToSave;

        mutation.mutate(payload, {
            onSuccess: () => {
                setIsLoading(false);
                Swal.fire({ title: 'Tersimpan sebagai Draft', icon: 'info', confirmButtonColor: '#0080C5', timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-2xl font-["Poppins"]' } })
                    .then(() => navigate('/kelola-kegiatan'));
            },
            onError: () => {
                setIsLoading(false);
                Swal.fire({ title: 'Gagal!', text: 'Terjadi kesalahan saat menyimpan draft.', icon: 'error', confirmButtonColor: '#0080C5', customClass: { popup: 'rounded-2xl font-["Poppins"]' } });
            }
        });
    };

    const handleSubmit = () => {
        setIsLoading(true);
        const dataToSave = { ...formData, status: 'Selesai' };
        const mutation = isEdit ? updateKegiatan : createKegiatan;
        const payload = isEdit ? { id, data: dataToSave } : dataToSave;

        mutation.mutate(payload, {
            onSuccess: () => {
                setIsLoading(false);
                Swal.fire({ title: 'Berhasil!', text: 'Laporan kegiatan berhasil disimpan.', icon: 'success', confirmButtonColor: '#0080C5', customClass: { popup: 'rounded-2xl font-["Poppins"]' } })
                    .then(() => navigate('/kelola-kegiatan'));
            },
            onError: () => {
                setIsLoading(false);
                Swal.fire({ title: 'Gagal!', text: 'Terjadi kesalahan saat menyimpan laporan kegiatan.', icon: 'error', confirmButtonColor: '#0080C5', customClass: { popup: 'rounded-2xl font-["Poppins"]' } });
            }
        });
    };

    return (
        <AdminLayout title="Kelola Kegiatan">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                {/* Top Banner */}
                <div className="bg-[#0080C5] rounded-2xl px-6 py-4 flex items-center gap-4 mb-6">
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

                {/* Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                    <StepIndicator step={step} />
                    {step === 1 && <Step1 data={formData} onChange={handleChange} />}
                    {step === 2 && <Step2 />}
                    {step === 3 && <Step3 />}

                    {/* Footer Actions */}
                    <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">Langkah {step} dari 3</span>
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/kelola-kegiatan')} className="h-10 px-5 border border-slate-200 rounded-[10px] text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-all">Batal</button>
                            <button onClick={handleSaveDraft} className="h-10 px-5 border border-slate-200 rounded-[10px] text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                                <Save size={14} /> Simpan Draf
                            </button>
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
                </div>
            </div>
        </AdminLayout>
    );
};

export default TambahKegiatanPage;
