<?php

namespace App\Http\Controllers\Api\Sertifikat;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use App\Models\PesertaKegiatan;
use App\Models\Sertifikat;
use App\Models\SertifikatTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SertifikatController extends Controller
{
    /**
     * POST /kelola-kegiatan/{id}/sertifikat
     * Fasilitator menerbitkan sertifikat untuk kegiatan yang sudah selesai.
     * Template PDF fillable diambil dari tabel sertifikat_templates (global, dikelola superadmin).
     */
    public function terbitkan(Request $request, $id)
    {
        $kegiatan = Kegiatan::findOrFail($id);

        // Kegiatan harus berstatus published
        if ($kegiatan->status !== 'published') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Sertifikat hanya bisa diterbitkan untuk kegiatan yang sudah published',
            ], 422);
        }

        // Cegah penerbitan ulang jika sudah ada sertifikat
        $sudahDiterbitkan = PesertaKegiatan::where('kegiatan_id', $id)
            ->whereHas('sertifikat')
            ->exists();

        if ($sudahDiterbitkan) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Sertifikat untuk kegiatan ini sudah pernah diterbitkan',
            ], 422);
        }

        // Pastikan template global sudah tersedia
        $template = SertifikatTemplate::latest('created_at')->first();
        if (!$template) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Template sertifikat belum tersedia. Minta superadmin untuk mengupload template terlebih dahulu',
            ], 422);
        }

        // Ambil peserta yang berhak: harus anggota (bukan eksternal) dan hadir
        $pesertaList = PesertaKegiatan::where('kegiatan_id', $id)
            ->where('jenis_peserta', 'anggota')
            ->where('status_hadir', 'hadir')
            ->get();

        if ($pesertaList->isEmpty()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Tidak ada peserta anggota yang hadir pada kegiatan ini',
            ], 422);
        }

        // Generate nomor sertifikat: SERTIF/YYYY/MM/NNNN (urutan reset tiap bulan)
        $tahun     = now()->format('Y');
        $bulan     = now()->format('m');
        $baseCount = Sertifikat::whereYear('diterbitkan_at', $tahun)
                               ->whereMonth('diterbitkan_at', $bulan)
                               ->count();
        $counter = $baseCount + 1;

        $waktuTerbit  = now();
        $jumlahDibuat = 0;

        foreach ($pesertaList as $peserta) {
            Sertifikat::create([
                'id_sertifikat'    => Str::uuid(),
                'peserta_id'       => $peserta->id_peserta_kegiatan,
                'nomor_sertifikat' => 'SERTIF/' . $tahun . '/' . $bulan . '/' . str_pad($counter, 4, '0', STR_PAD_LEFT),
                'diterbitkan_at'   => $waktuTerbit,
            ]);

            $counter++;
            $jumlahDibuat++;
        }

        return response()->json([
            'status'  => 'success',
            'message' => "Sertifikat berhasil diterbitkan untuk {$jumlahDibuat} peserta",
        ]);
    }

    /**
     * GET /anggota-grup/profil/{anggotaId}/sertifikat/{idSertifikat}
     * Public endpoint — anggota ambil data sertifikat untuk dicetak di frontend (pdf-lib).
     * Template URL diambil dari tabel sertifikat_templates (template global terbaru).
     */
    public function show($anggotaId, $idSertifikat)
    {
        $sertifikat = Sertifikat::with([
            'pesertaKegiatan.kegiatan.fasilitator',
            'pesertaKegiatan.anggota',
        ])->find($idSertifikat);

        if (!$sertifikat) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Sertifikat tidak ditemukan',
            ], 404);
        }

        // Pastikan sertifikat ini memang milik anggota yang diminta
        if ($sertifikat->pesertaKegiatan->anggota_id !== $anggotaId) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Sertifikat tidak ditemukan',
            ], 404);
        }

        $kegiatan    = $sertifikat->pesertaKegiatan->kegiatan;
        $anggota     = $sertifikat->pesertaKegiatan->anggota;
        $fasilitator = $kegiatan->fasilitator;

        // Ambil template global terbaru
        $template    = SertifikatTemplate::latest('created_at')->first();
        $templateUrl = $template ? Storage::url($template->file) : null;

        return response()->json([
            'status' => 'success',
            'data'   => [
                'nomor_sertifikat' => $sertifikat->nomor_sertifikat,
                'nama_peserta'     => $anggota->name,
                'nama_kegiatan'    => $kegiatan->judul,
                'tanggal_kegiatan' => $kegiatan->tanggal
                    ? $kegiatan->tanggal->translatedFormat('d F Y')
                    : '-',
                'lokasi_kegiatan'  => $kegiatan->lokasi,
                'nama_fasilitator' => $fasilitator->name,
                // URL template global (dipakai pdf-lib di frontend)
                'template_url'     => $templateUrl,
                'diterbitkan_at'   => $sertifikat->diterbitkan_at,
            ],
        ]);
    }
}
