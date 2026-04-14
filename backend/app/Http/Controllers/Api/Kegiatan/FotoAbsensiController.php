<?php

namespace App\Http\Controllers\Api\Kegiatan;

use App\Http\Controllers\Controller;
use App\Models\FotoAbsensi;
use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FotoAbsensiController extends Controller
{
    public function index($kegiatanId)
    {
        $kegiatan = Kegiatan::find($kegiatanId);
        if (! $kegiatan) {
            return response()->json(['message' => 'Kegiatan tidak ditemukan'], 404);
        }

        $fotos = FotoAbsensi::where('kegiatan_id', $kegiatanId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'message' => 'Data foto absensi berhasil diambil',
            'data' => $fotos,
        ]);
    }

    public function store(Request $request, $kegiatanId)
    {
        $kegiatan = Kegiatan::find($kegiatanId);
        if (! $kegiatan) {
            return response()->json(['message' => 'Kegiatan tidak ditemukan'], 404);
        }

        $request->validate([
            'file' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'files' => 'nullable|array|min:1',
            'files.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if (! $request->hasFile('file') && ! $request->hasFile('files')) {
            return response()->json([
                'message' => 'Minimal unggah 1 file foto absensi',
            ], 422);
        }

        $uploadedFiles = [];
        if ($request->hasFile('file')) {
            $uploadedFiles[] = $request->file('file');
        }
        if ($request->hasFile('files')) {
            $uploadedFiles = array_merge($uploadedFiles, $request->file('files'));
        }

        $created = [];
        foreach ($uploadedFiles as $file) {
            $storedPath = $file->store('kegiatan/foto_absensi', 'public');
            $created[] = FotoAbsensi::create([
                'id_foto_absensi' => (string) Str::uuid(),
                'kegiatan_id' => $kegiatanId,
                'file' => $storedPath,
                'created_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Foto absensi berhasil diunggah',
            'data' => $created,
        ], 201);
    }

    public function destroy($kegiatanId, $idFotoAbsensi)
    {
        $foto = FotoAbsensi::where('kegiatan_id', $kegiatanId)
            ->where('id_foto_absensi', $idFotoAbsensi)
            ->first();

        if (! $foto) {
            return response()->json(['message' => 'Foto absensi tidak ditemukan'], 404);
        }

        if ($foto->file && Storage::disk('public')->exists($foto->file)) {
            Storage::disk('public')->delete($foto->file);
        }

        $foto->delete();

        return response()->json([
            'message' => 'Foto absensi berhasil dihapus',
        ]);
    }
}
