export const getApiBaseUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    // URL relatif (/api) → same origin, tanpa host
    if (apiUrl.startsWith('/')) return '';
    return apiUrl.replace(/\/api\/?$/, '');
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
