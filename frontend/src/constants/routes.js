import { ROLES, ADMIN_ROLES } from './roles';

// Semua admin (provinsi, kabupaten, kecamatan)
const ALL_ADMINS = [...ADMIN_ROLES];

// SuperAdmin + semua Admin
const SUPERADMIN_AND_ADMINS = [ROLES.SUPERADMIN, ...ADMIN_ROLES];

export const ROUTE_ACCESS = {
    // ── Semua Role ──────────────────────────────────────────────────────────
    '/dashboard':  [ROLES.SUPERADMIN, ...ADMIN_ROLES, ROLES.FASILITATOR, ROLES.PJ_DAMPINGAN],
    '/peta':       [ROLES.SUPERADMIN, ...ADMIN_ROLES, ROLES.FASILITATOR, ROLES.PJ_DAMPINGAN],
    '/log':        [ROLES.SUPERADMIN, ...ADMIN_ROLES, ROLES.FASILITATOR, ROLES.PJ_DAMPINGAN],
    '/panduan':    [ROLES.SUPERADMIN, ...ADMIN_ROLES, ROLES.FASILITATOR, ROLES.PJ_DAMPINGAN],

    // ── SuperAdmin only ──────────────────────────────────────────────────────
    '/hak-akses':  [ROLES.SUPERADMIN],

    // ── SuperAdmin + Admin (10 halaman Admin) ────────────────────────────────
    '/data-admin':       [...SUPERADMIN_AND_ADMINS],
    '/data-fasilitator': [...SUPERADMIN_AND_ADMINS],
    '/data-pj':          [...SUPERADMIN_AND_ADMINS],
    '/data-grup':        [...SUPERADMIN_AND_ADMINS],
    '/kegiatan-dampingan': [...SUPERADMIN_AND_ADMINS],
    '/kelola-kegiatan':    [...SUPERADMIN_AND_ADMINS, ROLES.FASILITATOR],
    '/kelola-kegiatan/tambah': [ROLES.FASILITATOR],
    '/kelola-kegiatan/edit':   [...SUPERADMIN_AND_ADMINS, ROLES.FASILITATOR],

    // ── Fasilitator only ─────────────────────────────────────────────────────
    '/konfirmasi-anggota': [ROLES.FASILITATOR],
    '/kelola-dampingan':   [ROLES.FASILITATOR],

    // ── PJ Dampingan only ────────────────────────────────────────────────────
    '/kelola-anggota':      [ROLES.PJ_DAMPINGAN],
    '/informasi-dampingan': [ROLES.PJ_DAMPINGAN],

    // ── Tidak tampil di sidebar (halaman internal) ───────────────────────────
    '/data-dampingan': [...SUPERADMIN_AND_ADMINS],
};

export const DEFAULT_ROUTE_BY_ROLE = {
    [ROLES.SUPERADMIN]:      '/dashboard',
    [ROLES.ADMIN_PROVINSI]:  '/dashboard',
    [ROLES.ADMIN_KABUPATEN]: '/dashboard',
    [ROLES.ADMIN_KECAMATAN]: '/dashboard',
    [ROLES.FASILITATOR]:     '/dashboard',
    [ROLES.PJ_DAMPINGAN]:    '/dashboard',
};
