import React from 'react';
import AppLayout from '../components/AppLayout';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { ROLE_LABELS } from '../constants/roles';
import { Users, Activity, MapPin, TrendingUp } from 'lucide-react';

const statCards = [
    {
        label: 'Total Anggota',
        value: '—',
        icon: Users,
        color: 'bg-blue-500',
        light: 'bg-blue-50',
        text: 'text-blue-600',
    },
    {
        label: 'Total Kegiatan',
        value: '—',
        icon: Activity,
        color: 'bg-emerald-500',
        light: 'bg-emerald-50',
        text: 'text-emerald-600',
    },
    {
        label: 'Wilayah Aktif',
        value: '—',
        icon: MapPin,
        color: 'bg-violet-500',
        light: 'bg-violet-50',
        text: 'text-violet-600',
    },
    {
        label: 'Pertumbuhan',
        value: '—',
        icon: TrendingUp,
        color: 'bg-amber-500',
        light: 'bg-amber-50',
        text: 'text-amber-600',
    },
];

const DashboardPage = () => {
    const { user } = useCurrentUser();
    const roleLabel = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : '—';

    return (
        <AppLayout title="Dashboard">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1e3a5f] to-[#2d6aa0] text-white p-6 mb-6 shadow-lg">
                {/* decorative circles */}
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
                <div className="absolute -bottom-10 -right-4 w-56 h-56 rounded-full bg-white/5" />

                <div className="relative z-10">
                    <p className="text-blue-200 text-sm font-medium mb-1">
                        Selamat datang kembali 👋
                    </p>
                    <h2 className="text-2xl font-bold mb-1">{user?.name ?? 'User'}</h2>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        {roleLabel}
                    </span>
                </div>

                <div className="relative z-10 mt-4 text-blue-200 text-sm">
                    Sistem Informasi Mentora — Majelis Pemberdayaan Masyarakat
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
                {statCards.map(({ label, value, icon: Icon, color, light, text }) => (
                    <div
                        key={label}
                        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
                    >
                        <div className={`${light} p-3 rounded-xl`}>
                            <Icon className={`${text}`} size={22} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">{label}</p>
                            <p className="text-2xl font-bold text-gray-800">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder content area */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[260px]">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <TrendingUp className="text-blue-400" size={30} />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Konten Segera Hadir
                </h3>
                <p className="text-sm text-gray-400 max-w-sm">
                    Halaman dashboard sedang dalam pengembangan. Data dan grafik
                    akan ditampilkan di sini.
                </p>
            </div>
        </AppLayout>
    );
};

export default DashboardPage;
