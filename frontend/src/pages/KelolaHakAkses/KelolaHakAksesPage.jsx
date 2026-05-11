import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
    RotateCcw, 
    Save, 
    User, 
    UserCheck, 
    Users, 
    Globe, 
    Info, 
    Loader2,
    LayoutDashboard,
    Shield,
    Users2,
    Map
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useRoles, usePermissions, useHakAksesMutations } from '../../hooks/queries/useHakAksesQuery';

const Toggle = ({ enabled, onChange, colorClass = 'bg-[#0080C5]', disabled = false }) => (
    <button
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${enabled ? colorClass : 'bg-gray-200'}`}
    >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);

const FeatureItem = ({ title, subtitle, enabled, onChange, colorClass }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 group">
        <div className="flex-1 pr-4">
            <h4 className="text-[11px] font-bold text-slate-900 group-hover:text-[#0080C5] transition-colors">{title}</h4>
            <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-2">{subtitle}</p>
        </div>
        <Toggle enabled={enabled} onChange={onChange} colorClass={colorClass} />
    </div>
);

const KelolaHakAksesPage = () => {
    const { data: rolesData, isLoading: loadingRoles, isError: errorRoles, refetch: refetchRoles } = useRoles();
    const { data: permsData, isLoading: loadingPerms, isError: errorPerms, refetch: refetchPerms } = usePermissions();
    const { updateRolePermissions } = useHakAksesMutations();

    const [localPerms, setLocalPerms] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const roles = rolesData?.data || [];
    const permissions = permsData?.data || [];

    // Hanya gunakan permissions real dari BE

    const roleMap = roles.reduce((acc, r) => ({ ...acc, [r.name]: r }), {});
    const permMap = permissions.reduce((acc, p) => ({ ...acc, [p.code]: p }), {});

    useEffect(() => {
        if (roles.length > 0) {
            const initial = {};
            roles.forEach(role => {
                // Baca permissions aktif per role dari response BE (eager load with('permissions'))
                initial[role.id_role] = new Set(
                    (role.permissions || []).map(p => p.id_permission)
                );
            });
            setLocalPerms(initial);
        }
    }, [rolesData]);

    const hasPermission = (roleName, permCode) => {
        const roleId = roleMap[roleName]?.id_role;
        const permId = permMap[permCode]?.id_permission;
        if (!roleId || !permId) return false;
        return localPerms[roleId]?.has(permId) ?? false;
    };

    const togglePermission = (roleNames, permCodes) => {
        const names = Array.isArray(roleNames) ? roleNames : [roleNames];
        const codes = Array.isArray(permCodes) ? permCodes : [permCodes];

        setLocalPerms(prev => {
            const next = { ...prev };
            names.forEach(roleName => {
                const roleId = roleMap[roleName]?.id_role;
                if (!roleId) return;
                
                const updated = new Set(next[roleId] || []);
                codes.forEach(code => {
                    const permId = permMap[code]?.id_permission;
                    if (!permId) return;

                    if (updated.has(permId)) updated.delete(permId);
                    else updated.add(permId);
                });
                next[roleId] = updated;
            });
            return next;
        });
    };

    const handleReset = () => {
        if (roles.length > 0) {
            // Kembalikan ke state awal dari BE (sebelum ada perubahan lokal)
            const original = {};
            roles.forEach(role => {
                original[role.id_role] = new Set(
                    (role.permissions || []).map(p => p.id_permission)
                );
            });
            setLocalPerms(original);
            Swal.fire({
                title: 'Reset Berhasil!',
                text: 'Hak akses dikembalikan ke pengaturan yang tersimpan di database.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                customClass: { popup: 'rounded-2xl font-[\'Poppins\']' }
            });
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const roleEntries = Object.entries(localPerms);
            for (const [roleId, permSet] of roleEntries) {
                const realPermissions = [...permSet];
                
                await updateRolePermissions.mutateAsync({
                    roleId,
                    permissions: realPermissions,
                });
            }
            Swal.fire({
                title: 'Berhasil!',
                text: 'Pengaturan hak akses berhasil disimpan.',
                icon: 'success',
                confirmButtonColor: '#0080C5',
                timer: 1800,
                showConfirmButton: false,
                customClass: { popup: 'rounded-2xl font-[\'Poppins\']' }
            });
        } catch {
            Swal.fire({
                title: 'Gagal!',
                text: 'Terjadi kesalahan saat menyimpan hak akses.',
                icon: 'error',
                confirmButtonColor: '#EF4444',
                customClass: { popup: 'rounded-2xl font-[\'Poppins\']' }
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (loadingRoles || loadingPerms) return (
        <AdminLayout title="Kelola Hak Akses">
            <div className="p-8 flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin text-[#0080C5]" size={40} />
            </div>
        </AdminLayout>
    );

    if (errorRoles || errorPerms) return (
        <AdminLayout title="Kelola Hak Akses">
            <div className="p-8 flex flex-col justify-center items-center min-h-[60vh] gap-4">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                    <Shield size={32} className="text-red-400" />
                </div>
                <div className="text-center">
                    <h3 className="text-sm font-bold text-slate-800">Gagal Memuat Data Hak Akses</h3>
                    <p className="text-xs text-slate-400 mt-1">Terjadi kesalahan saat mengambil data. Periksa koneksi Anda.</p>
                </div>
                <button
                    onClick={() => { refetchRoles(); refetchPerms(); }}
                    className="h-10 px-6 bg-[#0080C5] text-white rounded-xl flex items-center gap-2 text-[11px] font-bold hover:bg-sky-700 transition-all shadow-sm"
                >
                    <RotateCcw size={14} /> Coba Lagi
                </button>
            </div>
        </AdminLayout>
    );

    const adminRoles = ['admin_provinsi', 'admin_kabupaten', 'admin_kecamatan'];

    return (
        <AdminLayout title="Kelola Hak Akses">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                
                {/* Header Section */}
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <h2 className="text-[15px] font-bold text-slate-950 tracking-tight">Konfigurasi Fitur per Role</h2>
                        <p className="text-[11px] text-slate-400 font-medium">Gunakan toggle untuk mengaktifkan atau menonaktifkan fitur pada setiap role.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleReset}
                            className="h-10 px-6 bg-white border border-gray-200 rounded-xl text-[#0080C5] text-[11px] font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <RotateCcw size={16} /> Reset Default
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="h-10 px-6 bg-[#0080C5] text-white rounded-xl flex items-center gap-2 text-[11px] font-bold hover:bg-sky-700 transition-all shadow-sm disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>

                {/* Role Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Role Admin Card */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-[#0080C5]">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="text-[13px] font-bold text-slate-950">Role Admin</h3>
                                <p className="text-[10px] text-slate-400 font-medium">Provinsi - Kabupaten - Kecamatan</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <FeatureItem 
                                title="Kelola Data Fasilitator"
                                subtitle="Hanya menampilkan fasilitator di wilayah bawahnya"
                                enabled={hasPermission('admin_provinsi', 'kelola_fasilitator')}
                                onChange={() => togglePermission(adminRoles, 'kelola_fasilitator')}
                                colorClass="bg-[#0080C5]"
                            />
                            <FeatureItem 
                                title="Kelola Data Admin Bawahan"
                                subtitle="Khusus Provinsi & Kabupaten"
                                enabled={hasPermission('admin_provinsi', 'kelola_admin_bawahan')}
                                onChange={() => togglePermission(['admin_provinsi', 'admin_kabupaten'], 'kelola_admin_bawahan')}
                                colorClass="bg-[#0080C5]"
                            />
                            <FeatureItem 
                                title="Kelola Data Masyarakat"
                                subtitle="Sesuai wilayah tanggung jawab"
                                enabled={hasPermission('admin_provinsi', 'kelola_masyarakat')}
                                onChange={() => togglePermission(adminRoles, 'kelola_masyarakat')}
                                colorClass="bg-[#0080C5]"
                            />
                            <FeatureItem 
                                title="Kelola Grup Dampingan"
                                subtitle="Sesuai wilayah tanggung jawab"
                                enabled={hasPermission('admin_provinsi', 'kelola_grup')}
                                onChange={() => togglePermission(adminRoles, 'kelola_grup')}
                                colorClass="bg-[#0080C5]"
                            />
                        </div>
                    </div>

                    {/* Role Fasilitator Card */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#EA580C]">
                                <UserCheck size={24} />
                            </div>
                            <div>
                                <h3 className="text-[13px] font-bold text-slate-950">Role Fasilitator</h3>
                                <p className="text-[10px] text-slate-400 font-medium">Pengelola Lapangan & Validasi</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <FeatureItem 
                                title="CRUD Laporan Kegiatan"
                                subtitle="Tambah, ubah, dan hapus laporan yang dibuat"
                                enabled={hasPermission('fasilitator', 'create_kegiatan')}
                                onChange={() => togglePermission('fasilitator', ['create_kegiatan', 'edit_kegiatan', 'delete_kegiatan', 'view_kegiatan'])}
                                colorClass="bg-[#EA580C]"
                            />
                            <FeatureItem 
                                title="Validasi Warga Baru"
                                subtitle="Setujui atau tolak pengajuan pendaftaran warga baru"
                                enabled={hasPermission('fasilitator', 'verifikasi_anggota')}
                                onChange={() => togglePermission('fasilitator', 'verifikasi_anggota')}
                                colorClass="bg-[#EA580C]"
                            />
                        </div>
                    </div>

                    {/* Role PJ Dampingan Card */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-[#6366F1]">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="text-[13px] font-bold text-slate-950">Role PJ Dampingan</h3>
                                <p className="text-[10px] text-slate-400 font-medium">Pengurus Anggota Grup</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <FeatureItem 
                                title="Pendaftaran Warga Baru"
                                subtitle="Input formulir calon warga untuk divalidasi Fasilitator"
                                enabled={hasPermission('pj_grup', 'ajukan_anggota')}
                                onChange={() => togglePermission('pj_grup', 'ajukan_anggota')}
                                colorClass="bg-[#6366F1]"
                            />
                        </div>
                    </div>
                </div>

                {/* Global Features Table Section */}
                <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                            <Globe size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-950">Fitur Global</h3>
                            <p className="text-[10px] text-slate-400 font-medium">Dapat dikonfigurasi per role secara individual</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#FAFBFD]/50 border-b border-slate-50">
                                    <th className="py-4 px-8 text-left text-[#9298B0] text-[9px] font-bold uppercase tracking-widest">FITUR</th>
                                    <th className="py-4 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#0080C5]" />
                                            <span className="text-[#9298B0] text-[9px] font-bold uppercase tracking-widest">ADMIN</span>
                                        </div>
                                    </th>
                                    <th className="py-4 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#EA580C]" />
                                            <span className="text-[#9298B0] text-[9px] font-bold uppercase tracking-widest">FASILITATOR</span>
                                        </div>
                                    </th>
                                    <th className="py-4 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
                                            <span className="text-[#9298B0] text-[9px] font-bold uppercase tracking-widest">PJ DAMPINGAN</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[
                                    // view_dashboard & view_peta_sebaran dihapus — permission tidak terdaftar di BE
                                    { id: 'admin', label: 'Data Admin', sub: 'Manajemen data user dengan level akses administratif.', code: 'kelola_admin_bawahan' },
                                    { id: 'masy', label: 'Data Masyarakat', sub: 'Akses ke data profil dan histori masyarakat dampingan.', code: 'kelola_masyarakat' },
                                ].map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-5 px-8">
                                            <h4 className="text-[11px] font-bold text-slate-900">{item.label}</h4>
                                            <p className="text-[9px] text-slate-400 mt-0.5">{item.sub}</p>
                                        </td>
                                        {/* Kolom ADMIN (Sync Prov, Kab, Kec) */}
                                        <td className="py-5 px-4 text-center">
                                            <Toggle 
                                                enabled={hasPermission('admin_provinsi', item.code)} 
                                                onChange={() => togglePermission(adminRoles, item.code)} 
                                                colorClass="bg-[#0080C5]"
                                            />
                                        </td>
                                        {/* Kolom FASILITATOR */}
                                        <td className="py-5 px-4 text-center">
                                            <Toggle 
                                                enabled={hasPermission('fasilitator', item.code)} 
                                                onChange={() => togglePermission('fasilitator', item.code)} 
                                                colorClass="bg-[#EA580C]"
                                            />
                                        </td>
                                        {/* Kolom PJ DAMPINGAN */}
                                        <td className="py-5 px-4 text-center">
                                            <Toggle 
                                                enabled={hasPermission('pj_grup', item.code)} 
                                                onChange={() => togglePermission('pj_grup', item.code)} 
                                                colorClass="bg-[#6366F1]"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-8 py-4 bg-slate-50/50 flex items-center gap-3 border-t border-slate-100">
                        <Info size={14} className="text-slate-400" />
                        <p className="text-[10px] text-slate-400 font-medium italic">Perubahan fitur global berlaku setelah disimpan. Setiap role dapat dikonfigurasi secara independen.</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default KelolaHakAksesPage;
