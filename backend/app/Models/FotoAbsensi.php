<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id_foto_absensi', 'kegiatan_id', 'file'])]
class FotoAbsensi extends Model
{
    protected $primaryKey = 'id_foto_absensi';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = ['id_foto_absensi', 'kegiatan_id', 'file', 'created_at'];

    // Relasi ke Kegiatan
    public function kegiatan()
    {
        return $this->belongsTo(Kegiatan::class, 'kegiatan_id', 'id_kegiatan');
    }
}
