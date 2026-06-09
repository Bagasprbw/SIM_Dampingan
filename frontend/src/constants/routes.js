import { ROLES, ADMIN_ROLES } from './roles';

// Semua admin (provinsi, kabupaten, kecamatan)
const ALL_ADMINS = [...ADMIN_ROLES];

// SuperAdmin + semua Admin
const SUPERADMIN_AND_ADMINS = [ROLES.SUPERADMIN, ...ADMIN_ROLES];

/**
 * ROUTE_ACCESS — dipertahankan untuk kompatibilitas ke belakang (jika masih ada komponen yang pakai)
 */
export const ROUTE_ACCESS = {
    // ── Semua Role ──────────────────────────────────────────────────────────
    '/dashboard':  [ROLES.SUPERADMIN, ...ADMIN_ROLES, ROLES.FASILITATOR, ROLES.PJ_DAMPINGAN],
    '/peta':       [ROLES.SUPERADMIN, ...ADMIN_ROLES, ROLES.FASILITATOR, ROLES.PJ_DAMPINGAN],
    '/log':        [ROLES.SUPERADMIN, ...ADMIN_ROLES, ROLES.FASILITATOR, ROLES.PJ_DAMPINGAN],
    '/panduan':    [ROLES.SUPERADMIN, ...ADMIN_ROLES, ROLES.FASILITATOR, ROLES.PJ_DAMPINGAN],

    // ── SuperAdmin only ──────────────────────────────────────────────────────
    '/hak-akses':           [ROLES.SUPERADMIN],
    '/template-sertifikat': [ROLES.SUPERADMIN],

    // ── SuperAdmin + Admin (10 halaman Admin) ────────────────────────────────
    '/data-admin':       [...SUPERADMIN_AND_ADMINS],
    '/data-fasilitator': [...SUPERADMIN_AND_ADMINS],
    '/data-pj':          [...SUPERADMIN_AND_ADMINS],
    '/data-grup':        [...SUPERADMIN_AND_ADMINS],
    '/kegiatan-dampingan': [...SUPERADMIN_AND_ADMINS, ROLES.FASILITATOR, ROLES.PJ_DAMPINGAN],
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

/**
 * ROUTE_PERMISSIONS — peta path → permission code (DINAMIS dari DB).
 * null = semua user yang sudah login boleh akses (tidak perlu permission spesifik).
 *
 * RouteGuard akan cek: apakah permissions user (dari localStorage) mengandung
 * permission code yang dipetakan untuk path ini.
 */
export const ROUTE_PERMISSIONS = {
    // Semua user login
    '/dashboard':   null,
    '/peta':        'view_peta_sebaran',
    '/log':         null,

    // Permission spesifik
    '/panduan':              'view_panduan',
    '/hak-akses':            'manage_roles',
    '/template-sertifikat': 'manage_roles',
    '/data-admin':           'kelola_admin_bawahan',
    '/data-fasilitator':     'kelola_fasilitator',
    '/data-pj':              'kelola_pj_grup',
    '/data-grup':            'kelola_grup',
    '/data-dampingan':       'kelola_masyarakat',
    '/kegiatan-dampingan':   'view_kegiatan',

    // Fasilitator
    '/konfirmasi-anggota':   'verifikasi_anggota',
    // Fasilitator mengakses grup yang didampingi (backend /grup-dampingan mengizinkan verifikasi_anggota)
    '/kelola-dampingan':     'verifikasi_anggota',

    // Kelola Kegiatan (lebih spesifik dulu sebelum prefix /kelola-kegiatan)
    '/kelola-kegiatan/tambah': 'create_kegiatan',
    '/kelola-kegiatan/edit':   'edit_kegiatan',
    '/kelola-kegiatan':        ['create_kegiatan', 'edit_kegiatan', 'delete_kegiatan'],

    // PJ Grup
    '/kelola-anggota':       'ajukan_anggota',
    '/informasi-dampingan':  'view_kegiatan',
};

export const DEFAULT_ROUTE_BY_ROLE = {
    [ROLES.SUPERADMIN]:      '/dashboard',
    [ROLES.ADMIN_PROVINSI]:  '/dashboard',
    [ROLES.ADMIN_KABUPATEN]: '/dashboard',
    [ROLES.ADMIN_KECAMATAN]: '/dashboard',
    [ROLES.FASILITATOR]:     '/dashboard',
    [ROLES.PJ_DAMPINGAN]:    '/dashboard',
};
