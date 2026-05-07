import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Loader2 } from 'lucide-react';

/**
 * FilterDropdown - Komponen dropdown filter reusable
 * @param {string} placeholder - Label saat tidak ada pilihan
 * @param {Array} options - Array of { value, label }
 * @param {string|null} value - Nilai yang dipilih
 * @param {Function} onChange - Callback saat pilihan berubah (value)
 * @param {boolean} isLoading - Tampilkan spinner saat loading
 * @param {boolean} disabled - Nonaktifkan dropdown
 */
const FilterDropdown = ({ placeholder = 'Pilih...', options = [], value, onChange, isLoading = false, disabled = false }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const selected = options.find(o => o.value === value);

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = (opt) => {
        onChange(opt.value === value ? null : opt.value); // toggle: klik yang sama = reset
        setOpen(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange(null);
    };

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => !disabled && !isLoading && setOpen(!open)}
                disabled={disabled || isLoading}
                className={`flex items-center justify-between gap-2 px-4 py-3 bg-white rounded-[10px] border ${
                    open ? 'border-[#0080C5]' : 'border-[#E5E7EB]'
                } hover:border-slate-300 transition-colors w-full text-left disabled:opacity-60 disabled:cursor-not-allowed min-w-[160px]`}
            >
                <span className={`text-[11px] font-semibold truncate ${selected ? 'text-[#0A0F1E]' : 'text-[#9298B0]'}`}>
                    {isLoading ? 'Memuat...' : (selected?.label || placeholder)}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                    {selected && !isLoading && (
                        <span
                            onClick={handleClear}
                            className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer text-xs leading-none"
                        >✕</span>
                    )}
                    {isLoading
                        ? <Loader2 size={14} className="animate-spin text-[#9298B0]" />
                        : <ChevronDown size={14} className={`text-[#9298B0] transition-transform ${open ? 'rotate-180' : ''}`} />
                    }
                </div>
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl border border-[#E5E7EB] shadow-lg z-50 min-w-full max-h-56 overflow-y-auto">
                    {options.length === 0 ? (
                        <div className="px-4 py-3 text-[11px] text-slate-400 text-center">Tidak ada data</div>
                    ) : (
                        options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleSelect(opt)}
                                className="flex items-center justify-between w-full px-4 py-2.5 text-left text-[11px] font-medium hover:bg-sky-50 transition-colors"
                            >
                                <span className={value === opt.value ? 'text-[#0080C5] font-semibold' : 'text-[#0A0F1E]'}>
                                    {opt.label}
                                </span>
                                {value === opt.value && <Check size={12} className="text-[#0080C5]" />}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
