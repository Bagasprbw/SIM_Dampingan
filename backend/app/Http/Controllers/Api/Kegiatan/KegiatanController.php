<?php

namespace App\Http\Controllers\Api\Kegiatan;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use App\Models\KegiatanGrup;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class KegiatanController extends Controller
{
    public function index()
    {
        $kegiatans = Kegiatan::with(['level', 'bidang', 'fasilitator', 'kegiatanGrups.grupDampingan'])->get();
        return response()->json([
            'message' => 'Data kegiatan berhasil diambil',
            'data' => $kegiatans
        ]);
    }

    public function show($id)
    {
        $kegiatan = Kegiatan::with(['level', 'bidang', 'fasilitator', 'kegiatanGrups.grupDampingan'])->find($id);
        if (!$kegiatan) {
            return response()->json(['message' => 'Kegiatan tidak ditemukan'], 404);
        }
        return response()->json([
            'message' => 'Data kegiatan berhasil diambil',
            'data' => $kegiatan
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:200',
            'deskripsi' => 'nullable|string',
            'masalah' => 'nullable|string',
            'solusi' => 'nullable|string',
            'tanggal' => 'nullable|date',
            'waktu' => 'nullable|date_format:H:i',
            'lokasi' => 'nullable|string',
            'fasilitator_id' => 'required|exists:users,id_user',
            'level_id' => 'required|exists:level_kegiatans,id_level',
            'bidang_id' => 'required|exists:bidangs,id_bidang',
            'kode_prov' => 'nullable|string',
            'kode_kab' => 'nullable|string',
            'kode_kec' => 'nullable|string',
            'status' => 'nullable|in:draft,published,selesai',
            'jumlah_hadir' => 'nullable|integer',
            'jumlah_tdk_hadir' => 'nullable|integer',
            'laporan' => 'nullable|string|max:255',
            'grup_dampingan_ids' => 'nullable|array',
            'grup_dampingan_ids.*' => 'exists:grup_dampingans,id_grup_dampingan'
        ]);

        DB::beginTransaction();
        try {
            $id_kegiatan = (string) Str::uuid();
            $status = $request->status ?? 'draft'; // Status otomatis draft tapi bisa milih

            $kegiatan = Kegiatan::create([
                'id_kegiatan' => $id_kegiatan,
                'judul' => $request->judul,
                'deskripsi' => $request->deskripsi,
                'masalah' => $request->masalah,
                'solusi' => $request->solusi,
                'tanggal' => $request->tanggal,
                'waktu' => $request->waktu,
                'lokasi' => $request->lokasi,
                'fasilitator_id' => $request->fasilitator_id,
                'level_id' => $request->level_id,
                'bidang_id' => $request->bidang_id,
                'kode_prov' => $request->kode_prov,
                'kode_kab' => $request->kode_kab,
                'kode_kec' => $request->kode_kec,
                'status' => $status,
                'jumlah_hadir' => $request->jumlah_hadir,
                'jumlah_tdk_hadir' => $request->jumlah_tdk_hadir,
                'laporan' => $request->laporan,
                'created_at' => now(),
            ]);

            // Menyimpan banyak grup dampingan (relasi M-M)
            if ($request->has('grup_dampingan_ids') && is_array($request->grup_dampingan_ids)) {
                $grup_ids = array_unique($request->grup_dampingan_ids);
                foreach ($grup_ids as $grupId) {
                    KegiatanGrup::create([
                        'id_kegiatan_grup' => (string) Str::uuid(),
                        'kegiatan_id' => $id_kegiatan,
                        'grup_dampingan_id' => $grupId
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Kegiatan berhasil dibuat',
                'data' => $kegiatan->load('kegiatanGrups')
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal membuat kegiatan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $kegiatan = Kegiatan::find($id);

        if (!$kegiatan) {
            return response()->json(['message' => 'Kegiatan tidak ditemukan'], 404);
        }

        $request->validate([
            'judul' => 'sometimes|required|string|max:200',
            'deskripsi' => 'nullable|string',
            'masalah' => 'nullable|string',
            'solusi' => 'nullable|string',
            'tanggal' => 'nullable|date',
            'waktu' => 'nullable|date_format:H:i:s,H:i',
            'lokasi' => 'nullable|string',
            'fasilitator_id' => 'sometimes|required|exists:users,id_user',
            'level_id' => 'sometimes|required|exists:level_kegiatans,id_level',
            'bidang_id' => 'sometimes|required|exists:bidangs,id_bidang',
            'kode_prov' => 'nullable|string',
            'kode_kab' => 'nullable|string',
            'kode_kec' => 'nullable|string',
            'status' => 'nullable|in:draft,published,selesai',
            'jumlah_hadir' => 'nullable|integer',
            'jumlah_tdk_hadir' => 'nullable|integer',
            'laporan' => 'nullable|string|max:255',
            'grup_dampingan_ids' => 'nullable|array',
            'grup_dampingan_ids.*' => 'exists:grup_dampingans,id_grup_dampingan'
        ]);

        DB::beginTransaction();
        try {
            $dataToUpdate = $request->except(['grup_dampingan_ids']);
            if ($request->has('status') && empty($request->status)) {
                $dataToUpdate['status'] = 'draft';
            }
            
            $kegiatan->update($dataToUpdate);

            if ($request->has('grup_dampingan_ids') && is_array($request->grup_dampingan_ids)) {
                $kegiatan->kegiatanGrups()->delete(); // Hapus yang lama
                
                $grup_ids = array_unique($request->grup_dampingan_ids);
                foreach ($grup_ids as $grupId) {
                    KegiatanGrup::create([
                        'id_kegiatan_grup' => (string) Str::uuid(),
                        'kegiatan_id' => $kegiatan->id_kegiatan,
                        'grup_dampingan_id' => $grupId
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Kegiatan berhasil diupdate',
                'data' => $kegiatan->load('kegiatanGrups')
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal mengupdate kegiatan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $kegiatan = Kegiatan::find($id);

        if (!$kegiatan) {
            return response()->json(['message' => 'Kegiatan tidak ditemukan'], 404);
        }

        $kegiatan->delete();

        return response()->json([
            'message' => 'Kegiatan berhasil dihapus'
        ]);
    }
}
