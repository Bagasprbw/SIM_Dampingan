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
        { icon: <Grid2X2 size={17} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Users size={17} />, label: 'Data Admin', path: '/data-admin' },
        { icon: <UserCheck size={17} />, label: 'Data Fasilitator', path: '/data-fasilitator' },
        { icon: <UserCog size={17} />, label: 'Data Pj Dampingan', path: '/data-pj' },
        { icon: <UsersRound size={17} />, label: 'Data Grup Dampingan', path: '/data-grup' },
        { icon: <Users size={17} />, label: 'Konfirmasi Anggota', path: '/konfirmasi-anggota' },
        { icon: <UsersRound size={17} />, label: 'Kelola Dampingan', path: '/kelola-dampingan' },
        { icon: <Users size={17} />, label: 'Kelola Anggota', path: '/kelola-anggota' },
        { icon: <ClipboardList size={17} />, label: 'Data Dampingan', path: '/data-dampingan' },
        { icon: <LayoutGrid size={17} />, label: 'Informasi Dampingan', path: '/informasi-dampingan' },
        { icon: <ClipboardList size={17} />, label: 'Kegiatan Dampingan', path: '/kegiatan-dampingan' },
        { icon: <Settings2 size={17} />, label: 'Kelola Kegiatan', path: '/kelola-kegiatan' },
        { icon: <ShieldCheck size={17} />, label: 'Kelola Hak Akses', path: '/hak-akses' },
        { icon: <Map size={17} />, label: 'Peta Sebaran', path: '/peta' },
        { icon: <History size={17} />, label: 'Log Aktifitas', path: '/log' },
        { icon: <BookOpen size={17} />, label: 'Panduan Penggunaan', path: '/panduan' },
    ];

    const menuItems = allMenuItems.filter(item => {
        const allowedRoles = ROUTE_ACCESS[item.path];
        return allowedRoles && allowedRoles.includes(userRole);
    });

    return (
        <aside className="w-64 h-screen bg-white border-r border-black/10 flex flex-col fixed left-0 top-0 z-50 font-['Poppins']">
            {/* Logo Section */}
            <div className="h-16 px-5 border-b border-black/10 flex items-center gap-3 shrink-0">
                <img src="/images/logo-mpm.png" alt="MPM" className="w-8 h-9 object-contain" />
                <div className="flex flex-col">
                    <span className="text-[#1E1E1E] text-sm font-bold tracking-tight">MPM</span>
                    <span className="text-[#9298B0] text-xs font-normal">Muhammadiyah</span>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-2 py-2 overflow-hidden flex flex-col gap-1">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200
                            ${isActive
                                ? 'bg-[#0080C5] text-white'
                                : 'text-[#9298B0] hover:bg-gray-50 hover:text-[#0080C5]'}`
                        }
                    >
                        <span className="shrink-0">{item.icon}</span>
                        <span className="text-[12.5px] font-semibold tracking-tight truncate">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout Section */}
            <div className="px-2 py-2 shrink-0 border-t border-black/5">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#EF4444] hover:bg-red-50 transition-all duration-200"
                >
                    <LogOut size={17} />
                    <span className="text-[12.5px] font-semibold tracking-tight">Keluar</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
