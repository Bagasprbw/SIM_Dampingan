import React from 'react';
import { X, Phone, MapPin, User, Users, UserX, UserCheck } from 'lucide-react';
import { getUser } from '../../utils/storage';

const PjDetailModal = ({ isOpen, onClose, data, onToggleStatus }) => {
    if (!isOpen) return null;

    const getImageUrl = (path) => {
        if (!path) return null;
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        const baseUrl = apiUrl.replace('/api', '');
        return `${baseUrl}/storage/${path}`;
    };

    const getInitials = (name) => {
        if (!name) return 'AS';
        return name
            .split(' ')
            .filter(Boolean)
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const initials = getInitials(data?.name || data?.nama);

    const currentUser = getUser();
    const roleName = typeof currentUser?.role === 'object' ? currentUser?.role?.name : currentUser?.role;
    const isSuper = roleName === 'superadmin' || currentUser?.username === 'superadmin';

    const isActive = data?.status === 'active';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4 text-left">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-[0px_20px_60px_0px_rgba(0,0,0,0.18)] overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="w-full h-[5px] bg-white" />
                
                {/* Profile Header */}
                <div className="p-5 border-b-[0.80px] border-slate-100 flex items-start gap-4 text-left">
                    <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-700 to-sky-500 rounded-full flex justify-center items-center text-white text-base font-bold overflow-hidden">
                            {data?.foto ? (
                                <img src={getImageUrl(data.foto)} alt="" className="w-full h-full object-cover" />
                            ) : (
                                initials
                            )}
                        </div>
                        <div className={`w-3.5 h-3.5 absolute bottom-0 right-0 rounded-full border-[2.40px] border-white ${isActive ? 'bg-green-500' : 'bg-red-500'}`} title={isActive ? 'Status: Aktif' : 'Status: Nonaktif'} />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-0.5 text-left flex-1">
                        <h3 className="text-slate-950 text-base font-bold leading-6">{data?.name || data?.nama || "-"}</h3>
                        <p className="text-slate-400 text-xs font-normal leading-5">@{data?.username || "-"}</p>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="px-2.5 py-0.5 bg-sky-600/10 rounded-full flex justify-start items-center">
                                <span className="text-sky-600 text-[10px] font-bold leading-4">PJ Dampingan</span>
                            </div>
                            <div className={`inline-flex px-2.5 py-0.5 rounded-full ${isActive ? 'bg-green-100' : 'bg-red-100'}`}>
                                <span className={`text-[10px] font-bold ${isActive ? 'text-green-700' : 'text-red-700'}`}>
                                    {isActive ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Rows */}
                <div className="flex flex-col">
                    <div className="px-6 py-4 border-b-[0.80px] border-slate-100 flex items-center gap-4">
                        <div className="w-9 h-9 bg-sky-600/5 rounded-[10px] flex justify-center items-center">
                            <Phone size={16} className="text-sky-600" />
                        </div>
                        <div className="flex-1 flex justify-between items-center text-left">
                            <span className="text-slate-950 text-sm font-bold leading-5">Nomor Telepon</span>
                            <span className="text-[#00A3A3] text-sm font-medium leading-5">{data?.no_telp || "-"}</span>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-b-[0.80px] border-slate-100 flex items-center gap-4 text-left">
                        <div className="w-9 h-9 bg-sky-600/5 rounded-[10px] flex justify-center items-center">
                            <MapPin size={16} className="text-sky-600" />
                        </div>
                        <div className="flex-1 flex justify-between items-center text-left">
                            <span className="text-slate-950 text-sm font-bold leading-5 text-left">Wilayah</span>
                            <span className="text-gray-600 text-sm font-normal leading-5 text-right">
                                {[data?.kecamatan?.name, data?.kabupaten?.name, data?.provinsi?.name].filter(Boolean).join(', ') || '-'}
                            </span>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-b-[0.80px] border-slate-100 flex items-center gap-4 text-left">
                        <div className="w-9 h-9 bg-sky-600/5 rounded-[10px] flex justify-center items-center">
                            <User size={16} className="text-sky-600" />
                        </div>
                        <div className="flex-1 flex justify-between items-center text-left">
                            <span className="text-slate-950 text-sm font-bold leading-5 text-left">Fasilitator</span>
                            <span className="text-slate-950 text-sm font-medium leading-5 text-right">
                                {data?.grup_dampingans_pengurus?.[0]?.grup_fasilitators?.[0]?.fasilitator?.name || "-"}
                            </span>
                        </div>
                    </div>

                    <div className="px-6 py-4 flex items-center gap-4 text-left">
                        <div className="w-9 h-9 bg-sky-600/5 rounded-[10px] flex justify-center items-center">
                            <Users size={16} className="text-sky-600" />
                        </div>
                        <div className="flex-1 flex justify-between items-center text-left">
                            <span className="text-slate-950 text-sm font-bold leading-5 text-left">Grup Dampingan</span>
                            <div className="flex flex-wrap gap-2 justify-end">
                                {data?.grup_dampingans_pengurus?.length > 0 ? (
                                    data.grup_dampingans_pengurus.map((g, idx) => (
                                        <span key={idx} className="px-2.5 py-1 bg-sky-600/10 rounded-full text-sky-600 text-xs font-semibold leading-4">
                                            {g.name}
                                        </span>
                                    ))
                                ) : "-"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-between bg-white items-center">
                    <div>
                        {isSuper && onToggleStatus && (
                            <button 
                                onClick={() => onToggleStatus(data)}
                                className={`px-4 py-2 rounded-[10px] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                                    isActive 
                                        ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200' 
                                        : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                                }`}
                            >
                                {isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                                <span>{isActive ? 'Nonaktifkan' : 'Aktifkan'}</span>
                            </button>
                        )}
                    </div>
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-100 text-slate-500 rounded-[10px] text-sm font-semibold hover:bg-slate-200 transition-all"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PjDetailModal;
