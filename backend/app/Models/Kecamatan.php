<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kecamatan extends Model
{
    protected $primaryKey = 'kode';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'kecamatans';
    public $timestamps = false;

    protected $fillable = ['kode', 'name', 'kode_kab'];

    // Relasi ke Kabupaten
    public function kabupaten()
    {
        return $this->belongsTo(Kabupaten::class, 'kode_kab', 'kode');
    }

    // Relasi ke Users
    public function users()
    {
        return $this->hasMany(User::class, 'kode_kec', 'kode');
    }

    // Relasi ke GrupDampingan
    public function grupDampingans()
    {
        return $this->hasMany(GrupDampingan::class, 'kode_kec', 'kode');
    }

    // Relasi ke Kegiatan
    public function kegiatans()
    {
        return $this->hasMany(Kegiatan::class, 'kode_kec', 'kode');
    }

    // Relasi ke LogAktivitas
    public function logAktivitas()
    {
        return $this->hasMany(LogAktivitas::class, 'kode_kec', 'kode');
    }
}
