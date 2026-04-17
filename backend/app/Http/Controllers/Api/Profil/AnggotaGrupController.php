<?php

namespace App\Http\Controllers\Api\Profil;

use App\Http\Controllers\Controller;
use App\Models\AnggotaGrupDampingan;
use Illuminate\Http\Request;

class AnggotaGrupController extends Controller
{
    public function show($id)
    {
        $anggota = AnggotaGrupDampingan::with([
            'bidang',
            'pekerjaan',
            'grupDampingan',
            'pesertaKegiatans.kegiatan.level'
        ])->find($id);

        if (!$anggota) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anggota grup tidak ditemukan',
            ], 404);
        }

        // Only allow active members to be viewed publicly
        if ($anggota->status !== 'aktif') {
            return response()->json([
                'status' => 'error',
                'message' => 'Profil anggota tidak tersedia atau tidak aktif',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Data profil anggota berhasil ditemukan',
            'data' => $anggota
        ]);
    }
}
