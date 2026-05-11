import { useEffect, useRef } from 'react';
import { getToken, getPermissions, savePermissions } from '../utils/storage';
import { authRepository } from '../api/repositories/authRepository';

/**
 * Hook untuk menyinkronkan permissions user dari server secara otomatis.
 *
 * Cara kerja:
 * 1. Saat komponen mount (app dibuka), langsung cek permissions dari /me
 * 2. Setiap kali user kembali fokus ke tab browser, cek ulang permissions
 * 3. Polling setiap INTERVAL_MS milidetik (default: 60 detik)
 *
 * Jika permissions berubah (superadmin update), localStorage diperbarui
 * dan halaman di-reload agar Sidebar + RouteGuard langsung mencerminkan perubahan.
 */
const SYNC_INTERVAL_MS = 60_000; // 60 detik

export const usePermissionSync = () => {
    const lastSyncRef = useRef(0);
    const intervalRef = useRef(null);

    const syncPermissions = async () => {
        // Jangan sync jika user belum login
        if (!getToken()) return;

        try {
            const me = await authRepository.getMe();
            const freshPermissions = me.permissions ?? [];
            const cachedPermissions = getPermissions();

            // Bandingkan dengan stringify untuk deteksi perubahan
            const freshSorted = [...freshPermissions].sort().join(',');
            const cachedSorted = [...cachedPermissions].sort().join(',');

            if (freshSorted !== cachedSorted) {
                // Permissions berubah → update localStorage dan reload
                savePermissions(freshPermissions);
                // Reload ringan: halaman akan re-render dengan permissions baru
                window.location.reload();
            }

            lastSyncRef.current = Date.now();
        } catch {
            // Abaikan error jaringan — jangan paksa logout
        }
    };

    useEffect(() => {
        // Sync saat mount
        syncPermissions();

        // Sync saat user kembali fokus ke tab
        const handleFocus = () => {
            const now = Date.now();
            // Throttle: minimal 10 detik antar sync
            if (now - lastSyncRef.current > 10_000) {
                syncPermissions();
            }
        };

        // Polling berkala
        intervalRef.current = setInterval(syncPermissions, SYNC_INTERVAL_MS);

        window.addEventListener('focus', handleFocus);

        return () => {
            clearInterval(intervalRef.current);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);
};
