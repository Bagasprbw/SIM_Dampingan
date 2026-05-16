<?php

namespace App\Http\Controllers\Api\Wilayah;

use App\Http\Controllers\Controller;
use App\Models\Provinsi;
use App\Models\Kabupaten;
use App\Models\Kecamatan;
use Illuminate\Http\Request;

class WilayahController extends Controller
{
    public function getProvinsi()
    {
        $provinsi = Provinsi::orderBy('name', 'asc')->get();
        return response()->json([
            'message' => 'Data provinsi berhasil diambil',
            'data' => $provinsi
        ]);
    }

    public function getKabupaten($kodeProv)
    {
        $kabupaten = Kabupaten::where('kode_prov', $kodeProv)
            ->orderBy('name', 'asc')
            ->get();
        return response()->json([
            'message' => 'Data kabupaten berhasil diambil',
            'data' => $kabupaten
        ]);
    }

    public function getKecamatan($kodeKab)
    {
        $kecamatan = Kecamatan::where('kode_kab', $kodeKab)
            ->orderBy('name', 'asc')
            ->get();
        return response()->json([
            'message' => 'Data kecamatan berhasil diambil',
            'data' => $kecamatan
        ]);
    }
}
