<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id_peserta_kegiatan', 'kegiatan_id', 'anggota_id', 'nama_peserta', 'jenis_peserta', 'status_hadir'])]
class PesertaKegiatan extends Model
{
    protected $primaryKey = 'id_peserta_kegiatan';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = ['id_peserta_kegiatan', 'kegiatan_id', 'anggota_id', 'nama_peserta', 'jenis_peserta', 'status_hadir', 'created_at'];

    // Relasi ke Kegiatan
    public function kegiatan()
    {
        return $this->belongsTo(Kegiatan::class, 'kegiatan_id', 'id_kegiatan');
    }

    // Relasi ke AnggotaGrupDampingan
    public function anggota()
    {
        return $this->belongsTo(AnggotaGrupDampingan::class, 'anggota_id', 'id_anggota_grup');
    }
}
