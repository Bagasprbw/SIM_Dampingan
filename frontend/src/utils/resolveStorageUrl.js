export const getApiBaseUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    // URL relatif (/api) → same origin, tanpa host
    if (apiUrl.startsWith('/')) return '';
    return apiUrl.replace(/\/api\/?$/, '');
};

/**
 * Normalisasi URL absolut dari backend menjadi URL yang bisa diakses browser.
 * Backend menggunakan APP_URL (bisa berupa IP internal / hostname container)
 * untuk menghasilkan url() di Laravel. Kita strip origin-nya dan biarkan
 * nginx/proxy yang meng-handle routing via relative path.
 *
 * Contoh:
 *   http://10.0.0.2/api/public/sertifikat-template/file
 *   → /api/public/sertifikat-template/file
 */
export const normalizeFetchUrl = (url) => {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        // Kalau origin sama dengan window.location, kembalikan path saja
        // Kalau origin beda (IP backend internal), tetap strip dan pakai path
        return parsed.pathname + parsed.search;
    } catch {
        // Bukan URL absolut, kembalikan apa adanya
        return url;
    }
};

/** Ubah path relatif /storage/... dari backend menjadi URL yang bisa di-fetch browser. */
export const resolveStorageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;

    const base = getApiBaseUrl();
    if (path.startsWith('/')) {
        return base ? `${base}${path}` : path;
    }
    return base ? `${base}/storage/${path}` : `/storage/${path}`;
};
