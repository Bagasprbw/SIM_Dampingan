import React, { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useBidangs } from '../../hooks/queries/useBidangQuery';
import { useBidangMutations } from '../../hooks/mutations/useBidangMutation';

const ManageBidangModal = ({ isOpen, onClose }) => {
    const { data: bidangsData, isLoading: isLoadingBidangs } = useBidangs();
    const bidangs = Array.isArray(bidangsData?.data) ? bidangsData.data
        : Array.isArray(bidangsData) ? bidangsData : [];

    const { createBidang, deleteBidang } = useBidangMutations();
    const [newBidang, setNewBidang] = useState('');

    if (!isOpen) return null;

    const handleCreate = () => {
        if (!newBidang.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Perhatian',
                text: 'Nama bidang tidak boleh kosong.',
                customClass: { popup: 'rounded-2xl font-["Poppins"]' }
            });
            return;
        }

        createBidang.mutate({ name: newBidang.trim() }, {
            onSuccess: () => {
                setNewBidang('');
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Bidang dampingan berhasil ditambahkan.',
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                });
            },
            onError: (err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: err.response?.data?.message || 'Terjadi kesalahan saat menambahkan bidang.',
                    customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                });
            }
        });
    };

    const handleDelete = (id, name) => {
        Swal.fire({
            title: 'Hapus Bidang?',
            text: `Apakah Anda yakin ingin menghapus bidang "${name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#94A3B8',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            customClass: { popup: 'rounded-2xl font-["Poppins"]' }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBidang.mutate(id, {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Terhapus!',
                            text: 'Bidang dampingan berhasil dihapus.',
                            showConfirmButton: false,
                            timer: 1500,
                            customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                        });
                    },
                    onError: (err) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal',
                            text: err.response?.data?.message || 'Terjadi kesalahan saat menghapus bidang.',
                            customClass: { popup: 'rounded-2xl font-["Poppins"]' }
                        });
                    }
                });
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Poppins'] p-4 text-left">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="px-7 pt-6 pb-4 flex items-center justify-between">
                    <h3 className="text-slate-950 text-base font-bold tracking-tight">Kelola Bidang Dampingan</h3>
                    <button onClick={onClose} className="text-violet-600 hover:bg-violet-50 p-2 rounded-lg transition-colors">
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                {/* Input Section */}
                <div className="px-7 py-4 flex items-center gap-3">
                    <div className="flex-1">
                        <input 
                            type="text" 
                            value={newBidang}
                            onChange={(e) => setNewBidang(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            placeholder="Nama bidang baru" 
                            className="w-full px-4 py-3 bg-white rounded-2xl border border-indigo-200 focus:border-[#0080C5] focus:outline-none text-sm text-[#0A0F1E] placeholder:text-gray-400"
                            disabled={createBidang.isPending}
                        />
                    </div>
                    <button 
                        onClick={handleCreate}
                        disabled={createBidang.isPending}
                        className="px-6 py-3 bg-[#0080C5] text-white rounded-2xl text-sm font-semibold flex items-center gap-2 hover:bg-[#006da8] transition-all disabled:opacity-50"
                    >
                        {createBidang.isPending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                        Tambah
                    </button>
                </div>

                <div className="mx-7 h-px bg-slate-100 mt-2"></div>

                {/* Table Header */}
                <div className="mt-2 bg-slate-50 border-b border-slate-100 flex items-center px-7 py-3">
                    <span className="flex-1 text-slate-950 text-xs font-semibold uppercase tracking-wider">Nama Bidang</span>
                    <span className="w-20 text-center text-slate-950 text-xs font-semibold uppercase tracking-wider">Aksi</span>
                </div>

                {/* Bidang List */}
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {isLoadingBidangs ? (
                        <div className="px-7 py-6 text-center text-sm text-slate-500">Memuat data bidang...</div>
                    ) : bidangs.length === 0 ? (
                        <div className="px-7 py-6 text-center text-sm text-slate-500">Belum ada bidang dampingan.</div>
                    ) : (
                        bidangs.map((bidang) => (
                            <div key={bidang.id_bidang} className="px-7 py-2.5 border-b border-slate-100 flex items-center hover:bg-slate-50/50 transition-colors">
                                <span className="flex-1 text-slate-950 text-sm font-normal">{bidang.name}</span>
                                <button 
                                    onClick={() => handleDelete(bidang.id_bidang, bidang.name)}
                                    disabled={deleteBidang.isPending}
                                    className="w-20 text-center text-red-500 text-xs font-semibold hover:underline disabled:opacity-50"
                                >
                                    Hapus
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="px-7 py-4 bg-gray-50 border-t border-slate-100 flex items-center text-left">
                    <p className="text-slate-400 text-xs font-normal">
                        Total <span className="text-slate-950 font-semibold">{bidangs.length}</span> bidang dampingan
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ManageBidangModal;
