<?php

namespace App\Services;

use App\Models\AnggotaGrupDampingan;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QrCodeService
{
    /**
     * Generate QR code for Anggota Grup Dampingan.
     * QR code contains the frontend URL with the anggota ID.
     */
    public function generateForAnggota(AnggotaGrupDampingan $anggota)
    {
        // Don't generate if already has qr_code or status is not aktif
        if ($anggota->qr_code || $anggota->status !== 'aktif') {
            return false;
        }

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        $url = $frontendUrl . '/anggota/' . $anggota->id_anggota_grup;
        
        $fileName = 'profil/anggota_grup/qr-code/' . $anggota->id_anggota_grup . '.svg';
        
        // Ensure directory exists
        if (!Storage::disk('public')->exists('profil/anggota_grup/qr-code')) {
            Storage::disk('public')->makeDirectory('profil/anggota_grup/qr-code');
        }

        // Generate SVG content, size 300px
        $qrCodeContent = QrCode::size(300)->generate($url);
        
        // Store to public disk
        Storage::disk('public')->put($fileName, $qrCodeContent);
        
        // Update model
        $anggota->update(['qr_code' => $fileName]);
        
        return $fileName;
    }
}
