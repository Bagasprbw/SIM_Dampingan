export const ROLES = {
    SUPERADMIN: 'superadmin',
    ADMIN_PROVINSI: 'admin_provinsi',
    ADMIN_KABUPATEN: 'admin_kabupaten',
    ADMIN_KECAMATAN: 'admin_kecamatan',
    FASILITATOR: 'fasilitator',
    PJ_DAMPINGAN: 'pj_grup', // Mengikuti data seeder dari backend
};

// Pengelompokan untuk mempermudah pengecekan hak akses route
export const ADMIN_ROLES = [
    ROLES.ADMIN_PROVINSI, 
    ROLES.ADMIN_KABUPATEN, 
    ROLES.ADMIN_KECAMATAN
];

export const ROLE_LABELS = {
    [ROLES.SUPERADMIN]: 'Super Admin',
    [ROLES.ADMIN_PROVINSI]: 'Admin Provinsi',
    [ROLES.ADMIN_KABUPATEN]: 'Admin Kabupaten',
    [ROLES.ADMIN_KECAMATAN]: 'Admin Kecamatan',
    [ROLES.FASILITATOR]: 'Fasilitator',
    [ROLES.PJ_DAMPINGAN]: 'PJ Dampingan',
};
