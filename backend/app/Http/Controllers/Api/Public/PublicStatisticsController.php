<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\AnggotaGrupDampingan;
use App\Models\GrupDampingan;
use App\Models\Kegiatan;
use Illuminate\Support\Facades\DB;

class PublicStatisticsController extends Controller
{
    /**
     * Get public statistics for landing page
     *
     * Returns:
     * - totalProvinces: jumlah provinsi unik yang memiliki grup dampingan
     * - totalKabupaten: jumlah kabupaten unik yang memiliki grup dampingan
     * - totalKecamatan: jumlah kecamatan unik yang memiliki grup dampingan
     * - totalGrupDampingan: total jumlah grup dampingan
     * - totalAnggota: total jumlah anggota grup dampingan yang aktif
     * - totalKegiatan: total jumlah kegiatan pemberdayaan
     */
    public function index()
    {
        try {
            // Hitung provinsi unik dengan grup dampingan
            $totalProvinces = GrupDampingan::distinct('kode_prov')
                ->whereNotNull('kode_prov')
                ->count('kode_prov');

            // Hitung kabupaten unik dengan grup dampingan
            $totalKabupaten = GrupDampingan::distinct('kode_kab')
                ->whereNotNull('kode_kab')
                ->count('kode_kab');

            // Hitung kecamatan unik dengan grup dampingan
            $totalKecamatan = GrupDampingan::distinct('kode_kec')
                ->whereNotNull('kode_kec')
                ->count('kode_kec');

            // Total grup dampingan
            $totalGrupDampingan = GrupDampingan::count();

            // Total anggota grup dampingan yang aktif
            $totalAnggota = AnggotaGrupDampingan::where('status', 'aktif')
                ->count();

            // Total kegiatan
            $totalKegiatan = Kegiatan::count();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total_provinces' => $totalProvinces,
                    'total_kabupaten' => $totalKabupaten,
                    'total_kecamatan' => $totalKecamatan,
                    'total_wilayah' => $totalProvinces + $totalKabupaten + $totalKecamatan,
                    'total_grup_dampingan' => $totalGrupDampingan,
                    'total_anggota' => $totalAnggota,
                    'total_kegiatan' => $totalKegiatan,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data statistik: ' . $e->getMessage()
            ], 500);
        }
    }
}
