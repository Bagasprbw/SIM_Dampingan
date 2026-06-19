import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/storage';
import PublicMap from '../../components/common/PublicMap';
import { usePublicStatistics } from '../../hooks/queries/usePublicQuery';
import { publicService } from '../../services/publicService';
import {
    ArrowRight,
    Users,
    MapPin,
    Calendar,
    HeartHandshake,
    Sprout,
    Anchor,
    Accessibility,
    Briefcase,
    BookOpen,
    Mail,
    Phone,
    Map,
    Info,
    Shield
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isLoggedIn] = useState(() => isAuthenticated());
    const [scrolled, setScrolled] = useState(false);
    
    const [landingData, setLandingData] = useState(null);
    const [loadingLanding, setLoadingLanding] = useState(true);

    useEffect(() => {
        const fetchLandingData = async () => {
            try {
                const response = await publicService.getLandingPage();
                if (response.status === 'success') {
                    setLandingData(response.data);
                }
            } catch (err) {
                console.error("Gagal memuat data landing page", err);
            } finally {
                setLoadingLanding(false);
            }
        };
        fetchLandingData();
    }, []);

    const getBidangIcon = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('tani') || lower.includes('kebun') || lower.includes('sprout')) {
            return <Sprout size={24} />;
        }
        if (lower.includes('nelayan') || lower.includes('laut') || lower.includes('anchor') || lower.includes('pesir')) {
            return <Anchor size={24} />;
        }
        if (lower.includes('difabel') || lower.includes('disabilitas') || lower.includes('akses') || lower.includes('accessibility')) {
            return <Accessibility size={24} />;
        }
        if (lower.includes('pedagang') || lower.includes('pasar') || lower.includes('umkm') || lower.includes('dagang') || lower.includes('wirausaha') || lower.includes('usaha')) {
            return <Briefcase size={24} />;
        }
        return <Users size={24} />;
    };

    const getBidangColorClass = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('tani')) return { bg: 'bg-emerald-50 text-emerald-600', badge: 'text-emerald-600', border: 'hover:border-emerald-500/40' };
        if (lower.includes('nelayan')) return { bg: 'bg-sky-50 text-[#0080C5]', badge: 'text-[#0080C5]', border: 'hover:border-[#0080C5]/40' };
        if (lower.includes('difabel')) return { bg: 'bg-rose-50 text-rose-500', badge: 'text-rose-500', border: 'hover:border-rose-500/40' };
        if (lower.includes('pedagang') || lower.includes('umkm') || lower.includes('usaha')) return { bg: 'bg-teal-50 text-teal-600', badge: 'text-teal-600', border: 'hover:border-teal-500/40' };
        return { bg: 'bg-indigo-50 text-indigo-500', badge: 'text-indigo-500', border: 'hover:border-indigo-500/40' };
    };

    // Fetch statistics dari API
    const { data: statsData, isLoading: statsLoading } = usePublicStatistics();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Smooth scroll function
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-[#0080C5]/30 selection:text-[#0080C5] overflow-x-hidden">
            
            {/* ── FLOAT NAVBAR ── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? 'py-3 bg-white/80 backdrop-blur-md shadow-md border-b border-slate-200/50' 
                    : 'py-5 bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    
                    {/* Brand Logo & Name */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img
                            src="/images/logo-mpm.png"
                            alt="Logo MPM"
                            className="w-[36px] sm:w-[42px] h-auto object-contain"
                        />
                        <div className="flex flex-col">
                            <span className="text-[#0080C5] text-sm sm:text-base font-bold tracking-wider leading-none">MENTORA</span>
                            <span className="text-slate-500 text-[10px] sm:text-xs font-medium mt-1">SIM Dampingan MPM</span>
                        </div>
                    </div>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-slate-600 hover:text-[#0080C5] text-sm font-semibold tracking-wide transition-colors cursor-pointer"
                        >
                            Beranda
                        </button>
                        <button 
                            onClick={() => scrollToSection('peta')}
                            className="text-slate-600 hover:text-[#0080C5] text-sm font-semibold tracking-wide transition-colors cursor-pointer"
                        >
                            Peta Sebaran
                        </button>
                        <button 
                            onClick={() => scrollToSection('tentang')}
                            className="text-slate-600 hover:text-[#0080C5] text-sm font-semibold tracking-wide transition-colors cursor-pointer"
                        >
                            Tentang
                        </button>
                        <button 
                            onClick={() => scrollToSection('program')}
                            className="text-slate-600 hover:text-[#0080C5] text-sm font-semibold tracking-wide transition-colors cursor-pointer"
                        >
                            Bidang Fokus
                        </button>
                        <button 
                            onClick={() => scrollToSection('kontak')}
                            className="text-slate-600 hover:text-[#0080C5] text-sm font-semibold tracking-wide transition-colors cursor-pointer"
                        >
                            Kontak
                        </button>
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center gap-3">
                        {isLoggedIn ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-5 py-2 sm:py-2.5 bg-[#0080C5] hover:bg-[#006ba6] text-white text-xs sm:text-sm font-semibold tracking-wide rounded-full flex items-center gap-1.5 shadow-lg shadow-[#0080C5]/20 hover:shadow-[#0080C5]/30 transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                            >
                                Ke Dashboard
                                <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="px-5 py-2 sm:py-2.5 bg-[#0080C5] hover:bg-[#006ba6] text-white text-xs sm:text-sm font-semibold tracking-wide rounded-full flex items-center gap-1.5 shadow-lg shadow-[#0080C5]/20 hover:shadow-[#0080C5]/30 transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                            >
                                Masuk Sistem
                                <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── HERO SECTION ── */}
            <header className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-sky-100 via-sky-50/50 to-slate-50 overflow-hidden">
                {/* Decorative Blurs */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-100/40 blur-3xl pointer-events-none"></div>
                <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#0080C5]/10 blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        
                        {/* Hero Text */}
                        <div className="lg:col-span-7 flex flex-col items-start text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/50 text-emerald-800 text-xs font-semibold mb-6">
                                <Shield size={14} className="text-emerald-600" />
                                <span>Pemberdayaan Berbasis Teologi Al-Ma'un</span>
                            </div>
                            
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] text-slate-900 font-bold leading-tight tracking-tight mb-6">
                                {landingData?.halaman_utama?.judul_website || 'Sistem Informasi Manajemen Dampingan MPM Muhammadiyah'}
                            </h1>

                            <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal mb-8 max-w-[620px]">
                                {landingData?.halaman_utama?.deskripsi_website || "Selamat datang di Mentora, platform integrasi data dan monitoring kelompok dampingan Majelis Pemberdayaan Masyarakat (MPM) Muhammadiyah. Kami berkomitmen mewujudkan kemandirian mustadh'afin secara terukur, terarah, dan berkelanjutan."}
                            </p>

                            <div className="flex flex-wrap items-center gap-4">
                                <button
                                    onClick={() => scrollToSection('program')}
                                    className="px-6 py-3 bg-[#0080C5] hover:bg-[#006ba6] text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-[#0080C5]/20 hover:shadow-[#0080C5]/30 transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                                >
                                    Jelajahi Program Dampingan
                                </button>
                                <button
                                    onClick={() => scrollToSection('tentang')}
                                    className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                                >
                                    Pelajari Profil MPM
                                </button>
                            </div>
                        </div>

                        {/* Hero Image / Mockup Card */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative w-full max-w-[460px]">
                                {/* Card Shadow Backdrop */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-[#0080C5] rounded-[24px] blur-xl opacity-20 transform translate-x-3 translate-y-3 -rotate-1"></div>
                                
                                <div className="relative bg-white p-3 rounded-[24px] shadow-2xl border border-slate-100 transform hover:scale-[1.02] transition-transform duration-300">
                                    <div className="rounded-[18px] overflow-hidden aspect-[4/3] bg-slate-100 relative">
                                        <img
                                            src={landingData?.halaman_utama?.hero_image_url || "/images/mentora-hero.png"}
                                            alt="Mentora Hero"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-5">
                                            <p className="text-white text-xs sm:text-sm font-medium tracking-wide">
                                                Pendampingan Kelompok Dampingan MPM di Lapangan
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </header>

            {/* ── STATISTICS SECTION ── */}
            <section className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-white p-6 sm:p-8 rounded-[24px] shadow-xl border border-slate-200/60">
                        
                        {/* Stat 1: Wilayah (Provinsi & Kab/Kota) */}
                        <div className="flex flex-col items-center text-center p-4 border-r border-slate-100 last:border-0 max-lg:even:border-r-0 max-sm:border-r-0 max-sm:border-b max-sm:pb-6 last:border-b-0">
                            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-[#0080C5] mb-3">
                                <MapPin size={24} />
                            </div>
                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                {statsLoading ? '...' : `${statsData?.data?.total_wilayah || 0}`}
                            </span>
                            <span className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-wider uppercase mt-1">Provinsi & Kab/Kota</span>
                        </div>

                        {/* Stat 2: Kelompok Dampingan */}
                        <div className="flex flex-col items-center text-center p-4 border-r border-slate-100 last:border-0 max-lg:border-r-0 max-sm:border-r-0 max-sm:border-b max-sm:py-6 last:border-b-0">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                                <Users size={24} />
                            </div>
                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                {statsLoading ? '...' : `${statsData?.data?.total_grup_dampingan || 0}`}
                            </span>
                            <span className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-wider uppercase mt-1">Kelompok Binaan</span>
                        </div>

                        {/* Stat 3: Masyarakat Dampingan (Anggota Aktif) */}
                        <div className="flex flex-col items-center text-center p-4 border-r border-slate-100 last:border-0 max-sm:border-r-0 max-sm:border-b max-sm:py-6 last:border-b-0">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 mb-3">
                                <HeartHandshake size={24} />
                            </div>
                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                {statsLoading ? '...' : `${statsData?.data?.total_anggota || 0}`}
                            </span>
                            <span className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-wider uppercase mt-1">Penerima Manfaat</span>
                        </div>

                        {/* Stat 4: Kegiatan Pemberdayaan */}
                        <div className="flex flex-col items-center text-center p-4 last:border-0 max-sm:pt-6">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-3">
                                <Calendar size={24} />
                            </div>
                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                {statsLoading ? '...' : `${statsData?.data?.total_kegiatan || 0}`}
                            </span>
                            <span className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-wider uppercase mt-1">Kegiatan Pemberdayaan</span>
                        </div>

                    </div>
                </div>
            </section>

            
            {/* ── MAP SECTION ── */}
            <section id="peta" className="py-20 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-100/30 rounded-full blur-3xl pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0080C5]/10 border border-[#0080C5]/20 text-[#0080C5] text-xs font-semibold mb-4">
                            <Map size={14} className="text-[#0080C5]" />
                            <span>Jangkauan Dampingan</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Peta Sebaran Mentora</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
                            Persebaran kelompok dampingan Majelis Pemberdayaan Masyarakat (MPM) Muhammadiyah di berbagai wilayah Indonesia.
                        </p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-[32px] shadow-xl border border-slate-200">
                        <PublicMap />
                    </div>
                </div>
            </section>

            {/* ── TENTANG MPM SECTION ── */}
            <section id="tentang" className="py-20 md:py-28 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        
                        <div className="lg:col-span-5">
                            <div className="p-1 bg-white rounded-3xl shadow-lg border border-slate-200/50">
                                <div className="p-6 bg-gradient-to-br from-emerald-500 to-[#0080C5] text-white rounded-[20px]">
                                    <h3 className="text-xl font-bold tracking-wide mb-4">Filosofi MPM</h3>
                                    <p className="text-sky-50/90 text-sm leading-relaxed mb-6 italic">
                                        "{landingData?.halaman_utama?.filosofi || "Mengembangkan cebong yang hanya mampu hidup di dalam kolam kecil menjadi katak yang dapat meloncat ke mana-mana."}"
                                    </p>
                                    <p className="text-sky-100 text-xs font-semibold uppercase tracking-wider">
                                        - Mengubah Ketergantungan Menjadi Kemandirian -
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100/80 border border-sky-200/50 text-[#0080C5] text-xs font-semibold mb-5 w-fit">
                                <Info size={14} />
                                <span>Profil Majelis Pemberdayaan Masyarakat</span>
                            </div>
                            
                            <h2 className="text-2xl sm:text-3xl md:text-4xl text-slate-900 font-bold tracking-tight mb-6">
                                Mewujudkan Keadilan Sosial Melalui <br/>
                                Pendampingan yang Komprehensif
                            </h2>

                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 whitespace-pre-line">
                                {landingData?.halaman_utama?.tentang || `Majelis Pemberdayaan Masyarakat (MPM) Muhammadiyah adalah salah satu unsur pembantu pimpinan di tingkat Pimpinan Pusat (PP) Muhammadiyah yang berdiri kokoh mengemban amanat khusus untuk pemberdayaan masyarakat.\n\nFokus utama kami adalah kelompok dhu'afa (lemah) dan mustadh'afin (terpinggirkan) secara struktural maupun kultural. Melalui pendekatan ekologi perkembangan manusia, kami berupaya mengentaskan kemiskinan, memajukan kemandirian ekonomi, serta memperluas akses sosial-politik bagi mereka yang membutuhkan.`}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">✓</div>
                                    <div>
                                        <h4 className="text-slate-900 text-sm font-semibold mb-1">Dakwah Pemberdayaan</h4>
                                        <p className="text-slate-500 text-xs leading-normal">Menerjemahkan teologi Al-Ma'un menjadi solusi nyata di lapangan.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">✓</div>
                                    <div>
                                        <h4 className="text-slate-900 text-sm font-semibold mb-1">Mandiri & Produktif</h4>
                                        <p className="text-slate-500 text-xs leading-normal">Mentransformasi penerima manfaat menjadi subjek berdaya yang aktif.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── PROGRAM / BIDANG FOKUS SECTION ── */}
            <section id="program" className="py-20 md:py-28 bg-white border-y border-slate-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col items-center text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/85 border border-emerald-200/50 text-emerald-800 text-xs font-semibold mb-5">
                            <BookOpen size={14} className="text-emerald-600" />
                            <span>Pilar-Pilar Pemberdayaan</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl text-slate-900 font-bold tracking-tight mb-4">
                            Bidang Fokus Dampingan MPM
                        </h2>
                        <p className="text-slate-500 text-sm sm:text-base max-w-[650px] leading-relaxed">
                            Kami melaksanakan pendampingan intensif yang dikelompokkan ke dalam beberapa sektor strategis guna memaksimalkan hasil dan jangkauan pemberdayaan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {landingData?.bidangs && landingData.bidangs.filter(b => b.deskripsi && b.deskripsi.trim() !== '').length > 0 ? (
                            landingData.bidangs
                                .filter(b => b.deskripsi && b.deskripsi.trim() !== '')
                                .map((bidang, index) => {
                                    const colors = getBidangColorClass(bidang.name);
                                    return (
                                        <div key={bidang.id_bidang || index} className={`group p-6 bg-slate-50 rounded-2xl border border-slate-200/70 ${colors.border} hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col`}>
                                            <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                                {getBidangIcon(bidang.name)}
                                            </div>
                                            <h3 className="text-slate-950 font-bold text-lg mb-2">{bidang.name}</h3>
                                            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 flex-grow">
                                                {bidang.deskripsi}
                                            </p>
                                            <span className={`text-[11px] font-semibold ${colors.badge} uppercase tracking-wider`}>Program Pemberdayaan</span>
                                        </div>
                                    );
                                })
                        ) : landingData?.bidangs ? (
                            <div className="col-span-full py-8 text-center text-slate-400 text-sm">
                                Belum ada bidang fokus pemberdayaan yang dipublikasikan.
                            </div>
                        ) : (
                            <>
                                {/* Bidang 1 */}
                                <div className="group p-6 bg-slate-50 rounded-2xl border border-slate-200/70 hover:border-[#0080C5]/40 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                        <Sprout size={24} />
                                    </div>
                                    <h3 className="text-slate-950 font-bold text-lg mb-2">Pertanian & Perkebunan</h3>
                                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 flex-grow">
                                        Pengembangan sistem pertanian berkelanjutan, edukasi pupuk organik mandiri, pendampingan pasca-panen, serta pembukaan akses pasar tani.
                                    </p>
                                    <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Kelompok Tani Binaan</span>
                                </div>

                                {/* Bidang 2 */}
                                <div className="group p-6 bg-slate-50 rounded-2xl border border-slate-200/70 hover:border-[#0080C5]/40 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col">
                                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0080C5] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                        <Anchor size={24} />
                                    </div>
                                    <h3 className="text-slate-950 font-bold text-lg mb-2">Nelayan & Kemaritiman</h3>
                                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 flex-grow">
                                        Pemberdayaan nelayan tradisional melalui penyediaan alat tangkap ramah lingkungan, manajemen pemasaran hasil laut, dan penguatan ekonomi keluarga pesisir.
                                    </p>
                                    <span className="text-[11px] font-semibold text-[#0080C5] uppercase tracking-wider">Kelompok Pesisir & Nelayan</span>
                                </div>

                                {/* Bidang 3 */}
                                <div className="group p-6 bg-slate-50 rounded-2xl border border-slate-200/70 hover:border-[#0080C5]/40 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col">
                                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                        <Accessibility size={24} />
                                    </div>
                                    <h3 className="text-slate-950 font-bold text-lg mb-2">Penyandang Disabilitas</h3>
                                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 flex-grow">
                                        Penyediaan ruang pelatihan keterampilan inklusif, pendampingan kemandirian wirausaha, serta sosialisasi aksesibilitas fasilitas umum.
                                    </p>
                                    <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider">Kelompok Difabel Berdaya</span>
                                </div>

                                {/* Bidang 4 */}
                                <div className="group p-6 bg-slate-50 rounded-2xl border border-slate-200/70 hover:border-[#0080C5]/40 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                        <Users size={24} />
                                    </div>
                                    <h3 className="text-slate-950 font-bold text-lg mb-2">Masyarakat Miskin Kota</h3>
                                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 flex-grow">
                                        Pembinaan bagi pemulung, pengayuh becak, dan pedagang asongan melalui koperasi simpan pinjam mikro, pendidikan alternatif anak jalanan, dan pelatihan keterampilan praktis.
                                    </p>
                                    <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-wider">Pemberdayaan Kaum Marjinal</span>
                                </div>

                                {/* Bidang 5 */}
                                <div className="group p-6 bg-slate-50 rounded-2xl border border-slate-200/70 hover:border-[#0080C5]/40 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col">
                                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                        <Map size={24} />
                                    </div>
                                    <h3 className="text-slate-950 font-bold text-lg mb-2">Daerah 3T & Pedalaman</h3>
                                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 flex-grow">
                                        Pendampingan kelompok masyarakat adat, kawasan tertinggal, terluar, dan terdepan (3T) melalui pemenuhan sanitasi air bersih, elektrifikasi mandiri, dan literasi.
                                    </p>
                                    <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider">Aksi Daerah Tertinggal</span>
                                </div>

                                {/* Bidang 6 */}
                                <div className="group p-6 bg-slate-50 rounded-2xl border border-slate-200/70 hover:border-[#0080C5]/40 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col">
                                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                        <Briefcase size={24} />
                                    </div>
                                    <h3 className="text-slate-950 font-bold text-lg mb-2">Pengembangan UMKM Binaan</h3>
                                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 flex-grow">
                                        Fasilitasi sertifikasi halal, standardisasi produk makanan/kerajinan, digitalisasi usaha kecil, serta pendirian unit usaha bersama.
                                    </p>
                                    <span className="text-[11px] font-semibold text-teal-600 uppercase tracking-wider">Penguatan Ekonomi Lokal</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ── FOOTER & KONTAK SECTION ── */}
            <footer id="kontak" className="bg-slate-900 text-slate-300 pt-20 pb-10 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
                        
                        {/* Footer Brand info */}
                        <div className="md:col-span-5 flex flex-col items-start">
                            <div className="flex items-center gap-3 mb-6">
                                <img
                                    src="/images/logo-mpm.png"
                                    alt="Logo MPM"
                                    className="w-[44px] h-auto object-contain brightness-0 invert"
                                />
                                <div className="flex flex-col">
                                    <span className="text-white text-base font-bold tracking-wider leading-none">MENTORA</span>
                                    <span className="text-slate-400 text-xs font-medium mt-1">SIM Dampingan MPM PP Muhammadiyah</span>
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-[380px] mb-6">
                                Platform integrasi manajemen data dampingan nasional Majelis Pemberdayaan Masyarakat Pimpinan Pusat Muhammadiyah.
                            </p>
                            <div className="flex items-center gap-4 text-slate-500">
                                <span className="text-xs text-slate-400">© 2026 PP Muhammadiyah</span>
                            </div>
                        </div>

                        {/* Quick links */}
                        <div className="md:col-span-3">
                            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-6">Tautan Pintar</h4>
                            <ul className="flex flex-col gap-4 text-sm font-medium">
                                <li>
                                    <button 
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        Beranda Utama
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => scrollToSection('tentang')}
                                        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        Tentang Kami
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => scrollToSection('program')}
                                        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        Program Binaan
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        Halaman Login
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Contact details */}
                        <div className="md:col-span-4">
                            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-6">Hubungi Kantor MPM</h4>
                            
                            <div className="flex flex-col gap-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-[#0080C5] flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-400 leading-normal">
                                        Gedung Pimpinan Pusat Muhammadiyah<br/>
                                        Jl. Cik Ditiro No. 23, Terban, Kec. Gondokusuman, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55223
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail size={18} className="text-[#0080C5] flex-shrink-0" />
                                    <span className="text-slate-400">info@mpm.or.id</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={18} className="text-[#0080C5] flex-shrink-0" />
                                    <span className="text-slate-400">+62 274 566927</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer Bottom copyright */}
                    <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p>SIM Dampingan MPM (Mentora) - Dikembangkan dengan dedikasi untuk pemberdayaan ummat.</p>
                        <p className="font-semibold text-slate-400">Versi 1.0.0</p>
                    </div>

                </div>
            </footer>

        </div>
    );
};

export default LandingPage;
