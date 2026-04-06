<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id_kegiatan_grup', 'kegiatan_id', 'grup_dampingan_id'])]
class KegiatanGrup extends Model
{
    protected $primaryKey = 'id_kegiatan_grup';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = ['id_kegiatan_grup', 'kegiatan_id', 'grup_dampingan_id'];

    // Relasi ke Kegiatan
    public function kegiatan()
    {
        return $this->belongsTo(Kegiatan::class, 'kegiatan_id', 'id_kegiatan');
    }

    // Relasi ke GrupDampingan
    public function grupDampingan()
    {
        return $this->belongsTo(GrupDampingan::class, 'grup_dampingan_id', 'id_grup_dampingan');
    }
}
