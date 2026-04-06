<?php

use App\Http\Controllers\Api\Authentikasi\AuthController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // ==================Route khusus semua role yang sudah login ===================
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // ======================= route khusu role tertentu ======================
    // Superadmin route
    Route::middleware('role:superadmin')->prefix('superadmin')->group(function () {

    });

    // Admin route (admin_provinsi, admin_kabupaten, admin_kecamatan)
    Route::middleware('role:admin_provinsi,admin_kabupaten,admin_kecamatan')->prefix('admin')->group(function () {

    });

    // Fasilitator routes
    Route::middleware('role:fasilitator')->prefix('fasilitator')->group(function () {

    });

    // PJ Grup routes
    Route::middleware('role:pj_grup')->prefix('pj-grup')->group(function () {

    });
});
