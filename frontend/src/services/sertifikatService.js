import api from './api';

export const sertifikatService = {
    // ---- Template Global (superadmin) ----

    /** GET /sertifikat-template — ambil template aktif (terbaru) */
    getTemplate: async () => {
        const response = await api.get('/sertifikat-template');
        return response.data;
    },

    /** GET /sertifikat-template/riwayat — semua versi template */
    getRiwayatTemplate: async () => {
        const response = await api.get('/sertifikat-template/riwayat');
        return response.data;
    },

    /** POST /sertifikat-template — upload template baru (superadmin) */
    uploadTemplate: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/sertifikat-template', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // ---- Sertifikat Kegiatan ----

    /** POST /kelola-kegiatan/{id}/sertifikat — terbitkan sertifikat */
    terbitkanSertifikat: async (kegiatanId) => {
        const response = await api.post(`/kelola-kegiatan/${kegiatanId}/sertifikat`);
        return response.data;
    },

    /** GET /anggota-grup/profil/{anggotaId}/sertifikat/{idSertifikat} */
    getSertifikatAnggota: async (anggotaId, idSertifikat) => {
        const response = await api.get(
            `/anggota-grup/profil/${anggotaId}/sertifikat/${idSertifikat}`
        );
        return response.data;
    },
};
