<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id_level', 'nama_level'])]
class LevelKegiatan extends Model
{
    protected $primaryKey = 'id_level';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'level_kegiatans';
    public $timestamps = false;

    // Relasi ke Kegiatan
    public function kegiatans()
    {
        return $this->hasMany(Kegiatan::class, 'level_id', 'id_level');
    }
}
