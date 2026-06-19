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
    LayoutGrid,
    X,
    FileText
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
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

        // Admin menus
        { icon: <Users size={18} />,          label: 'Data Admin',           path: '/data-admin',          permission: 'kelola_admin_bawahan' },
        { icon: <UserCheck size={18} />,      label: 'Data Fasilitator',     path: '/data-fasilitator',    permission: 'kelola_fasilitator' },
        { icon: <UserCog size={18} />,        label: 'Data Pj Dampingan',    path: '/data-pj',             permission: 'kelola_pj_grup' },
        { icon: <UsersRound size={18} />,     label: 'Data Grup Dampingan',  path: '/data-grup',           permission: 'kelola_grup' },
        { icon: <Users size={18} />,          label: 'Data Dampingan',       path: '/data-dampingan',      permission: 'kelola_masyarakat' },
        { icon: <ClipboardList size={18} />,  label: 'Kegiatan Dampingan',   path: '/kegiatan-dampingan',  permission: 'view_kegiatan' },

        // Fasilitator
        { icon: <Users size={18} />,          label: 'Konfirmasi Anggota',   path: '/konfirmasi-anggota',  permission: 'verifikasi_anggota' },
        { icon: <LayoutGrid size={18} />,     label: 'Kelola Dampingan',     path: '/kelola-dampingan',    permission: 'verifikasi_anggota' },
        { icon: <Settings2 size={18} />,      label: 'Kelola Kegiatan',      path: '/kelola-kegiatan',     permission: ['create_kegiatan','edit_kegiatan','delete_kegiatan'] },

        // Superadmin only
        { icon: <ShieldCheck size={18} />,    label: 'Kelola Hak Akses',     path: '/hak-akses',           permission: 'manage_roles' },
        { icon: <FileText size={18} />,       label: 'Template Sertifikat',  path: '/template-sertifikat', permission: 'manage_roles' },
        { icon: <LayoutGrid size={18} />,     label: 'Kelola Landing Page',  path: '/manage-landing-page', permission: 'manage_roles' },

        // PJ Grup
        { icon: <Users size={18} />,          label: 'Pendaftaran Anggota',  path: '/kelola-anggota',      permission: 'ajukan_anggota' },
        { icon: <LayoutGrid size={18} />,     label: 'Informasi Dampingan',  path: '/informasi-dampingan', permission: null },

        // Shared
        { icon: <Map size={18} />,            label: 'Peta Sebaran',         path: '/peta',                permission: 'view_peta_sebaran' },
        { icon: <History size={18} />,        label: 'Log Aktifitas',        path: '/log',                 permission: null },
        { icon: <BookOpen size={18} />,       label: 'Panduan Penggunaan',   path: '/panduan',             permission: 'view_panduan' },
    ];

    // Path sidebar khusus superadmin
    const SUPERADMIN_PATHS = [
        '/dashboard', '/data-admin', '/data-fasilitator', '/data-pj',
        '/data-grup', '/data-dampingan', '/kegiatan-dampingan', '/kelola-kegiatan',
        '/hak-akses', '/template-sertifikat', '/manage-landing-page', '/peta', '/log', '/panduan'
    ];

    const ROLE_MENU_ORDER = {
        fasilitator: [
            '/dashboard',
            '/konfirmasi-anggota',
            '/kelola-dampingan',
            '/kelola-kegiatan',
            '/kegiatan-dampingan',
            '/peta',
            '/log',
            '/panduan',
        ],
        pj_grup: [
            '/dashboard',
            '/kelola-anggota',
            '/informasi-dampingan',
            '/kegiatan-dampingan',
            '/peta',
            '/log',
            '/panduan',
        ],
    };

    const hasPermission = (item) => {
        if (item.permission === null) return true;
        if (Array.isArray(item.permission)) return item.permission.some((p) => userPermissions.includes(p));
        return userPermissions.includes(item.permission);
    };

    const menuItems = (() => {
        if (isSuperAdmin) {
            return allMenuItems.filter((item) => SUPERADMIN_PATHS.includes(item.path));
        }

        // Role menu khusus (biar urutan konsisten & tidak kebawa menu lintas role)
        const orderedPaths = ROLE_MENU_ORDER[userRole];
        if (orderedPaths) {
            return orderedPaths
                .map((path) => allMenuItems.find((item) => item.path === path))
                .filter(Boolean)
                .filter(hasPermission);
        }

        // Default: permission-based (admin roles)
        return allMenuItems
            .filter(hasPermission)
            // Hindari menu overlap antar role
            .filter((item) => {
                if (item.path === '/data-grup' && userRole === 'fasilitator') return false;
                if (item.path === '/kelola-dampingan' && userRole?.includes('admin')) return false;
                if (item.path === '/kelola-dampingan' && userRole === 'pj_grup') return false;
                if (item.path === '/konfirmasi-anggota' && userRole !== 'fasilitator') return false;
                if (item.path === '/kelola-anggota' && userRole !== 'pj_grup') return false;
                if (item.path === '/informasi-dampingan' && userRole !== 'pj_grup') return false;
                return true;
            });
    })();

    return (
        <aside className={`w-64 h-screen bg-white border-r border-black/10 flex flex-col fixed left-0 top-0 z-50 font-['Poppins'] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            {/* Logo Section */}
            <div className="h-20 px-6 border-b border-black/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <img src="/images/logo-mpm.png" alt="MPM" className="w-9 h-11 object-contain" />
                    <div className="flex flex-col">
                        <span className="text-[#1E1E1E] text-base font-bold tracking-tight">MPM</span>
                        <span className="text-[#9298B0] text-sm font-normal">Muhammadiyah</span>
                    </div>
                </div>
                <button 
                    className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
                    onClick={() => setIsOpen(false)}
                >
                    <X size={20} />
                </button>
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
