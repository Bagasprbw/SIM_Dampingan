<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Provinsi extends Model
{
    protected $primaryKey = 'kode';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'provinsis';
    public $timestamps = false;

    protected $fillable = ['kode', 'name'];

    // Relasi ke Kabupaten
    public function kabupatens()
    {
        return $this->hasMany(Kabupaten::class, 'kode_prov', 'kode');
    }

    // Relasi ke Users
    public function users()
    {
        return $this->hasMany(User::class, 'kode_prov', 'kode');
    }

    // Relasi ke GrupDampingan
    public function grupDampingans()
    {
        return $this->hasMany(GrupDampingan::class, 'kode_prov', 'kode');
    }

    // Relasi ke Kegiatan
    public function kegiatans()
    {
        return $this->hasMany(Kegiatan::class, 'kode_prov', 'kode');
    }

    // Relasi ke LogAktivitas
    public function logAktivitas()
    {
        return $this->hasMany(LogAktivitas::class, 'kode_prov', 'kode');
    }
}
