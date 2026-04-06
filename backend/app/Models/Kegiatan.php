<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id_kegiatan', 'judul', 'deskripsi', 'masalah', 'solusi', 'tanggal', 'waktu', 'lokasi', 'fasilitator_id', 'level_id', 'bidang_id', 'kode_prov', 'kode_kab', 'kode_kec', 'status', 'jumlah_hadir', 'jumlah_tdk_hadir', 'laporan'])]
class Kegiatan extends Model
{
    protected $primaryKey = 'id_kegiatan';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = ['id_kegiatan', 'judul', 'deskripsi', 'masalah', 'solusi', 'tanggal', 'waktu', 'lokasi', 'fasilitator_id', 'level_id', 'bidang_id', 'kode_prov', 'kode_kab', 'kode_kec', 'status', 'jumlah_hadir', 'jumlah_tdk_hadir', 'laporan', 'created_at'];

    protected $casts = [
        'tanggal' => 'date',
    ];

    // Relasi ke User (sebagai fasilitator)
    public function fasilitator()
    {
        return $this->belongsTo(User::class, 'fasilitator_id', 'id_user');
    }

    // Relasi ke LevelKegiatan
    public function level()
    {
        return $this->belongsTo(LevelKegiatan::class, 'level_id', 'id_level');
    }

    // Relasi ke Bidang
    public function bidang()
    {
        return $this->belongsTo(Bidang::class, 'bidang_id', 'id_bidang');
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

    // Relasi ke PesertaKegiatan
    public function pesertaKegiatans()
    {
        return $this->hasMany(PesertaKegiatan::class, 'kegiatan_id', 'id_kegiatan');
    }

    // Relasi ke KegiatanGrup
    public function kegiatanGrups()
    {
        return $this->hasMany(KegiatanGrup::class, 'kegiatan_id', 'id_kegiatan');
    }

    // Relasi ke FotoAbsensi
    public function fotoAbsensis()
    {
        return $this->hasMany(FotoAbsensi::class, 'kegiatan_id', 'id_kegiatan');
    }

    // Relasi ke FotoKegiatan
    public function fotoKegiatans()
    {
        return $this->hasMany(FotoKegiatan::class, 'kegiatan_id', 'id_kegiatan');
    }
}
