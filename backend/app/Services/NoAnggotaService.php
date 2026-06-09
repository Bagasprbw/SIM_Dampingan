<?php

namespace App\Services;

use App\Models\AnggotaGrupDampingan;
use App\Models\GrupDampingan;

class NoAnggotaService
{
    /**
     * Format: {kode_prov 2 digit}{4 digit acak}{DD}{MM}{YY}
     * Contoh: 334521260525
     */
    public function generate(string $grupId): string
    {
        $grup = GrupDampingan::find($grupId);
        $kodeProv = $grup?->kode_prov ? substr($grup->kode_prov, 0, 2) : '00';

        do {
            $number = $kodeProv
                .str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT)
                .now()->format('dmy');
        } while (AnggotaGrupDampingan::where('no_anggota', $number)->exists());

        return $number;
    }

    public function shouldRegenerate(?string $noAnggota): bool
    {
        return empty($noAnggota) || str_starts_with($noAnggota, 'TEMP-');
    }
}
