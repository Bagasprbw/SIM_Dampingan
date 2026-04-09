<?php

use App\Http\Controllers\Api\Authentikasi\AuthController;
use App\Http\Controllers\Api\Bidang\BidangController;
use App\Http\Controllers\Api\User\UserController;
use App\Http\Controllers\Api\FasilitatorBidang\FasilitatorBidangController;
use App\Http\Controllers\Api\GrupDampingan\GrupDampinganController;
use App\Http\Controllers\Api\GrupDampingan\GrupFasilitatorController;
use App\Http\Controllers\Api\GrupDampingan\AnggotaGrupController;
use App\Http\Controllers\Api\GrupDampingan\PengajuanAnggotaController;
use Illuminate\Support\Facades\Route;

// publik
Route::post('/login', [AuthController::class, 'login']);

// auth
Route::middleware('auth:sanctum')->group(function () {
    // =============== Route untuk semua user yang sudah login ===================
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Bidang
    Route::get('/bidang', [BidangController::class, 'index']);
    Route::post('/bidang', [BidangController::class, 'store'])->middleware('permission:kelola_masyarakat');
    Route::delete('/bidang/{id}', [BidangController::class, 'destroy'])->middleware('permission:kelola_masyarakat');

    // ======================= Route dengan Permission Check ======================

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
    Route::post('/kelola-panduan', function () {
    // TODO: CRUD panduan [RONAL]
    })->middleware('permission:kelola_panduan');

    // ----------- permission: view_panduan [Bagas] -----------------
    Route::post('/view-panduan', function () {

    })->middleware('permission:view_panduan');

    // ----------- permission: create_kegiatan, edit_kegiatan, delete_kegiatan -----------------
    Route::post('/kelola-kegiatan', function () {
    //CRUD kegiatan [BAGAS]

    //CRUD foto_absensi, foto_kegiatan [RONAL]
    // TODO CRUD foto_absensi, foto_kegiatan [RONAL]
    })->middleware('permission:create_kegiatan,edit_kegiatan,delete_kegiatan');

    // ----------- permission: view_kegiatan [Bagas] -----------------
    Route::post('/kegiatan', function () {

    })->middleware('permission:view_kegiatan');
});
