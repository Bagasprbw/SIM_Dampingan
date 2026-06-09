import React, { useState } from 'react';
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

    const terbitkanMutation = useMutation({
        mutationFn: () => sertifikatService.terbitkanSertifikat(kegiatan?.id_kegiatan),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['kegiatans'] });
            queryClient.invalidateQueries({ queryKey: ['kegiatans-fasilitator'] });
            onClose();
            Swal.fire({
                title: 'Sertifikat Diterbitkan!',
                text: data?.message || 'Sertifikat berhasil diterbitkan untuk peserta yang hadir.',
                icon: 'success',
                confirmButtonColor: '#0080C5',
                customClass: { popup: 'rounded-3xl font-[\'Poppins\']' },
            });
            onSuccess?.();
        },
        onError: (err) => {
            onClose();
            Swal.fire({
                title: 'Gagal Menerbitkan',
                text: err?.response?.data?.message || 'Terjadi kesalahan saat menerbitkan sertifikat.',
                icon: 'error',
                confirmButtonColor: '#EF4444',
                customClass: { popup: 'rounded-3xl font-[\'Poppins\']' },
            });
        },
    });

    if (!isOpen || !kegiatan) return null;

    const statusOk = ['selesai', 'published'].includes(kegiatan.status?.toLowerCase());

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden font-['Poppins']">

                {/* Header */}
                <div className="relative bg-gradient-to-br from-[#0080C5] to-[#005C8F] px-6 pt-6 pb-10 text-white">
                    <div className="absolute -bottom-5 left-6 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                        <Award size={22} className="text-[#0080C5]" />
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
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
                            className="flex-1 h-11 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => terbitkanMutation.mutate()}
                            disabled={!statusOk || terbitkanMutation.isPending}
                            className="flex-1 h-11 bg-[#0080C5] text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {terbitkanMutation.isPending ? (
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
