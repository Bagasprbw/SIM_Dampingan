<?php

namespace App\Http\Controllers\Api\Kegiatan;

use App\Http\Controllers\Controller;
use App\Models\LevelKegiatan;

class LevelKegiatanController extends Controller
{
    public function index()
    {
        $levels = LevelKegiatan::orderBy('nama_level', 'asc')->get();

        return response()->json([
            'message' => 'Data level kegiatan berhasil diambil',
            'data' => $levels,
        ]);
    }
}
