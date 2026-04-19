<?php

use App\Http\Controllers\Api\Authentikasi\AuthController;
use App\Http\Controllers\Api\Bidang\BidangController;
use App\Http\Controllers\Api\User\UserController;
use App\Http\Controllers\Api\FasilitatorBidang\FasilitatorBidangController;
use App\Http\Controllers\Api\GrupDampingan\GrupDampinganController;
use App\Http\Controllers\Api\GrupDampingan\GrupFasilitatorController;
use App\Http\Controllers\Api\GrupDampingan\AnggotaGrupController;
use App\Http\Controllers\Api\GrupDampingan\PengajuanAnggotaController;
use App\Http\Controllers\Api\Kegiatan\KegiatanController;
use App\Http\Controllers\Api\Kegiatan\FotoAbsensiController;
use App\Http\Controllers\Api\Kegiatan\FotoKegiatanController;
use App\Http\Controllers\Api\Kegiatan\PesertaKegiatanController;
use App\Http\Controllers\Api\LogAktivitas\LogAktivitasController;
use App\Http\Controllers\Api\Panduan\PanduanController;
use App\Http\Controllers\Api\RolePermission\RolePermissionController;
use App\Http\Controllers\Api\Profil\ProfilController;
use App\Http\Controllers\Api\Profil\AnggotaGrupController as ProfilAnggotaController;
use Illuminate\Support\Facades\Route;

// publik
Route::post('/login', [AuthController::class, 'login']);
Route::get('/anggota-grup/profil/{id}', [ProfilAnggotaController::class, 'show']);

// auth
Route::middleware('auth:sanctum')->group(function () {
    // =============== Route untuk semua user yang sudah login ===================
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Profil
    Route::prefix('profil')->group(function () {
        Route::get('/', [ProfilController::class, 'show']);
        Route::put('/change-no-telp', [ProfilController::class, 'updateNoTelp']);
        Route::put('/change-password', [ProfilController::class, 'updatePassword']);
    });

    // Bidang
    Route::get('/bidang', [BidangController::class, 'index']);
    Route::post('/bidang', [BidangController::class, 'store'])->middleware('permission:kelola_masyarakat');
    Route::delete('/bidang/{id}', [BidangController::class, 'destroy'])->middleware('permission:kelola_masyarakat');

    // ======================= Route dengan Permission Check ======================

    // ----------- permission: manage_roles untk RBAC -----------------
    Route::prefix('rbac')->middleware('permission:manage_roles')->group(function () {
        Route::get('/permissions', [RolePermissionController::class, 'indexPermissions']); // daftar semua permissions
        Route::get('/roles', [RolePermissionController::class, 'indexRoles']); // daftar semua roles
        Route::put('/roles/{idRole}/permissions', [RolePermissionController::class, 'updateRolePermissions']); // update permissions untuk role tertentu
    });

    // ----------- permission: kelola_grup -----------------
    Route::prefix('grup-dampingan')->middleware('permission:kelola_grup')->group(function () {
        Route::get('/', [GrupDampinganController::class, 'index']);
        Route::post('/', [GrupDampinganController::class, 'store']);
        Route::get('/{id}', [GrupDampinganController::class, 'show']);
        Route::put('/{id}', [GrupDampinganController::class, 'update']);
        Route::delete('/{id}', [GrupDampinganController::class, 'destroy']);

        // Grup Fasilitator(pivot table) - manage fasilitator untuk grup dampingan
        Route::get('/{grupId}/fasilitator', [GrupFasilitatorController::class, 'index']);
        Route::post('/{grupId}/fasilitator', [GrupFasilitatorController::class, 'store']);
        Route::put('/{grupId}/fasilitator', [GrupFasilitatorController::class, 'updateBulk']);
        Route::delete('/{grupId}/fasilitator/{fasilitatorId}', [GrupFasilitatorController::class, 'destroy']);
    });

    // ----------- permission: kelola_fasilitator -----------------
    Route::prefix('users/fasilitator')->middleware('permission:kelola_fasilitator')->group(function () {
        Route::get('/', [UserController::class, 'indexFasilitator']);
        Route::post('/', [UserController::class, 'storeFasilitator']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });
    // untuk manajemen fasilitator bidang, misal: saat ingin menambahkan bidang untuk fasilitator, dll
    Route::prefix('fasilitator-bidang')->middleware('permission:kelola_fasilitator')->group(function () {
        Route::get('/', [FasilitatorBidangController::class, 'index']);
        Route::post('/', [FasilitatorBidangController::class, 'store']);
        Route::delete('/{id}', [FasilitatorBidangController::class, 'destroy']);
        Route::get('/fasilitator/{fasilitatorId}', [FasilitatorBidangController::class, 'getBidangByFasilitator']);
    });

    // ----------- permission: kelola_admin_bawahan -----------------
    Route::prefix('users/admin-bawahan')->middleware('permission:kelola_admin_bawahan')->group(function () {
        Route::get('/', [UserController::class, 'indexAdminBawahan']);
        Route::post('/', [UserController::class, 'storeAdminBawahan']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });

    // ----------- permission: kelola_pj_grup -----------------
    Route::prefix('users/pj-grup')->middleware('permission:kelola_pj_grup')->group(function () {
        Route::get('/', [UserController::class, 'indexPjGrup']);
        Route::post('/', [UserController::class, 'storePjGrup']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });

    // ----------- permission: ajukan_anggota -----------------
    // PJ Grup mengajukan anggota baru → status: pending, menunggu verifikasi
    Route::prefix('anggota-grup')->middleware('permission:ajukan_anggota')->group(function () {
        Route::post('/ajukan', [PengajuanAnggotaController::class, 'storeAjukan']);
        Route::get('/ajukan-saya', [PengajuanAnggotaController::class, 'indexAjukanSaya']);
        Route::put('/ajukan/{id}', [PengajuanAnggotaController::class, 'updateAjukan']);
        Route::delete('/ajukan/{id}', [PengajuanAnggotaController::class, 'destroyAjukan']);
        //melihat anggota yg sudah 'aktif' di grupnya

    });

    // ----------- permission: verifikasi_anggota -----------------
    // Fasilitator mereview dan ACC/tolak pengajuan anggota
    Route::prefix('anggota-grup')->middleware('permission:verifikasi_anggota')->group(function () {
        Route::get('/pending', [PengajuanAnggotaController::class, 'indexPending']);
        Route::patch('/{id}/verifikasi', [PengajuanAnggotaController::class, 'verifikasi']);
    });

    // ----------- permission: kelola_masyarakat -----------------
    // Anggota Grup Dampingan - CRUD langsung dengan status: aktif
    Route::prefix('anggota-grup')->middleware('permission:kelola_masyarakat')->group(function () {
        Route::get('/', [AnggotaGrupController::class, 'index']);
        Route::post('/', [AnggotaGrupController::class, 'store']);
        Route::get('/{id}', [AnggotaGrupController::class, 'show']);
        Route::put('/{id}', [AnggotaGrupController::class, 'update']);
        Route::delete('/{id}', [AnggotaGrupController::class, 'destroy']);
    });

    // ----------- permission: kelola_panduan [RONAL] -----------------
    Route::prefix('kelola-panduan')->middleware('permission:kelola_panduan')->group(function () {
        Route::get('/', [PanduanController::class, 'indexKelola']);
        Route::post('/', [PanduanController::class, 'store']);
        Route::get('/{id}', [PanduanController::class, 'showKelola']);
        Route::put('/{id}', [PanduanController::class, 'update']);
        Route::delete('/{id}', [PanduanController::class, 'destroy']);
    });

    // ----------- permission: view_panduan [Bagas] -----------------
    Route::prefix('view-panduan')->middleware('permission:view_panduan')->group(function () {
        Route::get('/', [PanduanController::class, 'indexView']);
        Route::get('/{id}', [PanduanController::class, 'showView']);
    });

    // ----------- permission: create_kegiatan, edit_kegiatan, delete_kegiatan -----------------
    Route::prefix('kelola-kegiatan')->middleware('permission:create_kegiatan,edit_kegiatan,delete_kegiatan')->group(function () {
        //CRUD kegiatan [BAGAS]
        Route::get('/', [KegiatanController::class, 'indexKelola']);
        Route::get('/{id}', [KegiatanController::class, 'showKelola']);
        Route::post('/', [KegiatanController::class, 'store']);
        Route::put('/{id}', [KegiatanController::class, 'update']);
        Route::delete('/{id}', [KegiatanController::class, 'destroy']);

        //CRUD foto_absensi, foto_kegiatan [RONAL]
        Route::get('/{kegiatanId}/foto-kegiatan', [FotoKegiatanController::class, 'index']);
        Route::post('/{kegiatanId}/foto-kegiatan', [FotoKegiatanController::class, 'store']);
        Route::delete('/{kegiatanId}/foto-kegiatan/{idFoto}', [FotoKegiatanController::class, 'destroy']);

        Route::get('/{kegiatanId}/foto-absensi', [FotoAbsensiController::class, 'index']);
        Route::post('/{kegiatanId}/foto-absensi', [FotoAbsensiController::class, 'store']);
        Route::delete('/{kegiatanId}/foto-absensi/{idFotoAbsensi}', [FotoAbsensiController::class, 'destroy']);

        //peserta kegiatan [BAGAS]
        Route::get('/{kegiatanId}/peserta', [PesertaKegiatanController::class, 'index']);
        Route::post('/{kegiatanId}/peserta', [PesertaKegiatanController::class, 'store']);
        Route::put('/peserta/{id_peserta}', [PesertaKegiatanController::class, 'update']);
        Route::delete('/peserta/{id_peserta}', [PesertaKegiatanController::class, 'destroy']);

    });

    // ----------- permission: view_kegiatan [Bagas] -----------------
    Route::prefix('kegiatan')->middleware('permission:view_kegiatan')->group(function () {
        Route::get('/', [KegiatanController::class, 'index']);
        Route::get('/{id}', [KegiatanController::class, 'show']);
    });

    // ----------- log aktivitas -----------------
    Route::prefix('log-aktivitas')->group(function () {
        Route::get('/', [LogAktivitasController::class, 'index']);
        Route::get('/{id}', [LogAktivitasController::class, 'show']);
    });
});
