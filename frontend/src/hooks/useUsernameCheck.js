import { useState, useEffect, useRef } from 'react';
import { userService } from '../services/userService';

export const useUsernameCheck = (username, excludeId = null, enabled = true) => {
    const [status, setStatus] = useState('idle');
    const [lastChecked, setLastChecked] = useState({ username: '', excludeId: null });
    const timerRef = useRef(null);

    const isTooShort = !enabled || !username || String(username).trim().length < 3;

    if (isTooShort && status !== 'idle') {
        setStatus('idle');
    }

    const hasChanged = !isTooShort && (lastChecked.username !== username || lastChecked.excludeId !== excludeId);
    if (hasChanged && status !== 'checking') {
        setStatus('checking');
        setLastChecked({ username, excludeId });
    }

    useEffect(() => {
        if (isTooShort) {
            return;
        }

        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(async () => {
            try {
                const res = await userService.checkUsername(username.trim(), excludeId);
                setStatus(res?.available ? 'available' : 'taken');
            } catch {
                setStatus('idle');
            }
        }, 300);

        return () => clearTimeout(timerRef.current);
    }, [username, excludeId, enabled, isTooShort]);

    return status;
};
