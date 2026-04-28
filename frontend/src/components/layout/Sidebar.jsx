import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useLogout } from '../../hooks/useLogin';
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
    LogOut 
} from 'lucide-react';

const Sidebar = () => {
    const { logout } = useLogout();

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

    const menuItems = [
        { icon: <Grid2X2 size={18} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Users size={18} />, label: 'Data Admin', path: '/data-admin' },
        { icon: <UserCheck size={18} />, label: 'Data Fasilitator', path: '/data-fasilitator' },
        { icon: <UserCog size={18} />, label: 'Data Pj Dampingan', path: '/data-pj' },
        { icon: <UsersRound size={18} />, label: 'Data Grup Dampingan', path: '/data-grup' },
        { icon: <ClipboardList size={18} />, label: 'Data Dampingan', path: '/data-dampingan' },
        { icon: <ClipboardList size={18} />, label: 'Kegiatan Dampingan', path: '/kegiatan-dampingan' },
        { icon: <Settings2 size={18} />, label: 'Kelola Kegiatan', path: '/kelola-kegiatan' },
        { icon: <ShieldCheck size={18} />, label: 'Kelola Hak Akses', path: '/hak-akses' },
        { icon: <Map size={18} />, label: 'Peta Sebaran', path: '/peta' },
        { icon: <History size={18} />, label: 'Log Aktifitas', path: '/log' },
        { icon: <BookOpen size={18} />, label: 'Panduan Penggunaan', path: '/panduan' },
    ];

    return (
        <aside className="w-64 h-screen bg-white border-r border-black/10 flex flex-col fixed left-0 top-0 z-50 font-['Poppins']">
            {/* Logo Section */}
            <div className="h-20 px-6 border-b border-black/10 flex items-center gap-3">
                <img src="/images/logo-mpm.png" alt="MPM" className="w-9 h-11 object-contain" />
                <div className="flex flex-col">
                    <span className="text-[#1E1E1E] text-base font-bold tracking-tight">MPM</span>
                    <span className="text-[#9298B0] text-sm font-normal">Muhammadiyah</span>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-3 py-3 overflow-hidden space-y-0.5">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200
                            ${isActive 
                                ? 'bg-[#0080C5] text-white' 
                                : 'text-[#9298B0] hover:bg-gray-50 hover:text-[#0080C5]'}
                        `}
                    >
                        <span>{item.icon}</span>
                        <span className="text-[13px] font-semibold tracking-tight">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout Section */}
            <div className="p-3 mt-auto border-t border-black/5">
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
