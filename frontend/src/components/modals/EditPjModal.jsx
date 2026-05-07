import React, { useState, useEffect } from 'react';
import { X, Edit3, Save, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { usePjGrupMutations } from '../../hooks/mutations/usePjGrupMutation';

const EditPjModal = ({ isOpen, onClose, data }) => {
    const { updatePjGrup } = usePjGrupMutations();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama: '', no_telepon: '', alamat: '', username: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                nama: data.nama || '',
                no_telepon: data.no_telepon || data.no_telp || '',
                alamat: data.alamat || '',
                username: data.username || data.user?.username || ''
            });
        }
    }, [data]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!isOpen) return null;

    const handleSave = () => {
        setIsLoading(true);
        updatePjGrup.mutate({ id: data.id, data: formData }, {
            onSuccess: () => {
                setIsLoading(false);
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Data PJ Dampingan telah diperbarui.',
                    icon: 'success',
                    confirmButtonColor: '#0080C5',
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                });
                onClose();
            },
            onError: () => {
                setIsLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Terjadi kesalahan saat memperbarui PJ Dampingan.',
                    showConfirmButton: false,
                    timer: 2000,
                    customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                });
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-[580px] bg-white rounded-2xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
                
                {/* Header */}
                <div className="h-20 px-6 py-5 border-b-[0.80px] border-gray-200 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-600/10 rounded-full flex justify-center items-center">
                            <Edit3 size={20} className="text-sky-600" />
                        </div>
                        <div className="flex flex-col justify-start items-start">
                            <h3 className="text-neutral-950 text-base font-bold leading-6">Edit Data PJ Dampingan</h3>
                            <p className="text-slate-400 text-xs font-normal leading-4">Perbarui informasi PJ Dampingan</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 p-2 bg-slate-100 rounded-lg flex justify-center items-center hover:bg-slate-200 transition-colors">
                        <X size={16} className="text-slate-400" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-5 space-y-3">
                    {/* First Row: Nama & No. Telepon */}
                    <div className="flex gap-5">
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">Nama Lengkap</label>
                            <input 
                                name="nama"
                                type="text" 
                                value={formData.nama}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-white rounded-[10px] border-[1.60px] border-gray-200 focus:border-sky-600 focus:outline-none text-slate-950 text-xs transition-all"
                                placeholder="Nama Lengkap"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-slate-950 text-xs font-semibold leading-5">No. Telepon</label>
                            <input 
                                name="no_telepon"
                                type="text" 
                                value={formData.no_telepon}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-white rounded-[10px] border-[1.60px] border-gray-200 focus:border-sky-600 focus:outline-none text-slate-950 text-xs transition-all"
                                placeholder="No. Telepon"
                            />
                        </div>
                    </div>

                    {/* Alamat Row */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-950 text-xs font-semibold leading-5">Alamat</label>
                        <textarea 
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white rounded-[10px] border-[1.60px] border-gray-200 focus:border-sky-600 focus:outline-none text-slate-400 text-xs min-h-[100px] resize-none leading-5 transition-all"
                        />
                    </div>

                    {/* Separator */}
                    <div className="w-full h-px bg-slate-100" />

                    {/* Username Row */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-950 text-xs font-semibold leading-5">Username</label>
                        <input 
                            name="username"
                            type="text" 
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-white rounded-[10px] border-[1.60px] border-gray-200 focus:border-sky-600 focus:outline-none text-slate-950 text-xs transition-all"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="h-20 px-6 py-4 border-t-[0.80px] border-gray-200 flex justify-end items-center gap-3 bg-white">
                    <button onClick={onClose} className="w-20 h-10 px-6 bg-white rounded-[10px] border-[0.80px] border-gray-200 text-slate-400 text-xs font-semibold hover:bg-slate-50 transition-all">
                        Batal
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="h-9 px-4 bg-[#0080C5] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-sm text-[13px] font-semibold disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 size={16} className="text-white animate-spin" /> : <Save size={16} className="text-white" />}
                        <span className="text-xs font-semibold">{isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPjModal;
