import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sertifikatService } from '../../services/sertifikatService';
import {
    X, Award, FileText, Printer, AlertTriangle,
    Loader2, CheckCircle2, Calendar, MapPin, User
} from 'lucide-react';
import { resolveStorageUrl } from '../../utils/resolveStorageUrl';

/**
 * Modal preview sertifikat & cetak.
 * - Jika template_url null → tampilkan pesan "PDF tidak sesuai format".
 * - Jika template_url valid → render info + tombol Cetak (window.print / buka tab baru).
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - anggotaId: string
 *  - sertifikatId: string
 */
const SertifikatPreviewModal = ({ isOpen, onClose, anggotaId, sertifikatId }) => {
    const [pdfError, setPdfError] = useState(false);

    const { data: res, isLoading, isError } = useQuery({
        queryKey: ['sertifikat', anggotaId, sertifikatId],
        queryFn: () => sertifikatService.getSertifikatAnggota(anggotaId, sertifikatId),
        enabled: isOpen && !!anggotaId && !!sertifikatId,
        retry: false,
    });

    if (!isOpen) return null;

    const sertifikat = res?.data;
    const templateUrl = resolveStorageUrl(sertifikat?.template_url);
    const hasTemplate = !!templateUrl;

    const handleCetak = () => {
        if (!templateUrl) return;
        window.open(templateUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden font-['Poppins'] max-h-[90vh] flex flex-col">

                {/* ── Header ── */}
                <div className="relative bg-gradient-to-br from-[#0080C5] to-[#004A7C] px-6 pt-6 pb-10 text-white shrink-0">
                    <div className="absolute -bottom-5 left-6 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                        <Award size={22} className="text-[#0080C5]" />
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                    >
                        <X size={16} />
                    </button>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-white/60 mb-1">Sertifikat Kegiatan</p>
                    <h2 className="text-lg font-bold">Preview Sertifikat</h2>
                </div>

                {/* ── Body ── */}
                <div className="px-6 pt-10 pb-6 flex flex-col gap-5 overflow-y-auto">

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Loader2 className="animate-spin text-[#0080C5]" size={36} />
                            <p className="text-sm text-slate-400 font-medium">Memuat data sertifikat...</p>
                        </div>
                    )}

                    {/* Error ambil data sertifikat */}
                    {isError && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center">
                                <AlertTriangle size={28} />
                            </div>
                            <p className="text-sm font-bold text-slate-700">Sertifikat tidak ditemukan</p>
                            <p className="text-xs text-slate-400">Data sertifikat tidak dapat dimuat atau tidak tersedia.</p>
                        </div>
                    )}

                    {/* Berhasil ambil data */}
                    {sertifikat && !isLoading && (
                        <>
                            {/* Info Sertifikat */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Informasi Sertifikat</p>

                                <div className="flex items-center gap-2 justify-between">
                                    <span className="text-[11px] text-slate-400">Nomor Sertifikat</span>
                                    <span className="text-[11px] font-bold text-[#0080C5] font-mono">{sertifikat.nomor_sertifikat}</span>
                                </div>

                                <div className="border-t border-slate-100 pt-3 space-y-2.5">
                                    <div className="flex items-center gap-2">
                                        <User size={13} className="text-slate-400 shrink-0" />
                                        <span className="text-xs text-slate-600">
                                            <span className="text-slate-400">Nama: </span>
                                            <span className="font-semibold">{sertifikat.nama_peserta}</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText size={13} className="text-slate-400 shrink-0" />
                                        <span className="text-xs text-slate-600">
                                            <span className="text-slate-400">Kegiatan: </span>
                                            <span className="font-semibold">{sertifikat.nama_kegiatan}</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={13} className="text-slate-400 shrink-0" />
                                        <span className="text-xs text-slate-600">
                                            <span className="text-slate-400">Tanggal: </span>
                                            <span className="font-semibold">{sertifikat.tanggal_kegiatan}</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={13} className="text-slate-400 shrink-0" />
                                        <span className="text-xs text-slate-600">
                                            <span className="text-slate-400">Lokasi: </span>
                                            <span className="font-semibold">{sertifikat.lokasi_kegiatan || '-'}</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={13} className="text-slate-400 shrink-0" />
                                        <span className="text-xs text-slate-600">
                                            <span className="text-slate-400">Fasilitator: </span>
                                            <span className="font-semibold">{sertifikat.nama_fasilitator || '-'}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Template */}
                            {!hasTemplate ? (
                                /* ── Template tidak tersedia / tidak sesuai format ── */
                                <div className="flex items-start gap-4 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                                    <div className="w-10 h-10 bg-amber-100 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-amber-700 mb-1">
                                            Template PDF Tidak Tersedia
                                        </p>
                                        <p className="text-xs text-amber-600 leading-relaxed">
                                            Sertifikat Anda sudah tercatat, namun template PDF sertifikat belum tersedia atau belum sesuai format <strong>PDF Fillable</strong>. Hubungi administrator untuk mengupload template yang sesuai.
                                        </p>
                                    </div>
                                </div>
                            ) : pdfError ? (
                                /* ── PDF gagal load ── */
                                <div className="flex items-start gap-4 p-5 bg-red-50 border border-red-100 rounded-2xl">
                                    <div className="w-10 h-10 bg-red-100 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-red-700 mb-1">PDF Tidak Sesuai Format</p>
                                        <p className="text-xs text-red-600 leading-relaxed">
                                            File PDF tidak dapat dimuat. Pastikan template yang digunakan adalah <strong>PDF Fillable</strong> yang valid.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* ── Preview PDF (iframe) ── */
                                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-slate-100">
                                        <FileText size={13} className="text-[#0080C5]" />
                                        <span className="text-xs font-semibold text-slate-600">Preview Template PDF</span>
                                        <span className="ml-auto text-[10px] text-amber-600 font-medium flex items-center gap-1">
                                            <AlertTriangle size={11} /> Pengisian data otomatis memerlukan PDF Fillable
                                        </span>
                                    </div>
                                    <iframe
                                        src={templateUrl}
                                        className="w-full h-64"
                                        title="Preview Sertifikat"
                                        onError={() => setPdfError(true)}
                                    />
                                </div>
                            )}

                            {/* Tanda terbit */}
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                <span className="text-xs text-emerald-700 font-medium">
                                    Sertifikat diterbitkan pada{' '}
                                    {sertifikat.diterbitkan_at
                                        ? new Date(sertifikat.diterbitkan_at).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric',
                                        })
                                        : '-'}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* ── Footer ── */}
                {sertifikat && (
                    <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0">
                        <button
                            onClick={onClose}
                            className="flex-1 h-11 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all"
                        >
                            Tutup
                        </button>
                        <button
                            onClick={handleCetak}
                            disabled={!hasTemplate}
                            className="flex-1 h-11 bg-[#0080C5] text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Printer size={15} /> Cetak / Unduh
                        </button>
                    </div>
                )}

                {/* Tombol tutup saja jika error */}
                {(isError || (!isLoading && !sertifikat)) && (
                    <div className="px-6 py-4 border-t border-slate-100 shrink-0">
                        <button
                            onClick={onClose}
                            className="w-full h-11 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all"
                        >
                            Tutup
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SertifikatPreviewModal;
