import React, { useRef } from 'react';
import { X, Printer, Star } from 'lucide-react';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BASE_URL}/storage/${path}`;
};

const KartuDampinganModal = ({ isOpen, onClose, anggota, grup }) => {
    const printRef = useRef(null);

    if (!isOpen || !anggota) return null;

    const fotoUrl = getImageUrl(anggota.foto);
    const qrUrl   = getImageUrl(anggota.qr_code);
    const bidangName = anggota.bidang?.name || grup?.bidang?.name || '-';
    const grupName   = grup?.name || '-';
    const noAnggota  = anggota.no_anggota || '-';
    const namaAnggota = (anggota.name || '-').toUpperCase();

    // Format: "3404 0603 0002"
    const formatNoAnggota = (no) => {
        if (!no || no === '-') return no;
        return no.replace(/(.{4})(.{4})(.+)/, '$1 $2 $3');
    };

    const handlePrint = () => {
        const printContents = printRef.current?.innerHTML;
        if (!printContents) return;

        const win = window.open('', '_blank', 'width=900,height=700');
        win.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>Kartu Dampingan - ${anggota.name}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        background: white;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        padding: 32px;
                        font-family: 'Arial', sans-serif;
                        gap: 32px;
                    }
                    .card-wrapper {
                        display: flex;
                        flex-direction: column;
                        gap: 24px;
                        align-items: center;
                    }
                    .section-label {
                        font-size: 11px;
                        font-weight: 700;
                        color: #94a3b8;
                        letter-spacing: 3px;
                        text-transform: uppercase;
                        margin-bottom: 8px;
                        padding-left: 2px;
                        text-align: left;
                    }
                    /* CARD FRONT */
                    .card-front {
                        width: 340px;
                        height: 210px;
                        border-radius: 16px;
                        overflow: hidden;
                        background: linear-gradient(135deg, #0080C5 0%, #004f8c 60%, #003566 100%);
                        position: relative;
                        color: white;
                        box-shadow: 0 8px 24px rgba(0,128,197,0.4);
                    }
                    .card-front-deco1 {
                        position: absolute;
                        top: -40px; right: -30px;
                        width: 160px; height: 160px;
                        border-radius: 50%;
                        background: rgba(255,255,255,0.07);
                    }
                    .card-front-deco2 {
                        position: absolute;
                        bottom: -50px; left: -30px;
                        width: 160px; height: 160px;
                        border-radius: 50%;
                        background: rgba(255,255,255,0.05);
                    }
                    .card-front-body {
                        position: relative;
                        z-index: 2;
                        display: flex;
                        height: calc(100% - 50px);
                        padding: 16px;
                        gap: 14px;
                    }
                    .card-avatar {
                        width: 72px; height: 72px;
                        border-radius: 12px;
                        border: 2px solid rgba(255,255,255,0.3);
                        background: rgba(255,255,255,0.15);
                        overflow: hidden;
                        flex-shrink: 0;
                    }
                    .card-avatar img { width: 100%; height: 100%; object-fit: cover; }
                    .card-avatar-placeholder {
                        width: 100%; height: 100%;
                        display: flex; align-items: center; justify-content: center;
                        font-size: 28px; color: rgba(255,255,255,0.6);
                    }
                    .card-info { flex: 1; }
                    .card-label {
                        font-size: 8px; font-weight: 700;
                        letter-spacing: 2px; text-transform: uppercase;
                        color: rgba(255,255,255,0.6);
                        margin-bottom: 2px;
                    }
                    .card-org-name {
                        font-size: 18px; font-weight: 900;
                        letter-spacing: -0.5px; line-height: 1;
                        margin-bottom: 1px;
                    }
                    .card-org-sub {
                        font-size: 7px; font-weight: 600;
                        letter-spacing: 3px; text-transform: uppercase;
                        color: rgba(255,255,255,0.65);
                        margin-bottom: 10px;
                    }
                    .card-nia-label {
                        font-size: 8px; font-weight: 700;
                        letter-spacing: 2px; color: rgba(255,255,255,0.55);
                        margin-bottom: 2px;
                    }
                    .card-nia-number {
                        font-size: 15px; font-weight: 900;
                        letter-spacing: 1px;
                    }
                    .card-bidang-badge {
                        display: inline-flex; align-items: center; gap: 4px;
                        background: rgba(255,255,255,0.15);
                        border: 1px solid rgba(255,255,255,0.2);
                        border-radius: 999px;
                        padding: 2px 8px;
                        font-size: 8px; font-weight: 700;
                        margin-top: 6px;
                        color: white;
                    }
                    .card-star {
                        position: absolute;
                        top: 16px; right: 16px;
                        width: 24px; height: 24px;
                        background: rgba(255,255,255,0.15);
                        border-radius: 50%;
                        display: flex; align-items: center; justify-content: center;
                        font-size: 12px;
                    }
                    .card-front-footer {
                        height: 50px;
                        display: flex;
                        position: relative; z-index: 2;
                    }
                    .card-front-footer-name {
                        background: #F97316;
                        flex: 1;
                        display: flex; align-items: center;
                        padding: 0 16px;
                        font-size: 13px; font-weight: 800;
                        letter-spacing: 0.5px;
                        color: white;
                    }
                    .card-front-footer-role {
                        background: rgba(255,255,255,0.15);
                        padding: 0 14px;
                        display: flex; align-items: center;
                        font-size: 10px; font-weight: 700;
                        color: white;
                        white-space: nowrap;
                    }
                    .card-front-footer-flag {
                        position: absolute;
                        bottom: 0; left: 0;
                        display: flex; align-items: center;
                    }
                    /* CARD BACK */
                    .card-back {
                        width: 340px;
                        height: 210px;
                        border-radius: 16px;
                        overflow: hidden;
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        position: relative;
                        color: white;
                        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
                        display: flex;
                        flex-direction: column;
                    }
                    .card-back-deco1 {
                        position: absolute;
                        top: -40px; left: -40px;
                        width: 140px; height: 140px;
                        border-radius: 50%;
                        background: rgba(255,255,255,0.03);
                    }
                    .card-back-deco2 {
                        position: absolute;
                        bottom: -30px; right: -30px;
                        width: 120px; height: 120px;
                        border-radius: 50%;
                        background: rgba(0,128,197,0.1);
                    }
                    .card-back-header {
                        position: relative; z-index: 2;
                        display: flex;
                        align-items: center; justify-content: space-between;
                        padding: 12px 16px 0;
                    }
                    .card-back-number {
                        font-size: 18px; font-weight: 900;
                        letter-spacing: 2px;
                        line-height: 1;
                    }
                    .card-back-bidang {
                        background: #F97316;
                        color: white;
                        padding: 4px 10px;
                        border-radius: 999px;
                        font-size: 8px; font-weight: 700;
                        letter-spacing: 0.5px;
                    }
                    .card-back-body {
                        position: relative; z-index: 2;
                        display: flex;
                        flex: 1;
                        padding: 8px 16px 10px;
                        gap: 12px;
                    }
                    .card-back-text { flex: 1; }
                    .card-back-terms {
                        font-size: 7px; line-height: 1.5;
                        color: rgba(255,255,255,0.45);
                        margin-bottom: 8px;
                    }
                    .card-back-contact {
                        display: flex; flex-direction: column; gap: 2px;
                    }
                    .card-back-contact-item {
                        display: flex; align-items: center; gap: 4px;
                        font-size: 7px;
                        color: rgba(255,255,255,0.5);
                    }
                    .card-back-contact-label {
                        font-size: 7px; font-weight: 700;
                        color: rgba(255,255,255,0.7);
                        margin-bottom: 3px;
                    }
                    .card-back-qr {
                        width: 72px; height: 72px;
                        background: white;
                        border-radius: 8px;
                        overflow: hidden;
                        padding: 4px;
                        flex-shrink: 0;
                        display: flex; flex-direction: column;
                        align-items: center; justify-content: center;
                    }
                    .card-back-qr img {
                        width: 100%; height: 100%; object-fit: contain;
                    }
                    .card-back-qr-placeholder {
                        font-size: 6px; color: #94a3b8; text-align: center;
                        line-height: 1.3;
                    }
                    .card-back-qr-label {
                        font-size: 6px; color: rgba(255,255,255,0.4);
                        text-align: center; margin-top: 3px;
                    }
                    .card-back-footer {
                        position: relative; z-index: 2;
                        display: flex; align-items: center; justify-content: space-between;
                        padding: 6px 16px;
                        background: rgba(255,255,255,0.04);
                        border-top: 1px solid rgba(255,255,255,0.06);
                    }
                    .card-back-footer-org {
                        font-size: 8px; font-weight: 700;
                        color: rgba(255,255,255,0.6);
                    }
                    .card-back-footer-tagline {
                        font-size: 7px; color: rgba(255,255,255,0.35);
                        font-style: italic;
                    }
                    @media print {
                        body { padding: 16px; }
                    }
                </style>
            </head>
            <body>
                ${printContents}
            </body>
            </html>
        `);
        win.document.close();
        setTimeout(() => {
            win.focus();
            win.print();
            win.close();
        }, 600);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center font-['Poppins'] p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-[#F8FAFC] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
                    <div>
                        <h3 className="text-[#0A0F1E] text-sm font-bold">Kartu Dampingan</h3>
                        <p className="text-slate-400 text-xs">{anggota.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center gap-2 text-xs font-semibold hover:bg-sky-700 transition-all shadow-sm"
                        >
                            <Printer size={14} />
                            Cetak Kartu
                        </button>
                        <button onClick={onClose} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Card Preview Content */}
                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    <div ref={printRef} className="card-wrapper flex flex-col items-center gap-6">

                        {/* === TAMPAK DEPAN === */}
                        <div className="w-full">
                            <p className="text-[10px] font-bold text-slate-400 tracking-[3px] uppercase mb-2 pl-1">— Tampak Depan</p>
                            {/* Card Front */}
                            <div className="card-front w-[340px] h-[210px] rounded-2xl overflow-hidden mx-auto relative shadow-xl"
                                style={{ background: 'linear-gradient(135deg, #0080C5 0%, #004f8c 60%, #003566 100%)' }}>
                                {/* Decorations */}
                                <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/[0.07]" />
                                <div className="absolute -bottom-12 -left-8 w-40 h-40 rounded-full bg-white/[0.05]" />

                                {/* Star icon */}
                                <div className="absolute top-4 right-4 z-10 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                                    <Star size={11} className="text-white/60" />
                                </div>

                                {/* Body */}
                                <div className="relative z-10 flex h-[calc(100%-50px)] p-4 gap-3">
                                    {/* Avatar */}
                                    <div className="w-[72px] h-[72px] rounded-xl border-2 border-white/20 overflow-hidden bg-white/10 flex-shrink-0">
                                        {fotoUrl ? (
                                            <img src={fotoUrl} alt={anggota.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/50 text-3xl">👤</div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-col text-white">
                                        <span className="text-[8px] font-bold tracking-[2px] uppercase text-white/50 mb-0.5">Kartu Anggota</span>
                                        <span className="text-[18px] font-black leading-none tracking-tight mb-0.5">MPM</span>
                                        <span className="text-[7px] font-semibold tracking-[3px] uppercase text-white/60 mb-3">Muhammadiyah</span>
                                        <span className="text-[8px] font-bold tracking-[2px] text-white/50">NIA</span>
                                        <span className="text-[15px] font-black tracking-wide leading-tight">{noAnggota}</span>
                                        <span className="mt-1.5 inline-flex items-center gap-1 bg-white/15 border border-white/20 text-white text-[8px] font-bold px-2 py-0.5 rounded-full w-fit">
                                            ● {bidangName}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="h-[50px] flex relative z-10">
                                    <div className="flex-1 bg-[#F97316] flex items-center px-4">
                                        <span className="text-white text-[13px] font-black tracking-wide">{namaAnggota}</span>
                                    </div>
                                    <div className="bg-white/10 flex items-center px-3">
                                        <span className="text-white text-[10px] font-bold whitespace-nowrap">Anggota</span>
                                    </div>
                                </div>

                                {/* Bottom strip */}
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

                        {/* === TAMPAK BELAKANG === */}
                        <div className="w-full">
                            <p className="text-[10px] font-bold text-slate-400 tracking-[3px] uppercase mb-2 pl-1">— Tampak Belakang</p>
                            {/* Card Back */}
                            <div className="card-back w-[340px] h-[210px] rounded-2xl overflow-hidden mx-auto relative shadow-xl flex flex-col"
                                style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                                {/* Decorations */}
                                <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full bg-white/[0.03]" />
                                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-[#0080C5]/10" />

                                {/* Header */}
                                <div className="relative z-10 flex items-center justify-between px-4 pt-3">
                                    <div>
                                        <span className="text-[8px] font-bold tracking-[2px] text-white/40 uppercase">Nomor Kartu Anggota</span>
                                        <div className="text-[17px] font-black text-white tracking-[2px] leading-tight">{formatNoAnggota(noAnggota)}</div>
                                    </div>
                                    <span className="bg-[#F97316] text-white text-[8px] font-bold px-2.5 py-1 rounded-full">{bidangName}</span>
                                </div>

                                {/* Body */}
                                <div className="relative z-10 flex flex-1 px-4 py-2 gap-3">
                                    {/* Text */}
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

                                    {/* QR Code */}
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

                                {/* Footer */}
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

                        {/* Info QR */}
                        {!qrUrl && (
                            <div className="w-[340px] mx-auto px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                                <p className="text-[10px] text-amber-700 font-medium text-center">
                                    ⚠️ QR Code belum tersedia. Anggota harus berstatus <strong>Aktif</strong> agar QR Code terbuat otomatis.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KartuDampinganModal;
