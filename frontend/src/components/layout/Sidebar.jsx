import { NavLink } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogin';
import { getUser, getPermissions } from '../../utils/storage';
import {
    Grid2X2,
    Users,
    UserCheck,
    UserCog,
    UsersRound,
    ClipboardList,
    Settings2,
    ShieldCheck,
    Map,
    History,
    BookOpen,
    LogOut,
    LayoutGrid
} from 'lucide-react';

const Sidebar = () => {
    const { logout } = useLogout();
    const user = getUser();

    // Permissions dinamis dari localStorage (diisi saat login/refresh)
    const userPermissions = getPermissions(); // string[]

    // Normalkan role
    let userRole = typeof user?.role === 'object' && user?.role !== null ? user.role.name : user?.role;
    if (!userRole && user?.username === 'superadmin') userRole = 'superadmin';

    const isSuperAdmin = userRole === 'superadmin';

    /**
     * Daftar semua menu item.
     * permission: null   → tampil untuk semua user yang sudah login
     * permission: string → tampil hanya jika userPermissions mengandung permission ini
     */
    const allMenuItems = [
        { icon: <Grid2X2 size={18} />,        label: 'Dashboard',            path: '/dashboard',           permission: null },
        { icon: <Users size={18} />,          label: 'Data Admin',           path: '/data-admin',          permission: 'kelola_admin_bawahan' },
        { icon: <UserCheck size={18} />,      label: 'Data Fasilitator',     path: '/data-fasilitator',    permission: 'kelola_fasilitator' },
        { icon: <UserCog size={18} />,        label: 'Data Pj Dampingan',    path: '/data-pj',             permission: 'kelola_pj_grup' },
        { icon: <UsersRound size={18} />,     label: 'Data Grup Dampingan',  path: '/data-grup',           permission: 'kelola_grup' },
        { icon: <ClipboardList size={18} />,  label: 'Kegiatan Dampingan',   path: '/kegiatan-dampingan',  permission: 'view_kegiatan' },
        { icon: <Users size={18} />,          label: 'Konfirmasi Anggota',   path: '/konfirmasi-anggota',  permission: 'verifikasi_anggota' },
        { icon: <LayoutGrid size={18} />,     label: 'Kelola Dampingan',     path: '/kelola-dampingan',    permission: 'kelola_grup' },
        { icon: <Settings2 size={18} />,      label: 'Kelola Kegiatan',      path: '/kelola-kegiatan',     permission: 'create_kegiatan' },
        { icon: <ShieldCheck size={18} />,    label: 'Kelola Hak Akses',     path: '/hak-akses',           permission: 'manage_roles' },
        { icon: <Users size={18} />,          label: 'Pendaftaran Anggota',       path: '/kelola-anggota',      permission: 'ajukan_anggota' },
        { icon: <LayoutGrid size={18} />,     label: 'Informasi Dampingan',  path: '/informasi-dampingan', permission: null },
        { icon: <Map size={18} />,            label: 'Peta Sebaran',         path: '/peta',                permission: 'view_peta_sebaran' },
        { icon: <History size={18} />,        label: 'Log Aktifitas',        path: '/log',                 permission: null },
        { icon: <BookOpen size={18} />,       label: 'Panduan Penggunaan',   path: '/panduan',             permission: 'view_panduan' },
    ];

    // Path sidebar khusus superadmin
    const SUPERADMIN_PATHS = [
        '/dashboard', '/data-admin', '/data-fasilitator', '/data-pj',
        '/data-grup', '/kegiatan-dampingan', '/kelola-kegiatan',
        '/hak-akses', '/peta', '/log', '/panduan'
    ];

    const menuItems = allMenuItems.filter(item => {
        if (isSuperAdmin) {
            return SUPERADMIN_PATHS.includes(item.path);
        }

        // Cek permission dari localStorage
        if (item.permission !== null && !userPermissions.includes(item.permission)) {
            return false;
        }

        // Hindari menu overlap antar role:
        // /data-grup hanya untuk admin (bukan fasilitator)
        if (item.path === '/data-grup' && userRole === 'fasilitator') return false;
        // /kelola-dampingan hanya untuk fasilitator (bukan admin)
        if (item.path === '/kelola-dampingan' && userRole?.includes('admin')) return false;
        if (item.path === '/kelola-dampingan' && userRole === 'pj_grup') return false;
        // /konfirmasi-anggota hanya untuk fasilitator
        if (item.path === '/konfirmasi-anggota' && userRole !== 'fasilitator') return false;
        // /kelola-anggota & /informasi-dampingan hanya untuk pj_grup
        if (item.path === '/kelola-anggota' && userRole !== 'pj_grup') return false;
        if (item.path === '/informasi-dampingan' && userRole !== 'pj_grup') return false;

        return true;
    });

    return (
        <aside className="w-64 h-screen bg-white border-r border-black/10 flex flex-col fixed left-0 top-0 z-50 font-['Poppins']">
            {/* Logo Section */}
            <div className="h-20 px-6 border-b border-black/10 flex items-center gap-3 shrink-0">
                <img src="/images/logo-mpm.png" alt="MPM" className="w-9 h-11 object-contain" />
                <div className="flex flex-col">
                    <span className="text-[#1E1E1E] text-base font-bold tracking-tight">MPM</span>
                    <span className="text-[#9298B0] text-sm font-normal">Muhammadiyah</span>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-3 py-2 overflow-y-auto flex flex-col gap-1">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-300 group
                            ${isActive
                                ? 'bg-[#0080C5] text-white shadow-md shadow-sky-100'
                                : 'text-[#9298B0] hover:bg-sky-50/50 hover:text-[#0080C5]'}`
                        }
                    >
                        <span className="shrink-0 transition-colors duration-300">
                            {item.icon}
                        </span>
                        <span className="text-[13px] font-bold tracking-wide truncate">
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout Section */}
            <div className="px-3 py-2 shrink-0 border-t border-black/5">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#EF4444] hover:bg-red-50 transition-all duration-200"
                >
                    <LogOut size={18} />
                    <span className="text-[13px] font-semibold tracking-tight">Keluar</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
