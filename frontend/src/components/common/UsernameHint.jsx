import React from 'react';
import { useUsernameCheck } from '../../hooks/useUsernameCheck';

const UsernameHint = ({ username, excludeId = null }) => {
    const status = useUsernameCheck(username, excludeId);

    if (!username || username.trim().length < 3) return null;

    if (status === 'checking') {
        return <p className="text-[10px] text-slate-400 mt-1">Memeriksa ketersediaan...</p>;
    }
    if (status === 'available') {
        return <p className="text-[10px] text-emerald-600 mt-1 font-medium">✓ Username tersedia</p>;
    }
    if (status === 'taken') {
        return <p className="text-[10px] text-red-500 mt-1 font-medium">✗ Username sudah digunakan</p>;
    }
    return null;
};

export default UsernameHint;
