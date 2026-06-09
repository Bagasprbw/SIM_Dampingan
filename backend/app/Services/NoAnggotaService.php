<?php

namespace App\Services;

use App\Models\AnggotaGrupDampingan;
use App\Models\GrupDampingan;

class NoAnggotaService
{
    /**
     * Format: {kode_prov 2 digit}{DD}{MM}{YY}{4 digit acak}
     * Contoh: 332605254521
     */
    public function generate(string $grupId): string
    {
        $grup = GrupDampingan::find($grupId);
        $kodeProv = $grup?->kode_prov ? substr($grup->kode_prov, 0, 2) : '00';

        do {
            $number = $kodeProv
                .now()->format('dmy')
                .str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        } while (AnggotaGrupDampingan::where('no_anggota', $number)->exists());

        return $number;
    }

    public function shouldRegenerate(?string $noAnggota): bool
    {
        return empty($noAnggota) || str_starts_with($noAnggota, 'TEMP-');
    }
}
