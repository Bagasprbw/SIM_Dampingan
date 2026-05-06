import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Save, ArrowRight, ArrowLeft, X, Plus, Upload, Image, FileText, Check, UserCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

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
            <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">Jumlah Peserta Hadir</label>
                <input type="number" value={data.jumlahPeserta || ''} onChange={e => onChange('jumlahPeserta', e.target.value)} placeholder="Input Jumlah...." className="w-full h-11 px-4 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all" />
            </div>
        </div>
    );
};

// ─── Step 2: Absensi Peserta ──────────────────────────────────────────────────
const Step2 = () => {
    const grups = [
        { nama: 'Kelompok Tani Makmur', total: 5, anggota: ['Budi Santoso','Siti Rahma','Ahmad Fauzi','Dewi Lestari','Rudi Hartono'], jabatan: ['Ketua','Anggota','Anggota','Sekretaris','Anggota'] },
        { nama: 'Kelompok Josjis', total: 4, anggota: ['Hendra','Rina','Bowo','Tari'], jabatan: ['Ketua','Anggota','Anggota','Anggota'] },
    ];
    const [activeGrup, setActiveGrup] = useState(0);
    const [hadir, setHadir] = useState({});
    const [pesertaManual, setPesertaManual] = useState([]);
    const [namaTamu, setNamaTamu] = useState('');
    const [ketTamu, setKetTamu] = useState('');

    const COLORS = ['bg-[#0080C5]','bg-[#10B981]','bg-[#F59E0B]','bg-[#EF4444]','bg-[#8B5CF6]'];
    const g = grups[activeGrup];
    const hadirCount = g.anggota.filter((_, i) => hadir[`${activeGrup}-${i}`]).length;

    return (
        <div className="space-y-6">
            {/* Grup chips */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-800">Pilih Grup Dampingan <span className="text-red-500">*</span></label>
                    <span className="text-[10px] text-slate-400">{grups.length} grup dipilih</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {grups.map((gr, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0080C5]/10 text-[#0080C5] rounded-full text-xs font-semibold">
                            {gr.nama} <span className="bg-[#0080C5] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]">{gr.total}</span>
                            <X size={12} className="cursor-pointer hover:text-red-500" />
                        </div>
                    ))}
                    <button className="flex items-center gap-1 px-3 py-1.5 border border-dashed border-slate-300 text-slate-400 rounded-full text-xs hover:border-[#0080C5] hover:text-[#0080C5] transition-all"><Plus size={12} /> + Grup</button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="flex border-b border-slate-200">
                    {grups.map((gr, i) => (
                        <button key={i} onClick={() => setActiveGrup(i)} className={`px-5 py-3 text-xs font-semibold transition-colors ${activeGrup === i ? 'text-[#0080C5] border-b-2 border-[#0080C5] bg-[#0080C5]/5' : 'text-slate-400 hover:text-slate-700'}`}>
                            {gr.nama} {gr.anggota.filter((_, j) => hadir[`${i}-${j}`]).length}/{gr.total}
                        </button>
                    ))}
                </div>
                <div className="p-4">
                    <div className="flex justify-between mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>NAMA ANGGOTA — {g.nama.toUpperCase()}</span>
                        <span>STATUS KEHADIRAN</span>
                    </div>
                    <div className="space-y-3">
                        {g.anggota.map((nama, j) => {
                            const key = `${activeGrup}-${j}`;
                            const isHadir = !!hadir[key];
                            const initials = nama.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
                            return (
                                <div key={j} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full ${COLORS[j % COLORS.length]} text-white flex items-center justify-center text-xs font-bold`}>{initials}</div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-800">{nama}</p>
                                            <p className="text-[10px] text-slate-400">{g.jabatan[j]}</p>
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
                        <span className="text-[10px] text-red-400 font-medium">● Tidak Hadir: {g.total - hadirCount}</span>
                        <span className="text-[10px] text-slate-400 font-medium">● Total: {g.total}</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#10B981] rounded-full transition-all" style={{ width: `${(hadirCount / g.total) * 100}%` }} />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-600">{Math.round((hadirCount / g.total) * 100)}%</span>
                    </div>
                </div>
            </div>

            {/* Peserta Manual */}
            <div className="border-t border-slate-100 pt-4">
                <p className="text-center text-xs text-slate-400 mb-4">— Tamu Undangan / Peserta Luar —</p>
                <h4 className="text-xs font-bold text-slate-800 mb-3">Tambah Peserta Manual</h4>
                <div className="flex gap-3 mb-3">
                    <input value={namaTamu} onChange={e => setNamaTamu(e.target.value)} placeholder="Masukkan nama tamu/peserta luar..." className="flex-1 h-10 px-4 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all" />
                    <input value={ketTamu} onChange={e => setKetTamu(e.target.value)} placeholder="Narasumber, Undangan, dll..." className="flex-1 h-10 px-4 border border-slate-200 rounded-lg text-xs focus:border-[#0080C5] focus:outline-none transition-all" />
                    <button onClick={() => { if(namaTamu) { setPesertaManual(p => [...p, {nama: namaTamu, ket: ketTamu}]); setNamaTamu(''); setKetTamu(''); }}} className="h-10 px-4 bg-[#0080C5] text-white rounded-lg text-xs font-semibold hover:bg-sky-700 transition-all flex items-center gap-1.5 whitespace-nowrap"><Plus size={14} /> + Tambah</button>
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
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    const handleChange = (field, value) => setFormData(p => ({ ...p, [field]: value }));

    const handleSaveDraft = () => {
        Swal.fire({ title: 'Tersimpan sebagai Draft', icon: 'info', confirmButtonColor: '#0080C5', timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-2xl font-["Poppins"]' } });
    };

    const handleSubmit = () => {
        Swal.fire({ title: 'Berhasil!', text: 'Laporan kegiatan berhasil disimpan.', icon: 'success', confirmButtonColor: '#0080C5', customClass: { popup: 'rounded-2xl font-["Poppins"]' } })
            .then(() => navigate('/kelola-kegiatan'));
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
                                <button onClick={handleSubmit} className="h-10 px-5 bg-[#10B981] text-white rounded-[10px] text-xs font-semibold hover:bg-emerald-600 transition-all flex items-center gap-2">
                                    <Check size={14} /> Simpan
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
