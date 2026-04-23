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
        { icon: <Grid2X2 size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Users size={20} />, label: 'Data Admin', path: '/data-admin' },
        { icon: <UserCheck size={20} />, label: 'Data Fasilitator', path: '/data-fasilitator' },
        { icon: <UserCog size={20} />, label: 'Data Pj Dampingan', path: '/data-pj' },
        { icon: <UsersRound size={20} />, label: 'Data Grup Dampingan', path: '/data-grup' },
        { icon: <ClipboardList size={20} />, label: 'Data Dampingan', path: '/data-dampingan' },
        { icon: <Settings2 size={20} />, label: 'Kegiatan Dampingan', path: '/kegiatan' },
        { icon: <Settings2 size={20} />, label: 'Kelola Kegiatan', path: '/kelola-kegiatan' },
        { icon: <ShieldCheck size={20} />, label: 'Kelola Hak Akses', path: '/hak-akses' },
        { icon: <Map size={20} />, label: 'Peta Sebaran', path: '/peta' },
        { icon: <History size={20} />, label: 'Log Aktifitas', path: '/log' },
        { icon: <BookOpen size={20} />, label: 'Panduan Penggunaan', path: '/panduan' },
    ];

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-black/10 flex flex-col fixed left-0 top-0 z-50 font-['Poppins']">
            {/* Logo Section */}
            <div className="h-28 px-7 border-b border-black/10 flex items-center gap-4">
                <img src="/images/logo-mpm.png" alt="MPM" className="w-10 h-12 object-contain" />
                <div className="flex flex-col">
                    <span className="text-[#1E1E1E] text-base font-bold tracking-tight">MPM</span>
                    <span className="text-[#9298B0] text-sm font-normal">Muhammadiyah</span>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1 custom-scrollbar">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200
                            ${isActive 
                                ? 'bg-[#0080C5] text-white' 
                                : 'text-[#9298B0] hover:bg-gray-50 hover:text-[#0080C5]'}
                        `}
                    >
                        <span>{item.icon}</span>
                        <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout Section */}
            <div className="p-3 mt-auto">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-[#EF4444] hover:bg-red-50 transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="text-base font-semibold tracking-tight">Keluar</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
