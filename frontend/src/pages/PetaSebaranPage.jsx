import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { Users, LayoutGrid, MapPin } from 'lucide-react';

const PetaSebaranPage = () => {
    return (
        <AdminLayout title="Peta Sebaran">
            <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
                
                {/* 1. Stat Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Card Total Anggota */}
                    <div className="bg-white rounded-3xl p-7 flex items-center gap-6 border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-[#0080C5]/10 rounded-2xl flex items-center justify-center text-[#0080C5]">
                            <Users size={32} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-slate-400 tracking-tight">Total Anggota</p>
                            <h3 className="text-3xl font-bold text-slate-950">12.000</h3>
                            <p className="text-xs font-medium text-[#0080C5]">Di 34 provinsi Indonesia</p>
                        </div>
                    </div>

                    {/* Card Grup Dampingan */}
                    <div className="bg-white rounded-3xl p-7 flex items-center gap-6 border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-[#00A870]/10 rounded-2xl flex items-center justify-center text-[#00A870]">
                            <LayoutGrid size={32} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-slate-400 tracking-tight">Grup Dampingan</p>
                            <h3 className="text-3xl font-bold text-slate-950">12.000</h3>
                            <p className="text-xs font-medium text-[#00A870]">Aktif Di Seluruh Indonesia</p>
                        </div>
                    </div>
                </div>

                {/* 2. Map Container Card */}
                <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm relative">
                    <div className="mb-10 space-y-1">
                        <h2 className="text-lg font-bold text-slate-950 tracking-tight">Peta Sebaran Anggota</h2>
                        <p className="text-xs font-medium text-[#0080C5]">Distribusi anggota dan grup dampingan per provinsi di Indonesia</p>
                    </div>

                    {/* Map Image Area */}
                    <div className="relative rounded-3xl overflow-hidden bg-sky-50/30">
                        <img 
                            src="/images/map-indonesia.png" 
                            alt="Peta Sebaran Indonesia" 
                            className="w-full h-auto object-cover"
                        />

                        {/* Interactive Pins (Simulated) */}
                        <div className="absolute top-[45%] left-[15%] group cursor-pointer">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-sky-500/30 rounded-full animate-ping"></div>
                                <MapPin size={24} className="text-sky-600 fill-white relative z-10" />
                            </div>
                        </div>

                        <div className="absolute top-[35%] left-[45%] group cursor-pointer">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-sky-500/30 rounded-full animate-ping"></div>
                                <MapPin size={24} className="text-sky-600 fill-white relative z-10" />
                            </div>
                        </div>

                        <div className="absolute top-[60%] left-[38%] group cursor-pointer">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-sky-500/30 rounded-full animate-ping"></div>
                                <MapPin size={24} className="text-sky-600 fill-white relative z-10" />
                            </div>
                        </div>

                        <div className="absolute top-[55%] left-[75%] group cursor-pointer">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-sky-500/30 rounded-full animate-ping"></div>
                                <MapPin size={24} className="text-sky-600 fill-white relative z-10" />
                            </div>
                        </div>
                    </div>

                    {/* Map Footer Note */}
                    <div className="mt-8 text-right">
                        <p className="text-xs font-medium text-[#0080C5]/70 italic tracking-tight">
                            * Arahkan kursor ke area provinsi untuk melihat detail
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default PetaSebaranPage;
