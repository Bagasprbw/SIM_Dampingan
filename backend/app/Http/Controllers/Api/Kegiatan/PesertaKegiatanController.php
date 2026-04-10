<?php

namespace App\Http\Controllers\Api\Kegiatan;

use App\Http\Controllers\Controller;
use App\Models\PesertaKegiatan;
use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PesertaKegiatanController extends Controller
{
    // GET semua peserta dalam satu kegiatan
    public function index($kegiatanId)
    {
        // Pastikan kegiatan ada
        $kegiatan = Kegiatan::find($kegiatanId);
        if (!$kegiatan) {
            return response()->json(['message' => 'Kegiatan tidak ditemukan'], 404);
        }

        $pesertas = PesertaKegiatan::with('anggota')
            ->where('kegiatan_id', $kegiatanId)
            ->get();

        return response()->json([
            'message' => 'Data peserta kegiatan berhasil diambil',
            'data' => $pesertas
        ]);
    }

    // CREATE peserta kegiatan (1 orang)
    public function store(Request $request, $kegiatanId)
    {
        // Validasi kegiatan
        $kegiatan = Kegiatan::find($kegiatanId);
        if (!$kegiatan) {
            return response()->json(['message' => 'Kegiatan tidak ditemukan'], 404);
        }

        $request->validate([
            'jenis_peserta' => 'required|in:anggota,eksternal',
            'anggota_id' => 'required_if:jenis_peserta,anggota|nullable|exists:anggota_grup_dampingans,id_anggota_grup',
            'nama_peserta' => 'required_if:jenis_peserta,eksternal|nullable|string|max:150',
            'status_hadir' => 'nullable|in:hadir,tidak'
        ]);

        // Cek duplicate jika anggota
        if ($request->jenis_peserta == 'anggota' && $request->anggota_id) {
            $exists = PesertaKegiatan::where('kegiatan_id', $kegiatanId)
                        ->where('anggota_id', $request->anggota_id)
                        ->exists();
            if ($exists) {
                return response()->json(['message' => 'Anggota ini sudah terdaftar sebagai peserta kegiatan'], 422);
            }
        }

        $id = (string) Str::uuid();
        $peserta = PesertaKegiatan::create([
            'id_peserta_kegiatan' => $id,
            'kegiatan_id' => $kegiatanId,
            'jenis_peserta' => $request->jenis_peserta,
            'anggota_id' => $request->jenis_peserta === 'anggota' ? $request->anggota_id : null,
            'nama_peserta' => $request->jenis_peserta === 'eksternal' ? $request->nama_peserta : null,
            'status_hadir' => $request->status_hadir ?? 'tidak',
            'created_at' => now()
        ]);

        return response()->json([
            'message' => 'Peserta kegiatan berhasil ditambahkan',
            'data' => $peserta->load('anggota')
        ], 201);
    }

    // UPDATE peserta (biasanya untuk upadate status kehadiran)
    public function update(Request $request, $id)
    {
        $peserta = PesertaKegiatan::find($id);

        if (!$peserta) {
            return response()->json(['message' => 'Peserta tidak ditemukan'], 404);
        }

        $request->validate([
            'jenis_peserta' => 'sometimes|required|in:anggota,eksternal',
            'anggota_id' => 'required_if:jenis_peserta,anggota|nullable|exists:anggota_grup_dampingans,id_anggota_grup',
            'nama_peserta' => 'required_if:jenis_peserta,eksternal|nullable|string|max:150',
            'status_hadir' => 'nullable|in:hadir,tidak'
        ]);

        if ($request->has('jenis_peserta')) {
            $peserta->jenis_peserta = $request->jenis_peserta;
            if ($peserta->jenis_peserta === 'anggota') {
                $peserta->anggota_id = $request->anggota_id;
                $peserta->nama_peserta = null;
            } else {
                $peserta->nama_peserta = $request->nama_peserta;
                $peserta->anggota_id = null;
            }
        }

        if ($request->has('status_hadir')) {
            $peserta->status_hadir = $request->status_hadir;
        }

        $peserta->save();

        return response()->json([
            'message' => 'Peserta kegiatan berhasil diperbarui',
            'data' => $peserta->load('anggota')
        ]);
    }

    // DELETE peserta
    public function destroy($id)
    {
        $peserta = PesertaKegiatan::find($id);

        if (!$peserta) {
            return response()->json(['message' => 'Peserta tidak ditemukan'], 404);
        }

        $peserta->delete();

        return response()->json([
            'message' => 'Peserta kegiatan berhasil dihapus'
        ]);
    }
}
