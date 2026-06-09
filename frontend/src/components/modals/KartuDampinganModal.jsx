import React, { useRef, useEffect, useState } from 'react';
import { X, Printer, Star, Loader2 } from 'lucide-react';
import { anggotaService } from '../../services/anggotaService';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BASE_URL}/storage/${path}`;
};

/** Format: 33 4521 26 05 25 (12 digit) */
export const formatNoAnggota = (no) => {
    if (!no || no === '-') return no;
    const clean = String(no).replace(/\s/g, '');
    if (clean.length === 12) {
        return `${clean.slice(0, 2)} ${clean.slice(2, 6)} ${clean.slice(6, 8)} ${clean.slice(8, 10)} ${clean.slice(10, 12)}`;
    }
    return no;
};

const KartuDampinganModal = ({ isOpen, onClose, anggota, grup }) => {
    const printRef = useRef(null);
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    const anggotaId = anggota?.id_anggota_grup || anggota?.id;

    useEffect(() => {
        if (!isOpen || !anggotaId) {
            setDetail(null);
            return;
        }

        const fetchDetail = async () => {
            setLoading(true);
            try {
                const res = await anggotaService.getById(anggotaId);
                setDetail(res?.data || res);
            } catch {
                setDetail(anggota);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [isOpen, anggotaId, anggota]);

    if (!isOpen || !anggota) return null;

    const data = detail || anggota;
    const grupData = data.grup_dampingan || data.grupDampingan || grup;

    const fotoUrl = getImageUrl(data.foto);
    const qrUrl = getImageUrl(data.qr_code);
    const bidangName = grupData?.bidang?.name || data.bidang?.name || '-';
    const noAnggota = data.no_anggota || '-';
    const namaAnggota = (data.name || data.nama || '-').toUpperCase();
    const formattedNo = formatNoAnggota(noAnggota);

    const handlePrint = () => {
        const printContents = printRef.current?.innerHTML;
        if (!printContents) return;

        const win = window.open('', '_blank', 'width=900,height=700');
        const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
            .map(s => s.outerHTML)
            .join('\n');

        win.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>Kartu Dampingan - ${data.name}</title>
                ${styles}
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    body { background: white; display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 32px; font-family: 'Poppins', 'Inter', sans-serif; }
                    .card-wrapper { display: flex; flex-direction: column; gap: 32px; align-items: center; transform: scale(1.2); transform-origin: top center; }
                    @media print { body { padding: 20px; } @page { margin: 10mm; } }
                </style>
            </head>
            <body>
                <div class="card-wrapper">${printContents}</div>
                <script>setTimeout(() => { window.focus(); window.print(); window.close(); }, 1200);</script>
            </body>
            </html>
        `);
        win.document.close();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center font-['Poppins'] p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-[#F8FAFC] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
                    <div>
                        <h3 className="text-[#0A0F1E] text-sm font-bold">Kartu Dampingan</h3>
                        <p className="text-slate-400 text-xs">{data.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            disabled={loading}
                            className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center gap-2 text-xs font-semibold hover:bg-sky-700 transition-all shadow-sm disabled:opacity-50"
                        >
                            <Printer size={14} />
                            Cetak Kartu
                        </button>
                        <button onClick={onClose} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="animate-spin text-[#0080C5]" size={32} />
                        </div>
                    ) : (
                        <div ref={printRef} className="card-wrapper flex flex-col items-center gap-6">
                            <div className="w-full">
                                <p className="text-[10px] font-bold text-slate-400 tracking-[3px] uppercase mb-2 pl-1">— Tampak Depan</p>
                                <div className="card-front w-[340px] h-[210px] rounded-2xl overflow-hidden mx-auto relative shadow-xl"
                                    style={{ background: 'linear-gradient(135deg, #0080C5 0%, #004f8c 60%, #003566 100%)' }}>
                                    <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/[0.07]" />
                                    <div className="absolute -bottom-12 -left-8 w-40 h-40 rounded-full bg-white/[0.05]" />
                                    <div className="absolute top-4 right-4 z-10 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                                        <Star size={11} className="text-white/60" />
                                    </div>
                                    <div className="relative z-10 flex h-[calc(100%-50px)] p-4 gap-3">
                                        <div className="w-[72px] h-[72px] rounded-xl border-2 border-white/20 overflow-hidden bg-white/10 flex-shrink-0">
                                            {fotoUrl ? (
                                                <img src={fotoUrl} alt={data.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/50 text-3xl">👤</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col text-white">
                                            <span className="text-[8px] font-bold tracking-[2px] uppercase text-white/50 mb-0.5">Kartu Anggota</span>
                                            <span className="text-[18px] font-black leading-none tracking-tight mb-0.5">MPM</span>
                                            <span className="text-[7px] font-semibold tracking-[3px] uppercase text-white/60 mb-3">Muhammadiyah</span>
                                            <span className="text-[8px] font-bold tracking-[2px] text-white/50">NIA</span>
                                            <span className="text-[15px] font-black tracking-wide leading-tight">{formattedNo}</span>
                                            <span className="mt-1.5 inline-flex items-center gap-1 bg-white/15 border border-white/20 text-white text-[8px] font-bold px-2 py-0.5 rounded-full w-fit">
                                                ● {bidangName}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-[50px] flex relative z-10">
                                        <div className="flex-1 bg-[#F97316] flex items-center px-4">
                                            <span className="text-white text-[13px] font-black tracking-wide">{namaAnggota}</span>
                                        </div>
                                        <div className="bg-white/10 flex items-center px-3">
                                            <span className="text-white text-[10px] font-bold whitespace-nowrap">Anggota</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-[50px] flex items-end pb-1.5 px-4 z-20 pointer-events-none">
                                        <div className="flex items-center gap-1.5 opacity-60">
                                            <span className="text-[9px] font-bold text-white">🇮🇩</span>
                                            <span className="text-[8px] text-white font-semibold">Kartu Dampingan</span>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="text-[8px] text-white/50 italic">Bersama Kita Maju</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">
                                <p className="text-[10px] font-bold text-slate-400 tracking-[3px] uppercase mb-2 pl-1">— Tampak Belakang</p>
                                <div className="card-back w-[340px] h-[210px] rounded-2xl overflow-hidden mx-auto relative shadow-xl flex flex-col"
                                    style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                                    <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full bg-white/[0.03]" />
                                    <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-[#0080C5]/10" />
                                    <div className="relative z-10 flex items-center justify-between px-4 pt-3">
                                        <div>
                                            <span className="text-[8px] font-bold tracking-[2px] text-white/40 uppercase">Nomor Kartu Anggota</span>
                                            <div className="text-[17px] font-black text-white tracking-[2px] leading-tight">{formattedNo}</div>
                                        </div>
                                        <span className="bg-[#F97316] text-white text-[8px] font-bold px-2.5 py-1 rounded-full">{bidangName}</span>
                                    </div>
                                    <div className="relative z-10 flex flex-1 px-4 py-2 gap-3">
                                        <div className="flex-1 flex flex-col justify-between">
                                            <p className="text-[7px] text-white/40 leading-relaxed">
                                                Penggunaan kartu ini diatur menurut syarat &amp; ketentuan Program Dampingan MPM Muhammadiyah. Pemegang kartu menyatakan tunduk pada ketentuan yang berlaku.
                                                <br /><br />
                                                Jika kartu ditemukan, mohon dikembalikan ke kantor MPM terdekat.
                                            </p>
                                            <div>
                                                <p className="text-[7px] font-bold text-white/60 mb-1">Hubungi MPM:</p>
                                                <p className="text-[7px] text-white/40">✉ mpm@muhammadiyah.or.id</p>
                                                <p className="text-[7px] text-white/40">🌐 www.mpm.muhammadiyah.or.id</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-[72px] h-[72px] bg-white rounded-lg overflow-hidden p-1">
                                                {qrUrl ? (
                                                    <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-center">
                                                        <span className="text-[6px] text-slate-400 leading-tight">QR Code<br/>belum tersedia</span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[6px] text-white/30">Scan untuk verifikasi</span>
                                        </div>
                                    </div>
                                    <div className="relative z-10 flex items-center justify-between px-4 py-2 border-t border-white/[0.06] bg-white/[0.03]">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-4 h-4 bg-[#0080C5]/60 rounded-full flex items-center justify-center">
                                                <Star size={8} className="text-white" />
                                            </div>
                                            <span className="text-[8px] font-bold text-white/50">MPM Muhammadiyah</span>
                                        </div>
                                        <span className="text-[7px] text-white/30 italic">Bersama Kita Maju</span>
                                    </div>
                                </div>
                            </div>

                            {!qrUrl && (
                                <div className="w-[340px] mx-auto px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                                    <p className="text-[10px] text-amber-700 font-medium text-center">
                                        ⚠️ QR Code belum tersedia. Anggota harus berstatus <strong>Aktif</strong> agar QR Code terbuat otomatis.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KartuDampinganModal;
