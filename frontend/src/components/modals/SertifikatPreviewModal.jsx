import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sertifikatService } from '../../services/sertifikatService';
import {
    X, Award, FileText, Printer, AlertTriangle,
    Loader2, CheckCircle2, Calendar, MapPin, User
} from 'lucide-react';
import { resolveStorageUrl } from '../../utils/resolveStorageUrl';
import { fillSertifikatPdf, downloadPdfBytes, createPdfBlobUrl } from '../../utils/fillSertifikatPdf';

/**
 * Modal preview sertifikat & cetak.
 * Mengisi template PDF fillable via pdf-lib, flatten, lalu preview/unduh.
 */
const SertifikatPreviewModal = ({ isOpen, onClose, anggotaId, sertifikatId }) => {
    const [pdfError, setPdfError] = useState(null);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
    const [pdfBytes, setPdfBytes] = useState(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const blobUrlRef = useRef(null);

    const { data: res, isLoading, isError } = useQuery({
        queryKey: ['sertifikat', anggotaId, sertifikatId],
        queryFn: () => sertifikatService.getSertifikatAnggota(anggotaId, sertifikatId),
        enabled: isOpen && !!anggotaId && !!sertifikatId,
        retry: false,
    });

    const sertifikat = res?.data;
    const templateUrl = resolveStorageUrl(sertifikat?.template_url);
    const hasTemplate = !!templateUrl;
    const fieldValues = sertifikat?.fields ?? null;

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setPdfError(null);
        setPdfBytes(null);

        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }
        setPdfBlobUrl(null);
    }, [isOpen, sertifikatId]);

    useEffect(() => {
        if (!hasTemplate || !fieldValues || !isOpen) {
            return;
        }

        let cancelled = false;

        const generate = async () => {
            setIsGeneratingPdf(true);
            setPdfError(null);

            try {
                const { bytes, filledCount } = await fillSertifikatPdf(templateUrl, fieldValues);

                if (cancelled) return;

                if (filledCount === 0) {
                    setPdfError('Tidak ada field yang cocok. Pastikan nama field di PDF sama dengan daftar field yang didukung.');
                    return;
                }

                if (blobUrlRef.current) {
                    URL.revokeObjectURL(blobUrlRef.current);
                }

                const url = createPdfBlobUrl(bytes);
                blobUrlRef.current = url;
                setPdfBlobUrl(url);
                setPdfBytes(bytes);
            } catch (err) {
                if (!cancelled) {
                    setPdfError(err?.message || 'Gagal membuat sertifikat PDF');
                }
            } finally {
                if (!cancelled) {
                    setIsGeneratingPdf(false);
                }
            }
        };

        generate();

        return () => {
            cancelled = true;
        };
    }, [hasTemplate, fieldValues, templateUrl, isOpen]);

    useEffect(() => {
        return () => {
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
            }
        };
    }, []);

    if (!isOpen) return null;

    const handleCetak = () => {
        if (!pdfBytes || !sertifikat) return;

        const safeName = (sertifikat.nomor_sertifikat || 'sertifikat').replace(/\//g, '-');
        downloadPdfBytes(pdfBytes, `Sertifikat_${safeName}.pdf`);
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

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Loader2 className="animate-spin text-[#0080C5]" size={36} />
                            <p className="text-sm text-slate-400 font-medium">Memuat data sertifikat...</p>
                        </div>
                    )}

                    {isError && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center">
                                <AlertTriangle size={28} />
                            </div>
                            <p className="text-sm font-bold text-slate-700">Sertifikat tidak ditemukan</p>
                            <p className="text-xs text-slate-400">Data sertifikat tidak dapat dimuat atau tidak tersedia.</p>
                        </div>
                    )}

                    {sertifikat && !isLoading && (
                        <>
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

                            {!hasTemplate ? (
                                <div className="flex items-start gap-4 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                                    <div className="w-10 h-10 bg-amber-100 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-amber-700 mb-1">Template PDF Tidak Tersedia</p>
                                        <p className="text-xs text-amber-600 leading-relaxed">
                                            Sertifikat sudah tercatat, namun template PDF belum diupload. Hubungi administrator.
                                        </p>
                                    </div>
                                </div>
                            ) : pdfError ? (
                                <div className="flex items-start gap-4 p-5 bg-red-50 border border-red-100 rounded-2xl">
                                    <div className="w-10 h-10 bg-red-100 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-red-700 mb-1">Gagal Membuat PDF</p>
                                        <p className="text-xs text-red-600 leading-relaxed">{pdfError}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-slate-100">
                                        <FileText size={13} className="text-[#0080C5]" />
                                        <span className="text-xs font-semibold text-slate-600">Preview Sertifikat Terisi</span>
                                        {isGeneratingPdf && (
                                            <Loader2 size={13} className="ml-auto animate-spin text-[#0080C5]" />
                                        )}
                                        {!isGeneratingPdf && pdfBlobUrl && (
                                            <span className="ml-auto text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                                                <CheckCircle2 size={11} /> Siap unduh
                                            </span>
                                        )}
                                    </div>
                                    {isGeneratingPdf ? (
                                        <div className="flex flex-col items-center justify-center h-64 gap-2">
                                            <Loader2 className="animate-spin text-[#0080C5]" size={28} />
                                            <p className="text-xs text-slate-400">Mengisi template PDF...</p>
                                        </div>
                                    ) : pdfBlobUrl ? (
                                        <iframe
                                            src={pdfBlobUrl}
                                            className="w-full h-64"
                                            title="Preview Sertifikat Terisi"
                                        />
                                    ) : null}
                                </div>
                            )}

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
                            disabled={!pdfBytes || isGeneratingPdf}
                            className="flex-1 h-11 bg-[#0080C5] text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Printer size={15} /> Unduh PDF
                        </button>
                    </div>
                )}

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
