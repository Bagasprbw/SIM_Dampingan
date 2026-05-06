<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sertifikat extends Model
{
    protected $primaryKey = 'id_sertifikat';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id_sertifikat',
        'peserta_id',
        'nomor_sertifikat',
        'diterbitkan_at',
    ];

    // Relasi ke PesertaKegiatan
    public function pesertaKegiatan()
    {
        return $this->belongsTo(PesertaKegiatan::class, 'peserta_id', 'id_peserta_kegiatan');
    }
}
