export const getApiBaseUrl = () =>
    (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

/** Ubah path relatif /storage/... dari backend menjadi URL absolut ke server Laravel. */
export const resolveStorageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;

    const base = getApiBaseUrl();
    if (path.startsWith('/')) return `${base}${path}`;
    return `${base}/storage/${path}`;
};
