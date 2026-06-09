import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../../components/layout/AdminLayout';
import { sertifikatService } from '../../services/sertifikatService';
import {
    Upload, Trash2, FileText, Eye, Clock, User,
    CheckCircle2, AlertTriangle, Loader2, Download, X
} from 'lucide-react';
import Swal from 'sweetalert2';
import { resolveStorageUrl } from '../../utils/resolveStorageUrl';

/* ─────────────────────────────────────────────────────────
   Modal Preview PDF
───────────────────────────────────────────────────────── */
const PdfPreviewModal = ({ url, onClose }) => {
    const resolvedUrl = resolveStorageUrl(url);
    if (!resolvedUrl) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <FileText size={16} className="text-[#0080C5]" />
                        <span className="text-sm font-bold text-slate-800">Preview Template Sertifikat</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={resolvedUrl}
                            download
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-all"
                        >
                            <Download size={13} /> Download
                        </a>
                        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                            <X size={18} />
                        </button>
                    </div>
                </div>
                <div className="flex-1 bg-slate-100">
                    <iframe
                        src={resolvedUrl}
                        className="w-full h-full"
                        title="Template Sertifikat"
                    />
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────── */
const ManageTemplateSertifikatPage = () => {
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);

    const [previewUrl, setPreviewUrl] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    /* ── Queries ── */
    const { data: activeRes, isLoading: loadingActive } = useQuery({
        queryKey: ['sertifikat-template'],
        queryFn: sertifikatService.getTemplate,
        retry: false,
    });

    const { data: riwayatRes, isLoading: loadingRiwayat } = useQuery({
        queryKey: ['sertifikat-template-riwayat'],
        queryFn: sertifikatService.getRiwayatTemplate,
    });

    /* ── Mutations ── */
    const uploadMutation = useMutation({
        mutationFn: sertifikatService.uploadTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sertifikat-template'] });
            queryClient.invalidateQueries({ queryKey: ['sertifikat-template-riwayat'] });
            setSelectedFile(null);
            Swal.fire({
                title: 'Berhasil!',
                text: 'Template sertifikat berhasil diupload.',
                icon: 'success',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-3xl font-[\'Poppins\']' },
            });
        },
        onError: (err) => {
            Swal.fire({
                title: 'Gagal Upload',
                text: err?.response?.data?.message || 'Terjadi kesalahan saat upload template.',
                icon: 'error',
                confirmButtonColor: '#EF4444',
                customClass: { popup: 'rounded-3xl font-[\'Poppins\']' },
            });
        },
    });

    /* ── Handlers ── */
    const handleFileSelect = (file) => {
        if (!file) return;
        if (file.type !== 'application/pdf') {
            Swal.fire({ title: 'File Tidak Valid', text: 'Hanya file PDF yang diizinkan.', icon: 'warning', confirmButtonColor: '#0080C5' });
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            Swal.fire({ title: 'File Terlalu Besar', text: 'Ukuran maksimal file adalah 10MB.', icon: 'warning', confirmButtonColor: '#0080C5' });
            return;
        }
        setSelectedFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleUpload = () => {
        if (!selectedFile) return;
        uploadMutation.mutate(selectedFile);
    };

    const activeTemplate = activeRes?.data;
    const riwayatList = riwayatRes?.data || [];

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <AdminLayout title="Template Sertifikat">
            <div className="font-['Poppins'] min-h-screen bg-[#F0F2F8] flex flex-col gap-6">

                {/* ── Header ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-7 py-5">
                    <h2 className="text-base font-bold text-[#0A0F1E] tracking-tight">Kelola Template Sertifikat</h2>
                    <p className="text-xs text-slate-400 mt-1">Upload dan kelola template PDF fillable untuk penerbitan sertifikat secara global.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* ── Panel Kiri: Upload Baru ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-800">Upload Template Baru</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Template baru akan menggantikan template aktif untuk penerbitan selanjutnya.</p>
                        </div>

                        <div className="p-6 flex flex-col gap-5 flex-1">
                            {/* Drop Zone */}
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all
                                    ${dragOver ? 'border-[#0080C5] bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-[#0080C5] hover:bg-blue-50/30'}`}
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${dragOver ? 'bg-[#0080C5] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    <Upload size={28} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-slate-600">
                                        {selectedFile ? selectedFile.name : 'Drag & drop file PDF di sini'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">atau klik untuk pilih file • Maks. 10MB • Format PDF</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => handleFileSelect(e.target.files[0])}
                                />
                            </div>

                            {selectedFile && (
                                <div className="flex items-center gap-3 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
                                    <div className="w-9 h-9 bg-[#0080C5] text-white rounded-lg flex items-center justify-center shrink-0">
                                        <FileText size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 truncate">{selectedFile.name}</p>
                                        <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile || uploadMutation.isPending}
                                className="h-11 flex items-center justify-center gap-2 rounded-xl bg-[#0080C5] text-white text-sm font-semibold hover:bg-sky-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploadMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                {uploadMutation.isPending ? 'Mengupload...' : 'Upload Template'}
                            </button>
                        </div>
                    </div>

                    {/* ── Panel Kanan: Template Aktif ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Template Aktif</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Template yang digunakan untuk penerbitan sertifikat saat ini.</p>
                            </div>
                            {activeTemplate && (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Aktif
                                </span>
                            )}
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            {loadingActive ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-[#0080C5]" size={32} />
                                </div>
                            ) : !activeTemplate ? (
                                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-10">
                                    <div className="w-16 h-16 bg-amber-50 text-amber-400 rounded-2xl flex items-center justify-center">
                                        <AlertTriangle size={28} />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-600">Belum ada template aktif</p>
                                    <p className="text-xs text-slate-400">Upload file PDF template untuk mulai menerbitkan sertifikat.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    {/* PDF Thumbnail placeholder */}
                                    <div className="relative bg-slate-100 rounded-xl h-48 flex items-center justify-center overflow-hidden border border-slate-200 group">
                                        <div className="flex flex-col items-center gap-2 text-slate-300">
                                            <FileText size={48} />
                                            <span className="text-xs font-medium">Template PDF</span>
                                        </div>
                                        <button
                                            onClick={() => setPreviewUrl(activeTemplate.template_url)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-xl"
                                        >
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white text-slate-800 rounded-xl text-xs font-bold shadow-lg">
                                                <Eye size={14} /> Preview PDF
                                            </div>
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <User size={13} className="text-slate-400" />
                                            <span>Diupload oleh <span className="font-semibold text-slate-700">{activeTemplate.created_by || '-'}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Clock size={13} className="text-slate-400" />
                                            <span>{formatDate(activeTemplate.created_at)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setPreviewUrl(activeTemplate.template_url)}
                                        className="h-10 flex items-center justify-center gap-2 rounded-xl border border-[#0080C5] text-[#0080C5] text-xs font-semibold hover:bg-blue-50 transition-all"
                                    >
                                        <Eye size={14} /> Preview Template
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Riwayat Template ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Riwayat Template</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Semua versi template yang pernah diupload. Template terbaru adalah yang aktif.</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-50 text-[#0080C5] rounded-full text-xs font-bold border border-blue-100">
                            {riwayatList.length} Versi
                        </span>
                    </div>

                    {loadingRiwayat ? (
                        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#0080C5]" size={32} /></div>
                    ) : riwayatList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-14 text-slate-400">
                            <FileText size={36} className="mb-3 text-slate-200" />
                            <p className="text-sm font-medium">Belum ada riwayat template.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {riwayatList.map((t, i) => (
                                <div key={t.id_template} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs
                                        ${i === 0 ? 'bg-[#0080C5] text-white' : 'bg-slate-100 text-slate-400'}`}
                                    >
                                        {i === 0 ? <CheckCircle2 size={16} /> : `v${riwayatList.length - i}`}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 truncate flex items-center gap-2">
                                            Template #{riwayatList.length - i}
                                            {i === 0 && (
                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold border border-emerald-100">
                                                    AKTIF
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            {t.uploaded_by} · {formatDate(t.created_at)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setPreviewUrl(t.template_url)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-[#0080C5] hover:text-white transition-all"
                                    >
                                        <Eye size={12} /> Preview
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Preview */}
            {previewUrl && <PdfPreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />}
        </AdminLayout>
    );
};

export default ManageTemplateSertifikatPage;
