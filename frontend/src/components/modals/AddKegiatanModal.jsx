import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, FileText, Image as ImageIcon, ChevronDown } from 'lucide-react';

const AddKegiatanModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-['Poppins']">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center text-[#0080C5]">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Tambah Kegiatan Dampingan</h3>
                            <p className="text-[11px] text-slate-400 font-medium tracking-tight">Lengkapi formulir untuk mencatat kegiatan baru</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-8 max-h-[75vh] overflow-y-auto text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nama Kegiatan */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Nama Kegiatan</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0080C5] transition-colors">
                                    <FileText size={18} />
                                </div>
                                <input 
                                    type="text"
                                    placeholder="Masukkan nama kegiatan..."
                                    className="w-full h-12 pl-12 pr-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#0080C5]/20 focus:bg-white transition-all text-sm font-medium outline-none"
                                />
                            </div>
                        </div>

                        {/* Tanggal */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Tanggal Kegiatan</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0080C5] transition-colors">
                                    <Calendar size={18} />
                                </div>
                                <input 
                                    type="date"
                                    className="w-full h-12 pl-12 pr-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#0080C5]/20 focus:bg-white transition-all text-sm font-medium outline-none"
                                />
                            </div>
                        </div>

                        {/* Lokasi */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Lokasi</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0080C5] transition-colors">
                                    <MapPin size={18} />
                                </div>
                                <input 
                                    type="text"
                                    placeholder="Nama tempat/dusun..."
                                    className="w-full h-12 pl-12 pr-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#0080C5]/20 focus:bg-white transition-all text-sm font-medium outline-none"
                                />
                            </div>
                        </div>

                        {/* Grup Dampingan */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Grup Dampingan</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0080C5] transition-colors">
                                    <Users size={18} />
                                </div>
                                <select className="w-full h-12 pl-12 pr-10 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#0080C5]/20 focus:bg-white transition-all text-sm font-medium outline-none appearance-none cursor-pointer">
                                    <option value="">Pilih Grup</option>
                                    <option value="1">Grup Sejahtera</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Fasilitator */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Fasilitator</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0080C5] transition-colors">
                                    <Users size={18} />
                                </div>
                                <select className="w-full h-12 pl-12 pr-10 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#0080C5]/20 focus:bg-white transition-all text-sm font-medium outline-none appearance-none cursor-pointer">
                                    <option value="">Pilih Fasilitator</option>
                                    <option value="1">Agil Lensana</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Dokumentasi Placeholder */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Upload Foto Kegiatan</label>
                            <div className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-[#0080C5]/30 transition-all cursor-pointer group">
                                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 group-hover:text-[#0080C5] mb-2 transition-colors">
                                    <Plus size={20} />
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium">Klik untuk upload foto kegiatan (JPG/PNG)</p>
                            </div>
                        </div>

                        {/* Keterangan */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Catatan / Keterangan</label>
                            <textarea 
                                rows="3"
                                placeholder="Tuliskan ringkasan kegiatan..."
                                className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#0080C5]/20 focus:bg-white transition-all text-sm font-medium outline-none resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-8 py-6 bg-slate-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 text-slate-500 text-xs font-bold hover:text-slate-700 transition-colors"
                    >
                        Batal
                    </button>
                    <button className="px-8 py-2.5 bg-[#0080C5] text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-600/20 hover:bg-sky-700 hover:-translate-y-0.5 transition-all active:translate-y-0">
                        Simpan Kegiatan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddKegiatanModal;
