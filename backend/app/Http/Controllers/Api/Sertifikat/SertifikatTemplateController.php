<?php

namespace App\Http\Controllers\Api\Sertifikat;

use App\Http\Controllers\Controller;
use App\Models\SertifikatTemplate;
use App\Services\Sertifikat\SertifikatFillService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SertifikatTemplateController extends Controller
{
    /**
     * GET /sertifikat-template
     * Ambil template aktif (baris terbaru). Bisa diakses siapa saja yang sudah login.
     */
    public function show()
    {
        $template = SertifikatTemplate::latest('created_at')->first();

        if (!$template) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Belum ada template sertifikat yang diupload',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => [
                'id_template'  => $template->id_template,
                'template_url' => url(Storage::url($template->file)),
                'created_by'   => $template->created_by,
                'created_at'   => $template->created_at,
                'updated_at'   => $template->updated_at,
            ],
        ]);
    }

    /**
     * POST /sertifikat-template
     * Upload / ganti template global. Hanya superadmin.
     * Setiap upload akan menambahkan baris baru (versi terbaru = baris dengan created_at terbesar).
     * File lama di storage tetap ada (tidak dihapus otomatis) agar sertifikat yang sudah
     * diterbitkan sebelumnya masih bisa di-render.
     */
    public function upload(Request $request)
    {
        // Pastikan hanya superadmin yang bisa mengakses
        $user = $request->user();
        $user->load('role'); // ← kunci perbaikan
        if (!$user || $user->role?->name !== 'superadmin') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Aksi ini hanya dapat dilakukan oleh superadmin',
            ], 403);
        }

        $request->validate([
            'file' => 'required|file|mimes:pdf|max:10240', // max 10MB
        ]);

        // Simpan file PDF template ke storage
        $uploadedFile = $request->file('file');
        $filename     = 'template_' . now()->format('Ymd_His') . '.pdf';
        $path         = $uploadedFile->storeAs('template-sertifikat', $filename, 'public');

        $now = now();

        $template = SertifikatTemplate::create([
            'id_template' => Str::uuid(),
            'file'        => $path,
            'created_by'  => $user->id_user,
            'created_at'  => $now,
            'updated_at'  => $now,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Template sertifikat berhasil diupload',
            'data'    => [
                'id_template'  => $template->id_template,
                'template_url' => url(Storage::url($template->file)),
                'created_at'   => $template->created_at,
            ],
        ], 201);
    }

    /**
     * GET /sertifikat-template/fields
     * Daftar nama field AcroForm yang didukung (untuk panduan desain template).
     */
    public function fields()
    {
        $primary = [
            'nomor_sertifikat', 'nama_peserta', 'judul_kegiatan', 'tanggal_kegiatan',
            'tempat_kegiatan', 'bidang_dampingan', 'level_kegiatan', 'provinsi',
            'kabupaten_kota', 'kecamatan', 'tanggal_terbit',
        ];

        $aliases = array_values(array_diff(SertifikatFillService::FIELD_NAMES, $primary));

        return response()->json([
            'status' => 'success',
            'data'   => [
                'fields'  => $primary,
                'aliases' => $aliases,
            ],
        ]);
    }

    /**
     * GET /sertifikat-template/riwayat
     * Daftar semua versi template (hanya superadmin).
     */
    public function riwayat(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->role?->name !== 'superadmin') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Aksi ini hanya dapat dilakukan oleh superadmin',
            ], 403);
        }

        $templates = SertifikatTemplate::with('uploader:id_user,name')
            ->latest('created_at')
            ->get()
            ->map(fn($t) => [
                'id_template'   => $t->id_template,
                'template_url'  => url(Storage::url($t->file)),
                'uploaded_by'   => $t->uploader?->name ?? '-',
                'created_at'    => $t->created_at,
            ]);

        return response()->json([
            'status' => 'success',
            'data'   => $templates,
        ]);
    }
}
