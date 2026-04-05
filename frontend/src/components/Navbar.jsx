import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useLogout } from '../hooks/useLogout';
import { ROLE_LABELS } from '../constants/roles';

const Navbar = ({ title = 'Dashboard' }) => {
    const { user } = useCurrentUser();
    const { logout } = useLogout();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const roleLabel = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : '—';

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
            {/* Page title */}
            <h1 className="text-lg font-semibold text-gray-700">{title}</h1>

            <div className="flex items-center gap-4">
                {/* Notification bell */}
                <button className="relative w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                </button>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        id="navbar-user-menu"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center font-bold text-sm uppercase shrink-0">
                            {user?.name?.[0] ?? 'U'}
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-sm font-semibold text-gray-800 leading-tight">
                                {user?.name ?? 'User'}
                            </p>
                            <p className="text-xs text-blue-600 font-medium leading-tight">
                                {roleLabel}
                            </p>
                        </div>
                        <ChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform duration-200 ${
                                dropdownOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </button>

                    {/* Dropdown menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                            {/* User info header */}
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-800">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    @{user?.username}
                                </p>
                                <span className="inline-block mt-1.5 px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-semibold rounded-full">
                                    {roleLabel}
                                </span>
                            </div>

                            {/* Profile option */}
                            <button
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                onClick={() => setDropdownOpen(false)}
                            >
                                <UserCircle size={16} className="text-gray-400" />
                                Profil Saya
                            </button>

                            {/* Logout */}
                            <button
                                id="btn-logout"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    logout();
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={16} />
                                Keluar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
