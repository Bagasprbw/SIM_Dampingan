<?php

namespace App\Services;

use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LogAktivitasService
{
    /**
     * Catat satu entri log aktivitas.
     *
     * @param  \Illuminate\Http\Request  $request  Request saat ini (untuk IP & user-agent)
     * @param  string  $aksi       Jenis aksi: LOGIN, LOGOUT, CREATE, UPDATE, DELETE, VIEW
     * @param  string  $modul      Nama modul/fitur (misal: AnggotaGrup, Kegiatan, User, ...)
     * @param  string|null  $dataId  Primary key dari data yang diproses (nullable untuk LOGIN/LOGOUT)
     * @param  string|null  $deskripsi  Keterangan tambahan
     * @param  array|null  $dataLama   Snapshot data sebelum diubah (untuk UPDATE/DELETE)
     * @param  array|null  $dataBaru   Snapshot data sesudah diubah (untuk CREATE/UPDATE)
     * @param  \App\Models\User|null  $user  User yang melakukan aksi (default: user dari $request)
     */
    public static function log(
        Request $request,
        string $aksi,
        string $modul,
        ?string $dataId = null,
        ?string $deskripsi = null,
        ?array $dataLama = null,
        ?array $dataBaru = null,
        $user = null
    ): void {
        try {
            $actor = $user ?? $request->user();

            if (!$actor) {
                return;
            }

            LogAktivitas::create([
                'id_log'     => (string) Str::uuid(),
                'user_id'    => $actor->id_user,
                'aksi'       => strtoupper($aksi),
                'modul'      => $modul,
                'data_id'    => $dataId,
                'deskripsi'  => $deskripsi,
                'data_lama'  => $dataLama,
                'data_baru'  => $dataBaru,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'kode_prov'  => $actor->kode_prov ?? null,
                'kode_kab'   => $actor->kode_kab ?? null,
                'kode_kec'   => $actor->kode_kec ?? null,
                'created_at' => now(),
            ]);
        } catch (\Throwable $e) {
            // Jangan sampai kegagalan logging menghentikan request utama
            \Illuminate\Support\Facades\Log::error('LogAktivitasService error: ' . $e->getMessage());
        }
    }
}
