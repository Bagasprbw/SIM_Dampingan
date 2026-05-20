<?php

namespace App\Http\Controllers\Api\LogAktivitas;

use App\Http\Controllers\Controller;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;

class LogAktivitasController extends Controller
{
    /**
     * GET /api/log-aktivitas
     *
     * Aturan akses:
     *  - superadmin → semua log (semua user, semua aksi)
     *  - role lain  → hanya log milik dirinya sendiri
     *
     * Query params opsional:
     *  - user_id    : filter berdasarkan user tertentu
     *  - aksi       : LOGIN | LOGOUT | CREATE | UPDATE | DELETE | VIEW | VERIFIKASI
     *  - role       : nama role (hanya superadmin)
     *  - modul      : nama modul
     *  - tanggal_mulai / tanggal_akhir : rentang tanggal (Y-m-d)
     *  - per_page   : jumlah data per halaman (default 15)
     */
    public function index(Request $request)
    {
        $user     = $request->user();
        $isSuperadmin = $user->hasRole('superadmin');

        $query = LogAktivitas::with([
            'user:id_user,name,username,role_id',
            'user.role:id_role,name',
        ])->orderByDesc('created_at');

        if ($isSuperadmin) {
            // ---------- Superadmin: semua log ----------
            if ($request->filled('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->filled('role')) {
                $query->whereHas('user.role', function ($q) use ($request) {
                    $q->where('name', $request->role);
                });
            }

            if ($request->filled('modul')) {
                $query->where('modul', 'like', '%' . $request->modul . '%');
            }

        } else {
            // ---------- Role lain: hanya log milik dirinya sendiri ----------
            $query->where('user_id', $user->id_user);
        }

        if ($request->filled('aksi')) {
            $query->where('aksi', strtoupper($request->aksi));
        }

        if ($request->filled('tanggal_mulai')) {
            $query->whereDate('created_at', '>=', $request->tanggal_mulai);
        }

        if ($request->filled('tanggal_akhir')) {
            $query->whereDate('created_at', '<=', $request->tanggal_akhir);
        }

        $perPage = (int) ($request->per_page ?? 15);
        $logs    = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data'   => $logs,
        ]);
    }

    /**
     * GET /api/log-aktivitas/{id}
     *
     * Aturan akses:
     *  - superadmin → bisa lihat log manapun
     *  - role lain  → hanya bisa lihat log miliknya sendiri
     */
    public function show(Request $request, $id)
    {
        $user         = $request->user();
        $isSuperadmin = $user->hasRole('superadmin');

        $log = LogAktivitas::with([
            'user:id_user,name,username,role_id',
            'user.role:id_role,name',
        ])->find($id);

        if (!$log) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Log aktivitas tidak ditemukan.',
            ], 404);
        }

        // Cek akses untuk non-superadmin
        if (!$isSuperadmin && $log->user_id !== $user->id_user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Akses ditolak. Anda hanya dapat melihat log milik Anda sendiri.',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $log,
        ]);
    }
}
