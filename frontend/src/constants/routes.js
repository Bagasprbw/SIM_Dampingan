import { ROLES, ADMIN_ROLES } from './roles';

const SUPERADMIN_AND_ADMINS = [ROLES.SUPERADMIN, ...ADMIN_ROLES];

export const ROUTE_ACCESS = {
    '/dashboard': [ROLES.SUPERADMIN, ...ADMIN_ROLES, ROLES.FASILITATOR, ROLES.PJ_DAMPINGAN],
    '/data-admin': [...SUPERADMIN_AND_ADMINS],
    '/data-fasilitator': [...SUPERADMIN_AND_ADMINS],
    '/data-pj': [...SUPERADMIN_AND_ADMINS],
    '/data-grup': [...SUPERADMIN_AND_ADMINS],
    '/kegiatan-dampingan': [...SUPERADMIN_AND_ADMINS],
    '/kelola-kegiatan': [...SUPERADMIN_AND_ADMINS, ROLES.FASILITATOR],
    '/kelola-kegiatan/edit': [...SUPERADMIN_AND_ADMINS, ROLES.FASILITATOR],
    '/hak-akses': [ROLES.SUPERADMIN],
    '/peta': [ROLES.SUPERADMIN, ...ADMIN_ROLES, ROLES.FASILITATOR, ROLES.PJ_DAMPINGAN],
    '/log': [ROLES.SUPERADMIN, ...ADMIN_ROLES, ROLES.FASILITATOR, ROLES.PJ_DAMPINGAN],
    '/panduan': [ROLES.SUPERADMIN, ...ADMIN_ROLES, ROLES.FASILITATOR, ROLES.PJ_DAMPINGAN],
    
    // Rute tambahan
    '/data-dampingan': [ROLES.SUPERADMIN, ...ADMIN_ROLES, ROLES.FASILITATOR, ROLES.PJ_DAMPINGAN],
    '/konfirmasi-anggota': [...SUPERADMIN_AND_ADMINS, ROLES.FASILITATOR],
    '/kelola-anggota': [...SUPERADMIN_AND_ADMINS, ROLES.PJ_DAMPINGAN],
};

export const DEFAULT_ROUTE_BY_ROLE = {
    [ROLES.SUPERADMIN]: '/dashboard',
    [ROLES.ADMIN_PROVINSI]: '/dashboard',
    [ROLES.ADMIN_KABUPATEN]: '/dashboard',
    [ROLES.ADMIN_KECAMATAN]: '/dashboard',
    [ROLES.FASILITATOR]: '/dashboard',
    [ROLES.PJ_DAMPINGAN]: '/dashboard',
};
