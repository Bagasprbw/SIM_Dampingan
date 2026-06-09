<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\AnggotaGrupDampingan;
use App\Models\GrupDampingan;

class PublicPetaSebaranController extends Controller
{
    /**
     * Agregasi sebaran grup & anggota per kabupaten untuk peta landing page.
     * Endpoint publik — tidak memerlukan autentikasi.
     */
    public function index()
    {
        $statsMap = [];

        $grups = GrupDampingan::with('kabupaten')
            ->whereNotNull('kode_kab')
            ->get(['id_grup_dampingan', 'kode_kab']);

        foreach ($grups as $grup) {
            $name = $grup->kabupaten?->name;
            if (! $name) {
                continue;
            }
            if (! isset($statsMap[$name])) {
                $statsMap[$name] = ['name' => $name, 'grup' => 0, 'anggota' => 0];
            }
            $statsMap[$name]['grup']++;
        }

        $anggotaList = AnggotaGrupDampingan::where('status', 'aktif')
            ->whereHas('grupDampingan', fn ($q) => $q->whereNotNull('kode_kab'))
            ->with('grupDampingan.kabupaten')
            ->get(['id_anggota_grup', 'grup_id']);

        foreach ($anggotaList as $anggota) {
            $name = $anggota->grupDampingan?->kabupaten?->name;
            if (! $name) {
                continue;
            }
            if (! isset($statsMap[$name])) {
                $statsMap[$name] = ['name' => $name, 'grup' => 0, 'anggota' => 0];
            }
            $statsMap[$name]['anggota']++;
        }

        return response()->json([
            'status' => 'success',
            'data' => array_values($statsMap),
        ]);
    }
}
