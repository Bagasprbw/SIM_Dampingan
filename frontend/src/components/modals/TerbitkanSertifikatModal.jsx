import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sertifikatService } from '../../services/sertifikatService';
import { X, Award, AlertTriangle, Loader2, CheckCircle2, Users } from 'lucide-react';
import Swal from 'sweetalert2';

/**
 * Modal Terbitkan Sertifikat
 * Hanya muncul untuk kegiatan berstatus 'selesai' atau 'published'.
 * Backend tidak memerlukan upload file lagi — template diambil dari tabel global.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - kegiatan: object (data kegiatan yang dipilih)
 *  - onSuccess: () => void  (optional callback setelah berhasil)
 */
const TerbitkanSertifikatModal = ({ isOpen, onClose, kegiatan, onSuccess }) => {
    const queryClient = useQueryClient();

    const [progress, setProgress] = useState(0);
    const [showLoading, setShowLoading] = useState(false);
    const minTimeElapsedRef = useRef(false);
    const mutationResultRef = useRef(null);
    const finishCalledRef = useRef(false);



    const finishFlow = () => {
        if (finishCalledRef.current) return;
        finishCalledRef.current = true;

        const result = mutationResultRef.current;
        setShowLoading(false);
        onClose();

        if (result?.type === 'success') {
            queryClient.invalidateQueries({ queryKey: ['kegiatans'] });
            queryClient.invalidateQueries({ queryKey: ['kegiatans-fasilitator'] });
            Swal.fire({
                title: 'Sertifikat Diterbitkan!',
                text: result.data?.message || 'Sertifikat berhasil diterbitkan untuk peserta yang hadir.',
                icon: 'success',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-3xl font-[\'Poppins\']' },
            });
            onSuccess?.();
        } else if (result?.type === 'error') {
            Swal.fire({
                title: 'Gagal Menerbitkan',
                text: result.data?.response?.data?.message || 'Terjadi kesalahan saat menerbitkan sertifikat.',
                icon: 'error',
                confirmButtonColor: '#EF4444',
                customClass: { popup: 'rounded-3xl font-[\'Poppins\']' },
            });
        }
    };

    const abortFlow = (message) => {
        if (finishCalledRef.current) return;
        finishCalledRef.current = true;
        minTimeElapsedRef.current = true; // cegah timer 4 detik melanjutkan
        setShowLoading(false);
        onClose();
        Swal.fire({
            title: 'Gagal Menerbitkan',
            text: message,
            icon: 'error',
            confirmButtonColor: '#EF4444',
            customClass: { popup: 'rounded-3xl font-[\'Poppins\']' },
        });
    };

    const terbitkanMutation = useMutation({
        mutationFn: () => sertifikatService.terbitkanSertifikat(kegiatan?.id_kegiatan),
        onSuccess: (data) => {
            mutationResultRef.current = { type: 'success', data };
            if (minTimeElapsedRef.current) finishFlow();
        },
        onError: (err) => {
            const serverMessage = err?.response?.data?.message || '';
            // Jika sudah pernah diterbitkan — abort langsung tanpa animasi 4 detik
            if (serverMessage.toLowerCase().includes('sudah pernah diterbitkan')) {
                abortFlow('Sertifikat untuk kegiatan ini sudah pernah diterbitkan.');
                return;
            }
            mutationResultRef.current = { type: 'error', data: err };
            if (minTimeElapsedRef.current) finishFlow();
        },
    });

    const handleTerbit = () => {
        // Validasi lokal sebelum request
        if (!statusOk) return;

        // Reset state
        minTimeElapsedRef.current = false;
        mutationResultRef.current = null;
        finishCalledRef.current = false;
        setProgress(0);
        setShowLoading(true);

        // Jalankan mutation
        terbitkanMutation.mutate();

        // Timer minimal 4 detik
        setTimeout(() => {
            minTimeElapsedRef.current = true;
            if (mutationResultRef.current) finishFlow();
        }, 4000);
    };

    // Progress bar animasi ketika loading aktif
    useEffect(() => {
        if (!showLoading) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return 95;
                }
                return Math.min(prev + (Math.random() * 2 + 1.5), 95);
            });
        }, 100);

        return () => clearInterval(interval);
    }, [showLoading]);

    const displayProgress = progress;

    let stepText = 'Menghubungkan ke server...';
    if (displayProgress >= 25 && displayProgress < 50) {
        stepText = 'Menganalisis daftar kehadiran peserta...';
    } else if (displayProgress >= 50 && displayProgress < 75) {
        stepText = 'Mempersiapkan dokumen dan nomor unik...';
    } else if (displayProgress >= 75 && displayProgress < 90) {
        stepText = 'Menyusun lembar sertifikat digital...';
    } else if (displayProgress >= 90) {
        stepText = 'Menyelesaikan penerbitan sertifikat...';
    }

    if (!isOpen || !kegiatan) return null;

    const statusOk = ['selesai', 'published'].includes(kegiatan.status?.toLowerCase());

    const handleOpenTerbit = () => {
        // Cek apakah sudah pernah diterbitkan berdasarkan data kegiatan
        // (field ini bisa kamu tambahkan dari backend jika diperlukan)
        // Untuk sekarang, validasi ini ditangani oleh response error 422 dari backend
        handleTerbit();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden font-['Poppins']">

                {/* Loading Animation Overlay */}
                {showLoading && (
                    <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8">
                        {/* Decorative Glowing Rings */}
                        <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                            <div className="absolute inset-0 rounded-full bg-sky-100/50 animate-ping" style={{ animationDuration: '1.5s' }} />
                            <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-[#0080C5]/40 animate-spin" style={{ animationDuration: '6s' }} />
                            <div className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-[#0080C5] to-sky-400 flex items-center justify-center shadow-lg shadow-sky-200">
                                <Award size={36} className="text-white animate-pulse" />
                            </div>
                            <div className="absolute top-2 right-2 text-amber-400 animate-bounce" style={{ animationDelay: '100ms' }}>✨</div>
                            <div className="absolute bottom-4 left-2 text-amber-400 animate-bounce" style={{ animationDelay: '300ms' }}>✨</div>
                        </div>

                        <h3 className="text-slate-800 text-base font-bold mb-1">Menerbitkan Sertifikat</h3>
                        <p className="text-slate-400 text-[11px] mb-6 max-w-[280px] text-center truncate">{kegiatan.judul}</p>

                        {/* Progress Bar */}
                        <div className="w-full max-w-[240px] bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                            <div
                                className="bg-gradient-to-r from-[#0080C5] to-sky-400 h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${displayProgress}%` }}
                            />
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[11px] font-bold text-[#0080C5] tracking-wide animate-pulse">{stepText}</span>
                            <span className="text-[10px] font-medium text-slate-400">{Math.round(displayProgress)}%</span>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="relative bg-gradient-to-br from-[#0080C5] to-[#005C8F] px-6 pt-6 pb-10 text-white">
                    <div className="absolute -bottom-5 left-6 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                        <Award size={22} className="text-[#0080C5]" />
                    </div>
                    <button onClick={onClose} disabled={showLoading} className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all disabled:opacity-40">
                        <X size={16} />
                    </button>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-white/60 mb-1">Penerbitan Sertifikat</p>
                    <h2 className="text-lg font-bold leading-snug">Terbitkan Sertifikat</h2>
                </div>

                {/* Body */}
                <div className="px-6 pt-10 pb-6 flex flex-col gap-5">

                    {/* Info Kegiatan */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Kegiatan</p>
                        <p className="text-sm font-bold text-slate-800 leading-snug mb-1">{kegiatan.judul}</p>
                        <p className="text-xs text-slate-500">
                            {kegiatan.tanggal
                                ? new Date(kegiatan.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                : '-'}
                        </p>
                    </div>

                    {/* Peringatan jika status tidak sesuai */}
                    {!statusOk && (
                        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-amber-700">Status Tidak Memenuhi Syarat</p>
                                <p className="text-[11px] text-amber-600 mt-0.5">
                                    Sertifikat hanya bisa diterbitkan untuk kegiatan berstatus <strong>Selesai</strong> atau <strong>Published</strong>.
                                    Status saat ini: <strong className="capitalize">{kegiatan.status}</strong>.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Info cara kerja */}
                    {statusOk && (
                        <div className="space-y-2.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Informasi</p>
                            {[
                                { icon: <CheckCircle2 size={13} />, text: 'Template diambil otomatis dari template global yang dikelola superadmin.' },
                                { icon: <Users size={13} />, text: 'Sertifikat akan diterbitkan untuk semua anggota yang hadir pada kegiatan ini.' },
                                { icon: <Award size={13} />, text: 'Nomor sertifikat unik akan digenerate otomatis untuk setiap peserta.' },
                            ].map((info, i) => (
                                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                                    <span className="text-[#0080C5] mt-0.5 shrink-0">{info.icon}</span>
                                    {info.text}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            disabled={showLoading}
                            className="flex-1 h-11 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all disabled:opacity-40"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleOpenTerbit}
                            disabled={!statusOk || showLoading}
                            className="flex-1 h-11 bg-[#0080C5] text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {showLoading ? (
                                <><Loader2 size={15} className="animate-spin" /> Memproses...</>
                            ) : (
                                <><Award size={15} /> Terbitkan Sekarang</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerbitkanSertifikatModal;
