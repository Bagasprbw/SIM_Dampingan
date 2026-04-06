<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id_pekerjaan', 'name'])]
class Pekerjaan extends Model
{
    protected $primaryKey = 'id_pekerjaan';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    // Relasi ke AnggotaGrupDampingan
    public function anggotaGrupDampingans()
    {
        return $this->hasMany(AnggotaGrupDampingan::class, 'pekerjaan_id', 'id_pekerjaan');
    }
}
