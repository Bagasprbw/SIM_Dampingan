<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id_anggota_grup', 'bidang_id', 'no_anggota', 'name', 'tempat_lahir', 'tgl_lahir', 'jenis_kelamin', 'agama', 'alamat', 'no_telp', 'foto', 'pekerjaan_id', 'grup_id', 'status'])]
class AnggotaGrupDampingan extends Model
{
    protected $primaryKey = 'id_anggota_grup';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = ['id_anggota_grup', 'bidang_id', 'no_anggota', 'name', 'tempat_lahir', 'tgl_lahir', 'jenis_kelamin', 'agama', 'alamat', 'no_telp', 'foto', 'pekerjaan_id', 'grup_id', 'status', 'qr_code', 'created_at'];

    protected $casts = [
        'tgl_lahir' => 'date',
    ];

    // Relasi ke Bidang
    public function bidang()
    {
        return $this->belongsTo(Bidang::class, 'bidang_id', 'id_bidang');
    }

    // Relasi ke Pekerjaan
    public function pekerjaan()
    {
        return $this->belongsTo(Pekerjaan::class, 'pekerjaan_id', 'id_pekerjaan');
    }

    // Relasi ke GrupDampingan
    public function grupDampingan()
    {
        return $this->belongsTo(GrupDampingan::class, 'grup_id', 'id_grup_dampingan');
    }

    // Relasi ke PesertaKegiatan
    public function pesertaKegiatans()
    {
        return $this->hasMany(PesertaKegiatan::class, 'anggota_id', 'id_anggota_grup');
    }
}
