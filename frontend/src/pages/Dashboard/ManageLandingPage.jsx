import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { landingPageService } from '../../services/landingPageService';
import { resolveStorageUrl } from '../../utils/resolveStorageUrl';
import {
    Save, Upload, Image, Globe, FileText,
    BookOpen, Loader2, X, AlertCircle, Info, LayoutGrid
} from 'lucide-react';
import Swal from 'sweetalert2';

const ManageLandingPage = () => {
    const fileInputRef = useRef(null);
    const loginFileInputRef = useRef(null);
    
    // States
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [halamanUtama, setHalamanUtama] = useState({
        judul_website: '',
        deskripsi_website: '',
        tentang: '',
        filosofi: '',
        hero_image: null,
        hero_image_url: null,
        login_image: null,
        login_image_url: null,
    });
    
    const [bidangs, setBidangs] = useState([]);
    const [bidangDescriptions, setBidangDescriptions] = useState({});
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const [selectedLoginFile, setSelectedLoginFile] = useState(null);
    const [loginImagePreview, setLoginImagePreview] = useState(null);
    const [dragOverLogin, setDragOverLogin] = useState(false);

    // Fetch initial data
    useEffect(() => {
        const loadLandingData = async () => {
            try {
                const response = await landingPageService.getLandingPageData();
                if (response.status === 'success') {
                    const hu = response.data.halaman_utama || {};
                    setHalamanUtama({
                        judul_website: hu.judul_website || '',
                        deskripsi_website: hu.deskripsi_website || '',
                        tentang: hu.tentang || '',
                        filosofi: hu.filosofi || '',
                        hero_image: hu.hero_image || null,
                        hero_image_url: hu.hero_image_url || null,
                        login_image: hu.login_image || null,
                        login_image_url: hu.login_image_url || null,
                    });
                    
                    const listBidang = response.data.bidangs || [];
                    setBidangs(listBidang);
                    
                    // Map descriptions by bidang ID
                    const descs = {};
                    listBidang.forEach(b => {
                        descs[b.id_bidang] = b.deskripsi || '';
                    });
                    setBidangDescriptions(descs);
                }
            } catch (err) {
                console.error("Gagal mengambil data landing page:", err);
                Swal.fire({
                    title: 'Gagal Memuat Data',
                    text: 'Terjadi kesalahan saat mengambil data landing page dari server.',
                    icon: 'error',
                    confirmButtonColor: '#EF4444',
                    customClass: { popup: 'rounded-3xl font-["Poppins"]' },
                });
            } finally {
                setLoading(false);
            }
        };
        
        loadLandingData();
    }, []);

    // Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHalamanUtama(prev => ({ ...prev, [name]: value }));
    };

    const handleBidangDescChange = (id_bidang, value) => {
        setBidangDescriptions(prev => ({ ...prev, [id_bidang]: value }));
    };

    const handleFileSelect = (file) => {
        if (!file) return;
        
        // Validation
        if (!file.type.startsWith('image/')) {
            Swal.fire({
                title: 'File Tidak Valid',
                text: 'Hanya file gambar (JPEG, PNG, JPG, WEBP) yang diizinkan.',
                icon: 'warning',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-3xl font-["Poppins"]' },
            });
            return;
        }
        
        if (file.size > 2 * 1024 * 1024) {
            Swal.fire({
                title: 'File Terlalu Besar',
                text: 'Ukuran maksimal gambar hero adalah 2MB.',
                icon: 'warning',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-3xl font-["Poppins"]' },
            });
            return;
        }
        
        setSelectedFile(file);
        
        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleClearSelectedFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleLoginFileSelect = (file) => {
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            Swal.fire({
                title: 'File Tidak Valid',
                text: 'Hanya file gambar (JPEG, PNG, JPG, WEBP) yang diizinkan.',
                icon: 'warning',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-3xl font-["Poppins"]' },
            });
            return;
        }
        
        if (file.size > 2 * 1024 * 1024) {
            Swal.fire({
                title: 'File Terlalu Besar',
                text: 'Ukuran maksimal gambar login adalah 2MB.',
                icon: 'warning',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-3xl font-["Poppins"]' },
            });
            return;
        }
        
        setSelectedLoginFile(file);
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setLoginImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleLoginDrop = (e) => {
        e.preventDefault();
        setDragOverLogin(false);
        const file = e.dataTransfer.files[0];
        handleLoginFileSelect(file);
    };

    const handleClearSelectedLoginFile = (e) => {
        e.stopPropagation();
        setSelectedLoginFile(null);
        setLoginImagePreview(null);
        if (loginFileInputRef.current) loginFileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Form validations
        if (!halamanUtama.judul_website.trim()) {
            Swal.fire({ title: 'Input Tidak Lengkap', text: 'Judul website wajib diisi.', icon: 'warning', confirmButtonColor: '#0080C5' });
            return;
        }
        if (!halamanUtama.deskripsi_website.trim()) {
            Swal.fire({ title: 'Input Tidak Lengkap', text: 'Deskripsi website wajib diisi.', icon: 'warning', confirmButtonColor: '#0080C5' });
            return;
        }
        if (!halamanUtama.tentang.trim()) {
            Swal.fire({ title: 'Input Tidak Lengkap', text: 'Teks Tentang MPM wajib diisi.', icon: 'warning', confirmButtonColor: '#0080C5' });
            return;
        }
        if (!halamanUtama.filosofi.trim()) {
            Swal.fire({ title: 'Input Tidak Lengkap', text: 'Teks Filosofi MPM wajib diisi.', icon: 'warning', confirmButtonColor: '#0080C5' });
            return;
        }
        
        setSaving(true);
        
        try {
            const formData = new FormData();
            formData.append('judul_website', halamanUtama.judul_website);
            formData.append('deskripsi_website', halamanUtama.deskripsi_website);
            formData.append('tentang', halamanUtama.tentang);
            formData.append('filosofi', halamanUtama.filosofi);
            
            if (selectedFile) {
                formData.append('hero_image', selectedFile);
            }
            if (selectedLoginFile) {
                formData.append('login_image', selectedLoginFile);
            }
            
            // Append bidang descriptions
            Object.keys(bidangDescriptions).forEach(id_bidang => {
                formData.append(`bidang_descriptions[${id_bidang}]`, bidangDescriptions[id_bidang]);
            });
            
            const response = await landingPageService.updateLandingPageData(formData);
            
            if (response.status === 'success') {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Konfigurasi Landing Page berhasil diperbarui.',
                    icon: 'success',
                    confirmButtonColor: '#0080C5',
                    customClass: { popup: 'rounded-3xl font-["Poppins"]' },
                });
                
                // Clear state selection
                setSelectedFile(null);
                setImagePreview(null);
                
                // Update halamanUtama state with latest save
                const updatedHu = response.data.halaman_utama;
                setHalamanUtama(prev => ({
                    ...prev,
                    hero_image: updatedHu.hero_image,
                    hero_image_url: updatedHu.hero_image_url,
                    login_image: updatedHu.login_image,
                    login_image_url: updatedHu.login_image_url,
                }));
                
                setSelectedLoginFile(null);
                setLoginImagePreview(null);
            }
        } catch (err) {
            console.error("Gagal menyimpan konfigurasi landing page:", err);
            Swal.fire({
                title: 'Gagal Menyimpan',
                text: err?.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.',
                icon: 'error',
                confirmButtonColor: '#EF4444',
                customClass: { popup: 'rounded-3xl font-["Poppins"]' },
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Kelola Landing Page">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-[#0080C5]" size={36} />
                        <p className="text-slate-500 font-medium text-sm font-['Poppins']">Memuat konfigurasi landing page...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Kelola Landing Page">
            <div className="font-['Poppins'] min-h-screen bg-[#F0F2F8] flex flex-col gap-6 pb-12">
                
                {/* ── Header ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-7 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-base font-bold text-[#0A0F1E] tracking-tight">Kelola Landing Page</h2>
                        <p className="text-xs text-slate-400 mt-1">Sesuaikan informasi umum, filosofi, tentang, hero image, dan deskripsi bidang fokus di landing page publik.</p>
                    </div>
                    
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="self-start md:self-auto h-10 px-5 flex items-center justify-center gap-2 bg-[#0080C5] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#0080C5]/20 hover:shadow-[#0080C5]/30 hover:bg-sky-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* ── Left Column: Halaman Utama Forms ── */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        
                        {/* Section 1: Brand & Hero Header */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <Globe size={16} className="text-[#0080C5]" />
                                <h3 className="text-sm font-bold text-slate-800">Bagian Utama (Hero Section)</h3>
                            </div>
                            
                            <div className="p-6 flex flex-col gap-5">
                                {/* Judul Website */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="judul_website" className="text-xs font-bold text-slate-700">Judul Utama Website</label>
                                    <input
                                        id="judul_website"
                                        name="judul_website"
                                        type="text"
                                        value={halamanUtama.judul_website}
                                        onChange={handleInputChange}
                                        placeholder="Contoh: Sistem Informasi Manajemen Dampingan MPM DIY"
                                        className="h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0080C5] focus:ring-1 focus:ring-[#0080C5] text-xs text-slate-800 transition-all"
                                        required
                                    />
                                    <span className="text-[10px] text-slate-400">Teks heading utama yang ditampilkan tebal di landing page.</span>
                                </div>
                                
                                {/* Deskripsi Website */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="deskripsi_website" className="text-xs font-bold text-slate-700">Deskripsi Utama</label>
                                    <textarea
                                        id="deskripsi_website"
                                        name="deskripsi_website"
                                        value={halamanUtama.deskripsi_website}
                                        onChange={handleInputChange}
                                        placeholder="Tulis ringkasan singkat selamat datang..."
                                        rows={4}
                                        className="p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0080C5] focus:ring-1 focus:ring-[#0080C5] text-xs text-slate-800 transition-all resize-none"
                                        required
                                    />
                                    <span className="text-[10px] text-slate-400">Deskripsi yang berada di bawah judul utama website.</span>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Tentang & Filosofi */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <FileText size={16} className="text-[#0080C5]" />
                                <h3 className="text-sm font-bold text-slate-800">Profil & Filosofi MPM</h3>
                            </div>
                            
                            <div className="p-6 flex flex-col gap-5">
                                {/* Tentang */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="tentang" className="text-xs font-bold text-slate-700">Tentang Majelis Pemberdayaan Masyarakat (MPM)</label>
                                    <textarea
                                        id="tentang"
                                        name="tentang"
                                        value={halamanUtama.tentang}
                                        onChange={handleInputChange}
                                        placeholder="Jelaskan sejarah, tujuan, dan fokus MPM..."
                                        rows={6}
                                        className="p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0080C5] focus:ring-1 focus:ring-[#0080C5] text-xs text-slate-800 transition-all resize-none"
                                        required
                                    />
                                    <span className="text-[10px] text-slate-400">Teks profil lengkap MPM. Tekan Enter untuk memisah paragraf (akan otomatis dirender terpisah).</span>
                                </div>
                                
                                {/* Filosofi */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="filosofi" className="text-xs font-bold text-slate-700">Filosofi MPM</label>
                                    <textarea
                                        id="filosofi"
                                        name="filosofi"
                                        value={halamanUtama.filosofi}
                                        onChange={handleInputChange}
                                        placeholder="Contoh: Mengembangkan cebong menjadi katak..."
                                        rows={3}
                                        className="p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0080C5] focus:ring-1 focus:ring-[#0080C5] text-xs text-slate-800 transition-all resize-none italic"
                                        required
                                    />
                                    <span className="text-[10px] text-slate-400">Semboyan atau kutipan filosofi pemberdayaan yang akan dicetak miring di box.</span>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Hero Image Upload */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <Image size={16} className="text-[#0080C5]" />
                                <h3 className="text-sm font-bold text-slate-800">Gambar Hero Utama</h3>
                            </div>
                            
                            <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
                                {/* Current / Selected Image Preview */}
                                <div className="w-full md:w-1/2 aspect-[4/3] rounded-xl bg-slate-50 border border-slate-200 overflow-hidden relative flex items-center justify-center group shadow-inner">
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Pratinjau Hero Baru" className="w-full h-full object-cover" />
                                            <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors cursor-pointer" onClick={handleClearSelectedFile}>
                                                <X size={14} />
                                            </div>
                                            <span className="absolute bottom-2 left-2 bg-blue-500/80 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">Unggahan Baru (Pratinjau)</span>
                                        </>
                                    ) : halamanUtama.hero_image ? (
                                        <>
                                            <img src={resolveStorageUrl(halamanUtama.hero_image)} alt="Hero Saat Ini" className="w-full h-full object-cover" />
                                            <span className="absolute bottom-2 left-2 bg-slate-900/60 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">Gambar Aktif di Server</span>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-300">
                                            <Image size={42} />
                                            <span className="text-[10px] font-medium text-slate-400">Tidak ada gambar kustom (menggunakan default)</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Dropzone */}
                                <div className="w-full md:w-1/2 flex flex-col gap-3">
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                                            ${dragOver ? 'border-[#0080C5] bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-[#0080C5] hover:bg-blue-50/20'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${dragOver ? 'bg-[#0080C5] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <Upload size={20} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-semibold text-slate-600">
                                                {selectedFile ? selectedFile.name : 'Seret & letakkan gambar di sini'}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-1">Atau klik untuk memilih file • Maks. 2MB • Format JPG/PNG/WEBP</p>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileSelect(e.target.files[0])}
                                        />
                                    </div>
                                    
                                    <div className="flex items-start gap-1.5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                        <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-[9px] text-amber-700 leading-normal">
                                            <strong>Catatan:</strong> Apabila Anda mengunggah gambar hero baru, sistem akan otomatis menghapus gambar lama secara permanen dari penyimpanan server.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Login Image Upload */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <Image size={16} className="text-[#0080C5]" />
                                <h3 className="text-sm font-bold text-slate-800">Gambar Halaman Login</h3>
                            </div>
                            
                            <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
                                {/* Current / Selected Image Preview */}
                                <div className="w-full md:w-1/2 aspect-[9/16] max-h-[300px] rounded-xl bg-slate-50 border border-slate-200 overflow-hidden relative flex items-center justify-center group shadow-inner">
                                    {loginImagePreview ? (
                                        <>
                                            <img src={loginImagePreview} alt="Pratinjau Login Baru" className="w-full h-full object-cover" />
                                            <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors cursor-pointer" onClick={handleClearSelectedLoginFile}>
                                                <X size={14} />
                                            </div>
                                            <span className="absolute bottom-2 left-2 bg-blue-500/80 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">Unggahan Baru (Pratinjau)</span>
                                        </>
                                    ) : halamanUtama.login_image ? (
                                        <>
                                            <img src={resolveStorageUrl(halamanUtama.login_image)} alt="Login Saat Ini" className="w-full h-full object-cover" />
                                            <span className="absolute bottom-2 left-2 bg-slate-900/60 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">Gambar Aktif di Server</span>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-300">
                                            <Image size={42} />
                                            <span className="text-[10px] font-medium text-slate-400">Menggunakan gambar default</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Dropzone */}
                                <div className="w-full md:w-1/2 flex flex-col gap-3">
                                    <div
                                        onDrop={handleLoginDrop}
                                        onDragOver={(e) => { e.preventDefault(); setDragOverLogin(true); }}
                                        onDragLeave={() => setDragOverLogin(false)}
                                        onClick={() => loginFileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                                            ${dragOverLogin ? 'border-[#0080C5] bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-[#0080C5] hover:bg-blue-50/20'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${dragOverLogin ? 'bg-[#0080C5] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <Upload size={20} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-semibold text-slate-600">
                                                {selectedLoginFile ? selectedLoginFile.name : 'Seret & letakkan gambar di sini'}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-1">Klik untuk memilih file • Maks. 2MB • JPG/PNG/WEBP</p>
                                        </div>
                                        <input
                                            ref={loginFileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleLoginFileSelect(e.target.files[0])}
                                        />
                                    </div>
                                    
                                    <div className="flex items-start gap-1.5 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                        <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-blue-700 leading-normal">
                                            <strong>Rekomendasi Ukuran:</strong> Agar gambar pas dan proporsional di halaman Login Desktop, disarankan menggunakan rasio <strong>9:16 (Potrait)</strong> dengan ukuran sekitar <strong>665 x 1080 pixel</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    {/* ── Right Column: Bidang Fokus Descriptions ── */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <LayoutGrid size={16} className="text-[#0080C5]" />
                                <h3 className="text-sm font-bold text-slate-800">Deskripsi Bidang Fokus</h3>
                            </div>
                            
                            <div className="p-6 flex flex-col gap-5">
                                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2">
                                    <Info size={15} className="text-[#0080C5] shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-[#0080C5] leading-normal">
                                        Deskripsi ini akan ditayangkan secara dinamis dalam bentuk kartu di pilar program landing page.
                                    </p>
                                </div>
                                
                                {bidangs.length === 0 ? (
                                    <div className="text-center py-6 text-slate-400 text-xs">
                                        Tidak ada data bidang. Silakan isi master data bidang terlebih dahulu.
                                    </div>
                                ) : (
                                    bidangs.map((bidang) => (
                                        <div key={bidang.id_bidang} className="flex flex-col gap-1.5 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                                            <label htmlFor={`bidang-${bidang.id_bidang}`} className="text-xs font-bold text-slate-800 flex items-center justify-between">
                                                <span>{bidang.name}</span>
                                                <span className="text-[9px] text-slate-400 font-normal">Sektor Dampingan</span>
                                            </label>
                                            <textarea
                                                id={`bidang-${bidang.id_bidang}`}
                                                value={bidangDescriptions[bidang.id_bidang] || ''}
                                                onChange={(e) => handleBidangDescChange(bidang.id_bidang, e.target.value)}
                                                placeholder={`Deskripsikan program pendampingan untuk bidang ${bidang.name}...`}
                                                rows={4}
                                                className="p-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#0080C5] focus:ring-1 focus:ring-[#0080C5] text-xs text-slate-800 transition-all resize-none"
                                                required
                                            />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default ManageLandingPage;
