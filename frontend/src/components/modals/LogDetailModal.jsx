import React from 'react';
import { X, Clock, User, Info, Shield, Monitor, ArrowRight } from 'lucide-react';

const LogDetailModal = ({ isOpen, onClose, log }) => {
    if (!isOpen || !log) return null;

    const aksi = log.aksi || 'Unknown';
    const isUpdate = aksi.toUpperCase() === 'UPDATE';
    const isAuth = ['LOGIN', 'LOGOUT'].includes(aksi.toUpperCase());
    
    let timeFormatted = '-';
    if (log.created_at) {
        const d = new Date(log.created_at);
        timeFormatted = d.toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
            timeZone: 'Asia/Jakarta'
        }).replace(/\./g, ':') + ' WIB';
    }

    const formatValue = (val) => {
        if (val === null || val === undefined || val === '') return <span className="text-slate-400 italic">kosong</span>;
        if (typeof val === 'object') {
            if (Array.isArray(val)) return `[ ${val.length} item ]`;
            if (val.name) return val.name;
            if (val.judul) return val.judul;
            return JSON.stringify(val);
        }
        return String(val);
    };

    const formatKey = (key) => {
        if (key === 'role_id') return 'Role';
        if (key === 'kode_prov') return 'Provinsi';
        if (key === 'kode_kab') return 'Kabupaten';
        if (key === 'kode_kec') return 'Kecamatan';
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const getChangedFields = (oldData, newData) => {
        const changes = [];
        const oldD = oldData || {};
        const newD = newData || {};
        const allKeys = new Set([...Object.keys(oldD), ...Object.keys(newD)]);
        
        allKeys.forEach(key => {
            if (['created_at', 'updated_at', 'id', 'id_user', 'created_by'].includes(key)) return;
            
            // Hanya periksa jika key ini ada di data sebelum (oldData).
            // Kalau key tidak ada di oldData, berarti ini hanya relasi (seperti `role`, `provinsi`) 
            // yang di-load oleh backend setelah update, bukan field yang benar-benar di-update.
            if (!(key in oldD)) return;
            
            const oldVal = oldD[key];
            const newVal = newD[key];
            
            if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                changes.push({
                    key,
                    oldValue: oldVal,
                    newValue: newVal
                });
            }
        });
        
        return changes;
    };

    const renderDataDiff = () => {
        if (!isUpdate && !log.data_baru && !log.data_lama) return null;

        if (isUpdate) {
            const changes = getChangedFields(log.data_lama, log.data_baru);
            
            if (changes.length === 0) {
                return (
                    <div className="mt-4">
                        <h4 className="text-xs font-semibold text-slate-700 mb-2">Perubahan Data</h4>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center text-sm text-slate-500">
                            Tidak terdeteksi adanya perubahan field.
                        </div>
                    </div>
                );
            }

            return (
                <div className="mt-4">
                    <h4 className="text-xs font-semibold text-slate-700 mb-3">Perincian Perubahan Data</h4>
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-3 px-4 text-xs font-bold text-slate-600">Field</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-600">Sebelum (Before)</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-600">Sesudah (After)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {changes.map((change, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-4 text-[13px] font-semibold text-slate-700">
                                            {formatKey(change.key)}
                                        </td>
                                        <td className="py-3 px-4 text-[13px] text-slate-600">
                                            <div className="bg-red-50 text-red-600 px-2 py-1 rounded inline-block">
                                                {formatValue(change.oldValue)}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-[13px] text-slate-600">
                                            <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded inline-block">
                                                {formatValue(change.newValue)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        // For non-update with data (like CREATE or DELETE)
        const targetData = log.data_baru || log.data_lama;
        if (!targetData || Object.keys(targetData).length === 0) return null;

        return (
            <div className="mt-4">
                <h4 className="text-xs font-semibold text-slate-700 mb-3">Data Terkait</h4>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <tbody className="divide-y divide-slate-100">
                            {Object.entries(targetData).map(([key, val], idx) => {
                                if (['created_at', 'updated_at', 'created_by'].includes(key)) return null;
                                return (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-2.5 px-4 text-[13px] font-semibold text-slate-700 w-1/3 bg-slate-50">
                                            {formatKey(key)}
                                        </td>
                                        <td className="py-2.5 px-4 text-[13px] text-slate-600">
                                            {formatValue(val)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500">
                            <Info size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Detail Log Aktivitas</h2>
                            <p className="text-xs text-slate-500">ID: {log.id_log}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    <div className="space-y-4">
                        {/* Info Utama */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Pengguna</p>
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-slate-600" />
                                    <span className="text-xs font-medium text-slate-900">{log.user?.name || '-'}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Waktu</p>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-slate-600" />
                                    <span className="text-xs font-medium text-slate-900">{timeFormatted}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Aksi</p>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                                    {aksi}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Modul</p>
                                <span className="text-xs font-medium text-slate-900">{log.modul || '-'}</span>
                            </div>
                        </div>

                        {/* Info Auth: IP & User Agent */}
                        {isAuth && (log.ip_address || log.user_agent) && (
                            <div className="grid grid-cols-1 gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                                {log.ip_address && (
                                    <div>
                                        <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">IP Address</p>
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className="text-indigo-500" />
                                            <span className="text-xs font-medium text-indigo-900 font-mono">{log.ip_address}</span>
                                        </div>
                                    </div>
                                )}
                                {log.user_agent && (
                                    <div>
                                        <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">User Agent</p>
                                        <div className="flex items-start gap-2">
                                            <Monitor size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                                            <span className="text-xs font-medium text-indigo-900 leading-relaxed">{log.user_agent}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Deskripsi */}
                        <div>
                            <h4 className="text-xs font-semibold text-slate-700 mb-1">Deskripsi Aktivitas</h4>
                            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                {log.deskripsi || '-'}
                            </p>
                        </div>

                        {/* Data Perubahan */}
                        {renderDataDiff()}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogDetailModal;
