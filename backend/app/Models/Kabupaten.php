<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kabupaten extends Model
{
    protected $primaryKey = 'kode';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'kabupatens';
    public $timestamps = false;

    protected $fillable = ['kode', 'name', 'kode_prov'];

    // Relasi ke Provinsi
    public function provinsi()
    {
        return $this->belongsTo(Provinsi::class, 'kode_prov', 'kode');
    }

    // Relasi ke Kecamatan
    public function kecamatans()
    {
        return $this->hasMany(Kecamatan::class, 'kode_kab', 'kode');
    }

    // Relasi ke Users
    public function users()
    {
        return $this->hasMany(User::class, 'kode_kab', 'kode');
    }

    // Relasi ke GrupDampingan
    public function grupDampingans()
    {
        return $this->hasMany(GrupDampingan::class, 'kode_kab', 'kode');
    }

    // Relasi ke Kegiatan
    public function kegiatans()
    {
        return $this->hasMany(Kegiatan::class, 'kode_kab', 'kode');
    }

    // Relasi ke LogAktivitas
    public function logAktivitas()
    {
        return $this->hasMany(LogAktivitas::class, 'kode_kab', 'kode');
    }
}
