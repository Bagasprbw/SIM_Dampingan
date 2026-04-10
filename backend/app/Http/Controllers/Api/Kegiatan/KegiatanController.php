<?php

namespace App\Http\Controllers\Api\Kegiatan;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use App\Models\KegiatanGrup;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class KegiatanController extends Controller
{
    public function indexKelola()
    {
        $user_id = auth()->user()->id_user; // Ambil ID user yang sedang login

        $kegiatans = Kegiatan::with(['level', 'bidang', 'fasilitator', 'kegiatanGrups.grupDampingan'])
                    ->where('fasilitator_id', $user_id)
                    ->orderBy('created_at', 'desc')
                    ->get();
        return response()->json([
            'message' => 'Semua data kegiatan (termasuk draft) berhasil diambil untuk kelola',
            'data' => $kegiatans
        ]);
    }

    public function showKelola($id)
    {
        $user_id = auth()->user()->id_user;

        $kegiatan = Kegiatan::with(['level', 'bidang', 'fasilitator', 'kegiatanGrups.grupDampingan'])
                        ->where('fasilitator_id', $user_id)
                        ->where('id_kegiatan', $id)
                        ->first();

        if (!$kegiatan) {
            return response()->json(['message' => 'Kegiatan tidak ditemukan atau bukan milik Anda'], 404);
        }

        return response()->json([
            'message' => 'Data detail kegiatan untuk form edit berhasil diambil',
            'data' => $kegiatan
        ]);
    }

    public function index()
    {
        $kegiatans = Kegiatan::with(['level', 'bidang', 'fasilitator', 'kegiatanGrups.grupDampingan'])
                    ->whereIn('status', ['published', 'selesai'])
                    ->orderBy('created_at', 'desc')
                    ->get();
        return response()->json([
            'message' => 'Data kegiatan berhasil diambil',
            'data' => $kegiatans
        ]);
    }

    public function show($id)
    {
        $kegiatan = Kegiatan::with(['level', 'bidang', 'fasilitator', 'kegiatanGrups.grupDampingan'])
                        ->whereIn('status', ['published', 'selesai'])
                        ->where('id_kegiatan', $id)
                        ->first();
        if (!$kegiatan) {
            return response()->json(['message' => 'Kegiatan tidak ditemukan (atau mungkin belum di-publish)'], 404);
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
            'level_id' => 'required|exists:level_kegiatans,id_level',
            'bidang_id' => 'required|exists:bidangs,id_bidang',
            'kode_prov' => 'nullable|string',
            'kode_kab' => 'nullable|string',
            'kode_kec' => 'nullable|string',
            'status' => 'nullable|in:draft,published,selesai',
            'jumlah_hadir' => 'nullable|integer',
            'jumlah_tdk_hadir' => 'nullable|integer',
            'laporan' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'grup_dampingan_ids' => 'nullable|array',
            'grup_dampingan_ids.*' => 'exists:grup_dampingans,id_grup_dampingan'
        ]);

        DB::beginTransaction();
        try {
            $id_kegiatan = (string) Str::uuid();
            $status = $request->status ?? 'draft'; // Status otomatis draft tapi bisa milih

            $laporanPath = null;
            if ($request->hasFile('laporan')) {
                $file = $request->file('laporan');
                // Path akan tersimpan seperti: kegiatan/file_laporan/nama_file_unik.ext
                $laporanPath = $file->store('kegiatan/file_laporan', 'public');
            }

            $kegiatan = Kegiatan::create([
                'id_kegiatan' => $id_kegiatan,
                'judul' => $request->judul,
                'deskripsi' => $request->deskripsi,
                'masalah' => $request->masalah,
                'solusi' => $request->solusi,
                'tanggal' => $request->tanggal,
                'waktu' => $request->waktu,
                'lokasi' => $request->lokasi,
                'fasilitator_id' => auth()->user()->id_user, // Diambil dari user yang login
                'level_id' => $request->level_id,
                'bidang_id' => $request->bidang_id,
                'kode_prov' => $request->kode_prov,
                'kode_kab' => $request->kode_kab,
                'kode_kec' => $request->kode_kec,
                'status' => $status,
                'jumlah_hadir' => $request->jumlah_hadir,
                'jumlah_tdk_hadir' => $request->jumlah_tdk_hadir,
                'laporan' => $laporanPath,
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
            'level_id' => 'sometimes|required|exists:level_kegiatans,id_level',
            'bidang_id' => 'sometimes|required|exists:bidangs,id_bidang',
            'kode_prov' => 'nullable|string',
            'kode_kab' => 'nullable|string',
            'kode_kec' => 'nullable|string',
            'status' => 'nullable|in:draft,published,selesai',
            'jumlah_hadir' => 'nullable|integer',
            'jumlah_tdk_hadir' => 'nullable|integer',
            'laporan' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'grup_dampingan_ids' => 'nullable|array',
            'grup_dampingan_ids.*' => 'exists:grup_dampingans,id_grup_dampingan'
        ]);

        DB::beginTransaction();
        try {
            $dataToUpdate = $request->except(['grup_dampingan_ids', 'laporan']);
            if ($request->has('status') && empty($request->status)) {
                $dataToUpdate['status'] = 'draft';
            }

            // Jika ada upload file baru
            if ($request->hasFile('laporan')) {
                // Hapus file lama jika ada
                if ($kegiatan->laporan && Storage::disk('public')->exists($kegiatan->laporan)) {
                    Storage::disk('public')->delete($kegiatan->laporan);
                }
                // Simpan file baru
                $file = $request->file('laporan');
                $dataToUpdate['laporan'] = $file->store('kegiatan/file_laporan', 'public');
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

        // Hapus file laporan fisik di folder jika ada
        if ($kegiatan->laporan && Storage::disk('public')->exists($kegiatan->laporan)) {
            Storage::disk('public')->delete($kegiatan->laporan);
        }

        $kegiatan->delete();

        return response()->json([
            'message' => 'Kegiatan berhasil dihapus'
        ]);
    }
}
