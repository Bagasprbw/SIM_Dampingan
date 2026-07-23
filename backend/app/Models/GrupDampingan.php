<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id_grup_dampingan', 'name', 'pengurus_id', 'level_dampingan', 'kode_prov', 'kode_kab', 'kode_kec'])]
class GrupDampingan extends Model
{
    protected $primaryKey = 'id_grup_dampingan';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = ['id_grup_dampingan', 'name', 'pengurus_id', 'level_dampingan', 'kode_prov', 'kode_kab', 'kode_kec', 'created_at'];

    // Relasi ke Bidang (Many-to-Many)
    public function bidangs()
    {
        return $this->belongsToMany(Bidang::class, 'grup_dampingan_bidang', 'grup_dampingan_id', 'bidang_id');
    }

    // Relasi ke User (sebagai pengurus)
    public function pengurus()
    {
        return $this->belongsTo(User::class, 'pengurus_id', 'id_user');
    }

    // Relasi ke Provinsi
    public function provinsi()
    {
        return $this->belongsTo(Provinsi::class, 'kode_prov', 'kode');
    }

    // Relasi ke Kabupaten
    public function kabupaten()
    {
        return $this->belongsTo(Kabupaten::class, 'kode_kab', 'kode');
    }

    // Relasi ke Kecamatan
    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kode_kec', 'kode');
    }

    // Relasi ke GrupFasilitator
    public function grupFasilitators()
    {
        return $this->hasMany(GrupFasilitator::class, 'grup_dampingan_id', 'id_grup_dampingan');
    }

    // Relasi ke AnggotaGrupDampingan
    public function anggotaGrupDampingans()
    {
        return $this->hasMany(AnggotaGrupDampingan::class, 'grup_id', 'id_grup_dampingan');
    }

    // Relasi ke KegiatanGrup
    public function kegiatanGrups()
    {
        return $this->hasMany(KegiatanGrup::class, 'grup_dampingan_id', 'id_grup_dampingan');
    }
}
