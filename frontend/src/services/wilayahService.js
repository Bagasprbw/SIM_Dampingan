// Menggunakan ibnux.github.io - mendukung CORS dari localhost
// Format kode: angka (mis. "33" untuk Jawa Tengah)
const WILAYAH_BASE = 'https://ibnux.github.io/data-indonesia';

export const wilayahService = {
    getProvinsi: async () => {
        const res = await fetch(`${WILAYAH_BASE}/provinsi.json`);
        const data = await res.json();
        // Format: [{ id, nama }] → kita map ke { id, name }
        return data.map(p => ({ id: p.id, name: p.nama }));
    },
    getKabupaten: async (idProvinsi) => {
        if (!idProvinsi) return [];
        const res = await fetch(`${WILAYAH_BASE}/kabupaten/${idProvinsi}.json`);
        const data = await res.json();
        return data.map(k => ({ id: k.id, name: k.nama }));
    },
    getKecamatan: async (idKabupaten) => {
        if (!idKabupaten) return [];
        const res = await fetch(`${WILAYAH_BASE}/kecamatan/${idKabupaten}.json`);
        const data = await res.json();
        return data.map(k => ({ id: k.id, name: k.nama }));
    },
};
