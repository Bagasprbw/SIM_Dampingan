<?php

namespace App\Http\Traits;

use App\Services\LogAktivitasService;
use Illuminate\Http\Request;

/**
 * Trait LogsActivity
 *
 * Sediakan helper method untuk mencatat log aktivitas CRUD
 * pada setiap controller yang membutuhkannya.
 *
 * Cara pakai di controller:
 *   use App\Http\Traits\LogsActivity;
 *   class FooController extends Controller {
 *       use LogsActivity;
 *       ...
 *       // Dalam method store:
 *       $this->logCreate($request, 'NamaModul', $model->primaryKey, $model->toArray());
 *   }
 */
trait LogsActivity
{
    /**
     * Log aksi CREATE.
     *
     * @param  Request  $request
     * @param  string   $modul
     * @param  string   $dataId    PK dari record yang baru dibuat
     * @param  array    $dataBaru  Data record baru
     * @param  string|null  $deskripsi
     */
    protected function logCreate(
        Request $request,
        string $modul,
        string $dataId,
        array $dataBaru,
        ?string $deskripsi = null
    ): void {
        LogAktivitasService::log(
            $request,
            aksi: 'CREATE',
            modul: $modul,
            dataId: $dataId,
            deskripsi: $deskripsi ?? "Data baru pada modul {$modul} berhasil ditambahkan.",
            dataLama: null,
            dataBaru: $dataBaru,
        );
    }

    /**
     * Log aksi UPDATE.
     *
     * @param  Request  $request
     * @param  string   $modul
     * @param  string   $dataId    PK dari record yang diubah
     * @param  array    $dataLama  Data sebelum diubah
     * @param  array    $dataBaru  Data sesudah diubah
     * @param  string|null  $deskripsi
     */
    protected function logUpdate(
        Request $request,
        string $modul,
        string $dataId,
        array $dataLama,
        array $dataBaru,
        ?string $deskripsi = null
    ): void {
        LogAktivitasService::log(
            $request,
            aksi: 'UPDATE',
            modul: $modul,
            dataId: $dataId,
            deskripsi: $deskripsi ?? "Data pada modul {$modul} dengan ID {$dataId} berhasil diperbarui.",
            dataLama: $dataLama,
            dataBaru: $dataBaru,
        );
    }

    /**
     * Log aksi DELETE.
     *
     * @param  Request  $request
     * @param  string   $modul
     * @param  string   $dataId    PK dari record yang dihapus
     * @param  array    $dataLama  Data sebelum dihapus
     * @param  string|null  $deskripsi
     */
    protected function logDelete(
        Request $request,
        string $modul,
        string $dataId,
        array $dataLama,
        ?string $deskripsi = null
    ): void {
        LogAktivitasService::log(
            $request,
            aksi: 'DELETE',
            modul: $modul,
            dataId: $dataId,
            deskripsi: $deskripsi ?? "Data pada modul {$modul} dengan ID {$dataId} berhasil dihapus.",
            dataLama: $dataLama,
            dataBaru: null,
        );
    }

    /**
     * Log aksi generik (missal: VERIFIKASI, AJUKAN, dsb.).
     *
     * @param  Request  $request
     * @param  string   $aksi
     * @param  string   $modul
     * @param  string|null  $dataId
     * @param  string|null  $deskripsi
     * @param  array|null   $dataLama
     * @param  array|null   $dataBaru
     */
    protected function logAksi(
        Request $request,
        string $aksi,
        string $modul,
        ?string $dataId = null,
        ?string $deskripsi = null,
        ?array $dataLama = null,
        ?array $dataBaru = null
    ): void {
        LogAktivitasService::log(
            $request,
            aksi: $aksi,
            modul: $modul,
            dataId: $dataId,
            deskripsi: $deskripsi,
            dataLama: $dataLama,
            dataBaru: $dataBaru,
        );
    }
}
