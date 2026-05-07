import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useLogout } from '../../hooks/useLogin';
import { getUser } from '../../utils/storage';
import { ROUTE_ACCESS } from '../../constants/routes';
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
    const userRole = user?.role;

    const handleLogout = () => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Anda akan keluar dari sistem!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0080C5',
            cancelButtonColor: '#EF4444',
            confirmButtonText: 'Ya, Keluar!',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-2xl font-["Poppins"]',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
            }
        });
    };

    const allMenuItems = [
        // Semua role
        { icon: <Grid2X2 size={18} />, label: 'Dashboard', path: '/dashboard', permission: 'view_dashboard' },

        // SuperAdmin + Admin
        { icon: <Users size={18} />, label: 'Data Admin', path: '/data-admin', permission: 'kelola_admin_bawahan' },
        { icon: <UserCheck size={18} />, label: 'Data Fasilitator', path: '/data-fasilitator', permission: 'kelola_fasilitator' },
        { icon: <UserCog size={18} />, label: 'Data Pj Dampingan', path: '/data-pj', permission: 'kelola_pj_grup' },
        { icon: <UsersRound size={18} />, label: 'Data Grup Dampingan', path: '/data-grup', permission: 'kelola_grup' },
        { icon: <ClipboardList size={18} />, label: 'Kegiatan Dampingan', path: '/kegiatan-dampingan', permission: 'view_kegiatan' },

        // Fasilitator only
        { icon: <Users size={18} />, label: 'Konfirmasi Anggota', path: '/konfirmasi-anggota', permission: 'verifikasi_anggota' },
        { icon: <LayoutGrid size={18} />, label: 'Kelola Dampingan', path: '/kelola-dampingan', permission: 'kelola_grup' },

        // SuperAdmin + Admin + Fasilitator
        { icon: <Settings2 size={18} />, label: 'Kelola Kegiatan', path: '/kelola-kegiatan', permission: 'create_kegiatan' },

        // SuperAdmin only
        { icon: <ShieldCheck size={18} />, label: 'Kelola Hak Akses', path: '/hak-akses', permission: 'manage_roles' },

        // PJ Dampingan only
        { icon: <Users size={18} />, label: 'Kelola Anggota', path: '/kelola-anggota', permission: 'ajukan_anggota' },
        { icon: <ClipboardList size={18} />, label: 'Informasi Dampingan', path: '/informasi-dampingan', permission: 'view_kegiatan' },

        // Semua role
        { icon: <Map size={18} />, label: 'Peta Sebaran', path: '/peta', permission: 'view_peta_sebaran' },
        { icon: <History size={18} />, label: 'Log Aktifitas', path: '/log' }, // Log biasanya selalu ada jika role diizinkan
        { icon: <BookOpen size={18} />, label: 'Panduan Penggunaan', path: '/panduan', permission: 'view_panduan' },
    ];

    // Aman mengambil string role dari localStorage yang mungkin korup
    let safeUserRole = typeof user?.role === 'object' && user?.role !== null ? user.role.name : userRole;
    
    // Fallback darurat jika role null tapi username adalah superadmin
    if (!safeUserRole && user?.username === 'superadmin') {
        safeUserRole = 'superadmin';
    }

    const menuItems = allMenuItems.filter(item => {
        const role = String(safeUserRole || '').toLowerCase();
        
        // SuperAdmin (11 Halaman)
        if (role === 'superadmin') {
            const superAdminVisible = [
                '/dashboard', '/data-admin', '/data-fasilitator', '/data-pj', 
                '/data-grup', '/kegiatan-dampingan', '/kelola-kegiatan', 
                '/hak-akses', '/peta', '/log', '/panduan'
            ];
            return superAdminVisible.includes(item.path);
        }

        // Admin Provinsi/Kabupaten/Kecamatan (10 Halaman, tanpa Hak Akses)
        if (role.includes('admin')) {
            const adminVisible = [
                '/dashboard', '/data-admin', '/data-fasilitator', '/data-pj', 
                '/data-grup', '/kegiatan-dampingan', '/kelola-kegiatan', 
                '/peta', '/log', '/panduan'
            ];
            return adminVisible.includes(item.path);
        }

        // Fasilitator (7 Halaman)
        if (role === 'fasilitator') {
            const fasilitatorVisible = [
                '/dashboard', '/konfirmasi-anggota', '/kelola-dampingan', 
                '/kelola-kegiatan', '/peta', '/log', '/panduan'
            ];
            return fasilitatorVisible.includes(item.path);
        }

        // PJ Dampingan (6 Halaman)
        if (role === 'pj_grup') {
            const pjVisible = [
                '/dashboard', '/kelola-anggota', '/informasi-dampingan', 
                '/peta', '/log', '/panduan'
            ];
            return pjVisible.includes(item.path);
        }

        // Fallback
        return false;
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
            <nav className="flex-1 px-3 py-2 overflow-hidden flex flex-col gap-1">
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
                        <span className={`shrink-0 transition-colors duration-300`}>
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
                    onClick={handleLogout}
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
