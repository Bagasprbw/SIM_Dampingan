import React, { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import ProfileModal from '../modals/ProfileModal';
import { getUser } from '../../utils/storage';
import { ROLE_LABELS } from '../../constants/roles';

const Navbar = ({ title = 'Dashboard', onMenuClick }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const user = getUser();

    let userRole = typeof user?.role === 'object' && user?.role !== null ? user.role.name : user?.role;
    
    // Fallback darurat
    if (!userRole && user?.username === 'superadmin') {
        userRole = 'superadmin';
    }

    return (
        <header className="h-16 bg-white border-b border-black/5 flex items-center justify-between px-4 lg:px-8 fixed top-0 left-0 lg:left-64 right-0 z-30 font-['Poppins']">
            {/* Title Section */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <button 
                    className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg shrink-0"
                    onClick={onMenuClick}
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-[#0A0F1E] text-[16px] md:text-lg lg:text-xl font-bold tracking-tight truncate">
                    {title}
                </h1>
            </div>

            {/* Profile Section */}
            <div 
                className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 px-2 py-1 rounded-xl transition-colors"
                onClick={() => setIsProfileOpen(true)}
            >
                <div className="flex flex-col items-end">
                    <span className="text-[#0A0F1E] text-sm font-semibold tracking-tight">{user?.username || user?.name || 'User'}</span>
                    <span className="text-[#9298B0] text-[10px] font-normal uppercase tracking-wider">{ROLE_LABELS[userRole] || userRole || 'Guest'}</span>
                </div>
                <div className="relative">
                    <img 
                        src={user?.foto || "/images/superadmin.png"} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-xl border border-[#0080C5] object-cover bg-gray-50"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                        <ChevronDown size={10} className="text-[#9298B0]" />
                    </div>
                </div>
            </div>

            {/* Profile Modal */}
            <ProfileModal 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
            />
        </header>
    );
};

export default Navbar;
