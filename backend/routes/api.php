<?php

use App\Http\Controllers\Api\Authentikasi\AuthController;
use App\Http\Controllers\Api\Bidang\BidangController;
use App\Http\Controllers\Api\User\UserController;
use App\Http\Controllers\Api\FasilitatorBidang\FasilitatorBidangController;
use App\Http\Controllers\Api\GrupDampingan\GrupDampinganController;
use App\Http\Controllers\Api\GrupDampingan\GrupFasilitatorController;
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
    Route::post('/anggota', function () {

    })->middleware('permission:ajukan_anggota');
});
