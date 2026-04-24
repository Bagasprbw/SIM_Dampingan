import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ProfileModal from '../modals/ProfileModal';

const Navbar = ({ title = 'Dashboard' }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="h-16 bg-white border-b border-black/5 flex items-center justify-between px-8 fixed top-0 left-64 right-0 z-40 font-['Poppins']">
            {/* Title Section */}
            <h1 className="text-[#0A0F1E] text-xl font-bold tracking-tight">
                {title}
            </h1>

            {/* Profile Section */}
            <div 
                className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 px-2 py-1 rounded-xl transition-colors"
                onClick={() => setIsProfileOpen(true)}
            >
                <div className="flex flex-col items-end">
                    <span className="text-[#0A0F1E] text-sm font-semibold tracking-tight">Super Admin</span>
                    <span className="text-[#9298B0] text-[10px] font-normal uppercase tracking-wider">Super Admin</span>
                </div>
                <div className="relative">
                    <img 
                        src="/images/superadmin.png" 
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
