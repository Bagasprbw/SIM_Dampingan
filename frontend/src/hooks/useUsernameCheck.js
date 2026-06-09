import { useState, useEffect, useRef } from 'react';
import { userService } from '../services/userService';

export const useUsernameCheck = (username, excludeId = null, enabled = true) => {
    const [status, setStatus] = useState('idle');
    const timerRef = useRef(null);

    useEffect(() => {
        if (!enabled || !username || String(username).trim().length < 3) {
            setStatus('idle');
            return;
        }

        setStatus('checking');
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(async () => {
            try {
                const res = await userService.checkUsername(username.trim(), excludeId);
                setStatus(res?.available ? 'available' : 'taken');
            } catch {
                setStatus('idle');
            }
        }, 500);

        return () => clearTimeout(timerRef.current);
    }, [username, excludeId, enabled]);

    return status;
};
