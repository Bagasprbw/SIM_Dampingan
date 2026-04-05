import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Activity,
    MapPin,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Anggota', icon: Users, to: '/anggota' },
    { label: 'Kegiatan', icon: Activity, to: '/kegiatan' },
    { label: 'Wilayah', icon: MapPin, to: '/wilayah' },
];

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`relative flex flex-col bg-[#1e3a5f] text-white transition-all duration-300 min-h-screen ${
                collapsed ? 'w-20' : 'w-64'
            }`}
        >
            {/* Brand */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-400 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/id/0/07/Logo_Muhammadiyah.svg"
                                alt="Logo"
                                className="w-7 h-7 object-contain filter brightness-0 invert"
                            />
                        </div>
                        <div className="leading-tight">
                            <p className="text-xs font-bold tracking-widest text-blue-300 uppercase">
                                MPM
                            </p>
                            <p className="text-sm font-bold text-white">Mentora</p>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="w-9 h-9 bg-blue-400 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/id/0/07/Logo_Muhammadiyah.svg"
                            alt="Logo"
                            className="w-7 h-7 object-contain filter brightness-0 invert"
                        />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ label, icon: Icon, to }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                                isActive
                                    ? 'bg-white/15 text-white'
                                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        <Icon
                            size={20}
                            className="shrink-0 group-hover:scale-110 transition-transform"
                        />
                        {!collapsed && <span>{label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Version tag */}
            {!collapsed && (
                <div className="px-4 py-3 border-t border-white/10">
                    <p className="text-[11px] text-blue-400 text-center">
                        SIM Dampingan v1.0
                    </p>
                </div>
            )}

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-[#1e3a5f] border border-white/20 flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-lg z-10"
                aria-label="Toggle sidebar"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </aside>
    );
};

export default Sidebar;
