<?php

namespace App\Services\Sertifikat;

use App\Models\Sertifikat;
use Carbon\Carbon;

class SertifikatFillService
{
    /**
     * Nama field AcroForm yang didukung di template PDF fillable.
     * Alias (nama_kegiatan, lokasi_kegiatan, nama_fasilitator) untuk kompatibilitas template lama.
     */
    public const FIELD_NAMES = [
        'nomor_sertifikat',
        'nama_peserta',
        'judul_kegiatan',
        'tanggal_kegiatan',
        'tempat_kegiatan',
        'bidang_dampingan',
        'level_kegiatan',
        'provinsi',
        'kabupaten_kota',
        'kecamatan',
        'tanggal_terbit',
        'nama_kegiatan',
        'lokasi_kegiatan',
        'nama_fasilitator',
    ];

    public static function buildFields(Sertifikat $sertifikat): array
    {
        $peserta = $sertifikat->pesertaKegiatan;
        $kegiatan = $peserta->kegiatan;
        $anggota = $peserta->anggota;

        $namaPeserta = trim((string) ($peserta->nama_peserta ?? ''));
        if ($namaPeserta === '') {
            $namaPeserta = $anggota?->name ?? '-';
        }

        $judul = $kegiatan->judul ?? '-';
        $lokasi = $kegiatan->lokasi ?? '-';
        $fasilitator = $kegiatan->fasilitator?->name ?? '-';

        return [
            'nomor_sertifikat'  => $sertifikat->nomor_sertifikat,
            'nama_peserta'      => $namaPeserta,
            'judul_kegiatan'    => $judul,
            'tanggal_kegiatan'  => self::formatTanggalIndonesia($kegiatan->tanggal),
            'tempat_kegiatan'   => $lokasi,
            'bidang_dampingan'  => $kegiatan->bidang?->name ?? '-',
            'level_kegiatan'    => $kegiatan->level?->nama_level ?? '-',
            'provinsi'          => $kegiatan->provinsi?->name ?? '-',
            'kabupaten_kota'    => $kegiatan->kabupaten?->name ?? '-',
            'kecamatan'         => $kegiatan->kecamatan?->name ?? '-',
            'tanggal_terbit'    => self::formatTanggalIndonesia($sertifikat->diterbitkan_at),
            // Alias untuk template yang memakai nama field lama
            'nama_kegiatan'     => $judul,
            'lokasi_kegiatan'   => $lokasi,
            'nama_fasilitator'  => $fasilitator,
        ];
    }

    public static function formatTanggalIndonesia(mixed $date): string
    {
        if ($date === null) {
            return '-';
        }

        return Carbon::parse($date)->locale('id')->translatedFormat('j F Y');
    }
}
