import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { getUser } from '../../utils/storage';
import { downloadImportTemplate, parseExcelFile } from '../../utils/excelImport';
import importService from '../../services/importService';
import { grupDampinganService } from '../../services/grupDampinganService';
import Swal from 'sweetalert2';
import {
    FileSpreadsheet,
    Download,
    UploadCloud,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    Users,
    UsersRound,
    UserCheck,
    UserCog,
    ArrowRight,
    RefreshCw,
    ShieldAlert
} from 'lucide-react';

const IMPORT_TYPES = [
    { id: 'dampingan', label: 'Data Dampingan', desc: 'Import anggota per sheet grup dampingan', icon: Users },
    { id: 'grup', label: 'Grup & PJ Grup', desc: 'Import kelompok dampingan & akun PJ', icon: UsersRound },
    { id: 'fasilitator', label: 'Data Fasilitator', desc: 'Import akun fasilitator dampingan', icon: UserCheck },
    { id: 'admin', label: 'Data Admin', desc: 'Import admin provinsi/kabupaten/kecamatan', icon: UserCog },
];

const ImportDataPage = () => {
    const navigate = useNavigate();
    const currentUser = getUser();
    const userRole = typeof currentUser?.role === 'object' ? currentUser.role?.name : currentUser?.role;
    const isSuperAdmin = userRole === 'superadmin' || currentUser?.username === 'superadmin';

    const [activeTab, setActiveTab] = useState('dampingan');
    const [grupsList, setGrupsList] = useState([]);
    const [isLoadingGrups, setIsLoadingGrups] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [isParsing, setIsParsing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [previewResult, setPreviewResult] = useState(null);
    const [previewTab, setPreviewTab] = useState('valid');

    // Superadmin Protection Guard
    useEffect(() => {
        if (!isSuperAdmin) {
            Swal.fire({
                icon: 'error',
                title: 'Akses Ditolak',
                text: 'Hanya Superadmin yang berhak mengakses fitur import data Excel.',
            }).then(() => navigate('/dashboard'));
        }
    }, [isSuperAdmin, navigate]);

    // Load Grups for dynamic sheet template generation
    useEffect(() => {
        const fetchGrups = async () => {
            setIsLoadingGrups(true);
            try {
                const res = await grupDampinganService.getAll({ per_page: 500 });
                setGrupsList(res?.data || []);
            } catch (err) {
                console.error('Failed to load grups for template:', err);
            } finally {
                setIsLoadingGrups(false);
            }
        };
        fetchGrups();
    }, []);

    const handleTabChange = (typeId) => {
        setActiveTab(typeId);
        setSelectedFile(null);
        setPreviewResult(null);
    };

    const handleDownloadTemplate = () => {
        downloadImportTemplate(activeTab, grupsList);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setIsParsing(true);
        setPreviewResult(null);

        try {
            const parsedRows = await parseExcelFile(file);

            if (!parsedRows || parsedRows.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'File Kosong',
                    text: 'Tidak ada data yang ditemukan di dalam file Excel ini.',
                });
                setIsParsing(false);
                return;
            }

            // Auto-detect import type from sheet name or headers
            let targetType = activeTab;
            const firstRow = parsedRows[0];
            const sheetName = firstRow._sheet || '';

            if (sheetName === 'Data Fasilitator' || ('Bidang Dampingan' in firstRow && 'Username' in firstRow && !('Role' in firstRow) && !('Nama PJ' in firstRow))) {
                targetType = 'fasilitator';
            } else if (sheetName === 'Data Admin' || 'Role' in firstRow) {
                targetType = 'admin';
            } else if (sheetName === 'Data Grup & PJ' || 'Nama PJ' in firstRow || 'Username PJ' in firstRow) {
                targetType = 'grup';
            }

            if (targetType !== activeTab) {
                setActiveTab(targetType);
            }

            // Request preview & validation to backend
            const res = await importService.preview(targetType, parsedRows);
            setPreviewResult(res);
            if (res.valid?.length === 0 && res.invalid?.length > 0) {
                setPreviewTab('invalid');
            } else {
                setPreviewTab('valid');
            }
        } catch (err) {
            console.error('Failed to parse excel:', err);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Membaca File',
                text: 'Format file tidak sesuai atau file rusak. Pastikan Anda menggunakan template Excel yang disediakan.',
            });
        } finally {
            setIsParsing(false);
        }
    };

    const handleCommitImport = async () => {
        if (!previewResult || !previewResult.valid || previewResult.valid.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Tidak Ada Data Valid',
                text: 'Tidak ada baris data valid yang bisa diimport ke sistem.',
            });
            return;
        }

        const confirm = await Swal.fire({
            title: 'Konfirmasi Import Data',
            html: `Apakah Anda yakin ingin memasukkan <b class="text-[#0080C5]">${previewResult.valid.length} data valid</b> ke database?<br/><span class="text-xs text-slate-500 font-normal">Data invalid akan diabaikan.</span>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0080C5',
            cancelButtonColor: '#94A3B8',
            confirmButtonText: 'Ya, Import Sekarang',
            cancelButtonText: 'Batal'
        });

        if (!confirm.isConfirmed) return;

        setIsSubmitting(true);
        try {
            const res = await importService.commit(activeTab, previewResult.valid);
            Swal.fire({
                icon: 'success',
                title: 'Import Berhasil!',
                text: res.message || `Berhasil mengimport data ke database.`,
            });
            // Reset
            setSelectedFile(null);
            setPreviewResult(null);
        } catch (err) {
            console.error('Import commit error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Import',
                text: err?.response?.data?.message || 'Terjadi kesalahan saat menyimpan data ke database.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreviewResult(null);
    };

    if (!isSuperAdmin) return null;

    return (
        <AdminLayout>
            <div className="p-6 max-w-7xl mx-auto space-y-6 font-['Poppins']">
                {/* Page Header */}
                <div className="bg-gradient-to-r from-[#0080C5] to-sky-600 rounded-3xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
                                <FileSpreadsheet size={14} /> Import Data Massal (Excel)
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Pusat Import Data Sistem</h1>
                            <p className="text-sky-100 text-xs lg:text-sm max-w-2xl leading-relaxed">
                                Tambahkan data massal dengan mudah dan aman. Silakan download format template terlebih dahulu, lalu upload file untuk melihat preview data valid & invalid sebelum disimpan ke sistem.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Import Type Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {IMPORT_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isActive = activeTab === type.id;
                        return (
                            <button
                                key={type.id}
                                onClick={() => handleTabChange(type.id)}
                                className={`p-5 rounded-2xl border text-left transition-all duration-300 relative group overflow-hidden ${
                                    isActive
                                        ? 'bg-white border-[#0080C5] shadow-lg shadow-sky-100 ring-2 ring-[#0080C5]/20'
                                        : 'bg-white/70 hover:bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                                }`}
                            >
                                <div className="flex items-center gap-3.5 mb-2">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                        isActive ? 'bg-[#0080C5] text-white' : 'bg-sky-50 text-[#0080C5] group-hover:bg-[#0080C5] group-hover:text-white'
                                    }`}>
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <h3 className={`text-sm font-bold ${isActive ? 'text-[#0080C5]' : 'text-slate-800'}`}>
                                            {type.label}
                                        </h3>
                                        <p className="text-[10px] text-slate-400 font-medium">Khusus Superadmin</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed font-normal">{type.desc}</p>
                            </button>
                        );
                    })}
                </div>

                {/* Upload & Template Section */}
                <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm space-y-6">
                    {/* Step 1: Download Template */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-sky-50/70 border border-sky-100 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#0080C5] text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-200">
                                <Download size={22} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Langkah 1: Download Template Excel</h4>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {activeTab === 'dampingan'
                                        ? 'Template ini akan otomatis membuat sheet per Kelompok Dampingan yang ada di database.'
                                        : 'Gunakan format standar ini untuk menghindari kesalahan pengisian data.'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleDownloadTemplate}
                            disabled={isLoadingGrups && activeTab === 'dampingan'}
                            className="w-full md:w-auto px-5 py-2.5 bg-[#0080C5] hover:bg-sky-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-100 flex items-center justify-center gap-2 shrink-0 disabled:bg-slate-300"
                        >
                            {isLoadingGrups && activeTab === 'dampingan' ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Download size={16} />
                            )}
                            Download Template ({IMPORT_TYPES.find(t => t.id === activeTab)?.label})
                        </button>
                    </div>

                    {/* Step 2: Upload File */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-800">
                            Langkah 2: Upload File Excel (.xlsx / .xls)
                        </label>

                        <div className="relative border-2 border-dashed border-sky-200 hover:border-[#0080C5] bg-sky-50/30 hover:bg-sky-50/60 transition-all rounded-3xl p-8 text-center cursor-pointer group">
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                                <div className="w-14 h-14 rounded-full bg-white shadow-md border border-sky-100 flex items-center justify-center text-[#0080C5] group-hover:scale-110 transition-transform">
                                    <UploadCloud size={28} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">
                                        {selectedFile ? selectedFile.name : 'Klik atau seret file Excel ke sini'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Mendukung format .xlsx, .xls, atau .csv (Maksimal 10MB)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loader during parse & backend preview */}
                    {isParsing && (
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-600 text-xs font-semibold">
                            <Loader2 size={20} className="animate-spin text-[#0080C5]" /> Memeriksa dan memvalidasi isi file Excel...
                        </div>
                    )}
                </div>

                {/* Step 3: PREVIEW & VALIDATION RESULT */}
                {previewResult && (
                    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm space-y-6 animate-fade-in">
                        {/* Summary Bar */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <FileSpreadsheet size={20} className="text-[#0080C5]" /> Preview & Result Validasi Data
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Silakan periksa data sebelum disimpan. Data invalid dapat Anda perbaiki terlebih dahulu di file Excel.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-600" />
                                    <span className="text-xs font-bold text-emerald-700">
                                        {previewResult.summary.valid_count} Valid
                                    </span>
                                </div>
                                <div className="px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
                                    <XCircle size={16} className="text-rose-600" />
                                    <span className="text-xs font-bold text-rose-700">
                                        {previewResult.summary.invalid_count} Gagal / Invalid
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Fasilitator Note Banner */}
                        {activeTab === 'fasilitator' && (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800 text-xs leading-relaxed">
                                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold">Catatan Penting Fasilitator:</span> Akun Fasilitator yang di-import melalui file Excel belum otomatis mendampingi Kelompok Dampingan (Grup) mana pun. Silakan hubungkan Fasilitator ke Grup Dampingan secara manual melalui menu <b>Data Grup Dampingan</b> atau <b>Data Fasilitator</b> setelah proses import selesai.
                                </div>
                            </div>
                        )}

                        {/* Preview Tabs */}
                        <div className="flex border-b border-slate-200 gap-2">
                            <button
                                onClick={() => setPreviewTab('valid')}
                                className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                                    previewTab === 'valid'
                                        ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50'
                                        : 'border-transparent text-slate-400 hover:text-slate-700'
                                }`}
                            >
                                <CheckCircle2 size={16} /> Data Valid ({previewResult.valid?.length || 0})
                            </button>
                            <button
                                onClick={() => setPreviewTab('invalid')}
                                className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                                    previewTab === 'invalid'
                                        ? 'border-rose-500 text-rose-600 bg-rose-50/50'
                                        : 'border-transparent text-slate-400 hover:text-slate-700'
                                }`}
                            >
                                <XCircle size={16} /> Data Gagal / Error ({previewResult.invalid?.length || 0})
                            </button>
                        </div>

                        {/* TAB CONTENT: DATA VALID */}
                        {previewTab === 'valid' && (
                            <div className="overflow-x-auto rounded-2xl border border-slate-100">
                                {previewResult.valid && previewResult.valid.length > 0 ? (
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                                            <tr>
                                                <th className="py-3 px-4">Baris</th>
                                                {activeTab === 'dampingan' && <th className="py-3 px-4">Sheet / Grup</th>}
                                                <th className="py-3 px-4">Nama</th>
                                                {activeTab === 'admin' && <th className="py-3 px-4">Role</th>}
                                                {activeTab === 'admin' && <th className="py-3 px-4">Username</th>}
                                                {activeTab === 'fasilitator' && <th className="py-3 px-4">Username</th>}
                                                {activeTab === 'fasilitator' && <th className="py-3 px-4">Bidang</th>}
                                                {activeTab === 'grup' && <th className="py-3 px-4">Level Dampingan</th>}
                                                {activeTab === 'grup' && <th className="py-3 px-4">Nama PJ</th>}
                                                {activeTab === 'dampingan' && <th className="py-3 px-4">Bidang</th>}
                                                {activeTab === 'dampingan' && <th className="py-3 px-4">No Anggota</th>}
                                                <th className="py-3 px-4 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {previewResult.valid.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="py-3.5 px-4 font-mono text-slate-400">#{row._row}</td>
                                                    {activeTab === 'dampingan' && (
                                                        <td className="py-3.5 px-4 font-bold text-slate-700">{row._sheet || row.grup_name || '-'}</td>
                                                    )}
                                                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.name || row.nama_grup || '-'}</td>
                                                    {activeTab === 'admin' && <td className="py-3.5 px-4 font-semibold text-sky-700">{row.role_name}</td>}
                                                    {activeTab === 'admin' && <td className="py-3.5 px-4 font-mono text-slate-600">{row.username}</td>}
                                                    {activeTab === 'fasilitator' && <td className="py-3.5 px-4 font-mono text-slate-600">{row.username}</td>}
                                                    {activeTab === 'fasilitator' && <td className="py-3.5 px-4 text-slate-600">{row.bidang_names || '-'}</td>}
                                                    {activeTab === 'grup' && <td className="py-3.5 px-4 font-semibold text-slate-700 capitalize">{row.level_dampingan || '-'}</td>}
                                                    {activeTab === 'grup' && <td className="py-3.5 px-4 text-slate-700">{row.nama_pj || '-'} ({row.username_pj || '-'})</td>}
                                                    {activeTab === 'dampingan' && <td className="py-3.5 px-4 text-slate-700">{row.bidang_name || '-'}</td>}
                                                    {activeTab === 'dampingan' && <td className="py-3.5 px-4 font-mono text-[#0080C5]">{row.no_anggota || '(Auto-generated)'}</td>}
                                                    <td className="py-3.5 px-4 text-center">
                                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full inline-flex items-center gap-1 border border-emerald-200">
                                                            <CheckCircle2 size={12} /> Ready
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-8 text-center text-slate-400 text-xs font-medium">
                                        Tidak ada data valid yang bisa dimasukkan.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB CONTENT: DATA GAGAL / INVALID */}
                        {previewTab === 'invalid' && (
                            <div className="overflow-x-auto rounded-2xl border border-rose-100">
                                {previewResult.invalid && previewResult.invalid.length > 0 ? (
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-rose-50/50 border-b border-rose-100 text-rose-700 uppercase font-semibold text-[10px] tracking-wider">
                                            <tr>
                                                <th className="py-3 px-4">Baris</th>
                                                {activeTab === 'dampingan' && <th className="py-3 px-4">Sheet</th>}
                                                <th className="py-3 px-4">Isi Baris (Nama / Identifier)</th>
                                                <th className="py-3 px-4">Alasan Error / Penyebab Gagal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-rose-50">
                                            {previewResult.invalid.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-rose-50/30 transition-colors">
                                                    <td className="py-3.5 px-4 font-mono text-rose-500 font-bold">#{row._row}</td>
                                                    {activeTab === 'dampingan' && (
                                                        <td className="py-3.5 px-4 font-semibold text-slate-700">{row._sheet || '-'}</td>
                                                    )}
                                                    <td className="py-3.5 px-4 font-bold text-slate-800">
                                                        {row.name || row.nama || row.nama_grup || row.Nama || row['Nama Lengkap'] || '-'}
                                                    </td>
                                                    <td className="py-3.5 px-4 space-y-1">
                                                        {row._errors && row._errors.map((err, ei) => (
                                                            <div key={ei} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-100 text-rose-700 rounded-md text-[11px] font-semibold mr-1.5 mb-1 border border-rose-200">
                                                                <AlertCircle size={12} className="shrink-0" /> {err}
                                                            </div>
                                                        ))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-8 text-center text-slate-400 text-xs font-medium">
                                        Selamat! Tidak ada data yang error / gagal pada file Excel ini.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Footer */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                            <button
                                onClick={handleReset}
                                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={14} /> Batal / Reset
                            </button>

                            <button
                                onClick={handleCommitImport}
                                disabled={isSubmitting || !previewResult.valid || previewResult.valid.length === 0}
                                className="w-full sm:w-auto px-6 py-3 bg-[#0080C5] hover:bg-sky-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-100 flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none"
                            >
                                {isSubmitting ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <CheckCircle2 size={16} />
                                )}
                                Proses Import {previewResult.valid?.length || 0} Data Valid ke Database
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ImportDataPage;
