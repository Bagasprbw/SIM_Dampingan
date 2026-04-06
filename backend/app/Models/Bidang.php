<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id_bidang', 'name'])]
class Bidang extends Model
{
    protected $primaryKey = 'id_bidang';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    // Relasi ke FasilitatorBidang
    public function fasilitatorBidangs()
    {
        return $this->hasMany(FasilitatorBidang::class, 'bidang_id', 'id_bidang');
    }

    // Relasi ke GrupDampingan
    public function grupDampingans()
    {
        return $this->hasMany(GrupDampingan::class, 'bidang_id', 'id_bidang');
    }

    // Relasi ke AnggotaGrupDampingan
    public function anggotaGrupDampingans()
    {
        return $this->hasMany(AnggotaGrupDampingan::class, 'bidang_id', 'id_bidang');
    }

    // Relasi ke Kegiatan
    public function kegiatans()
    {
        return $this->hasMany(Kegiatan::class, 'bidang_id', 'id_bidang');
    }
}
