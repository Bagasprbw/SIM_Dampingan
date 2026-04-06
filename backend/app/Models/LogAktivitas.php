<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id_log', 'user_id', 'aksi', 'modul', 'data_id', 'deskripsi', 'data_lama', 'data_baru', 'ip_address', 'user_agent', 'kode_prov', 'kode_kab', 'kode_kec'])]
class LogAktivitas extends Model
{
    protected $primaryKey = 'id_log';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = ['id_log', 'user_id', 'aksi', 'modul', 'data_id', 'deskripsi', 'data_lama', 'data_baru', 'ip_address', 'user_agent', 'kode_prov', 'kode_kab', 'kode_kec', 'created_at'];

    protected $casts = [
        'data_lama' => 'array',
        'data_baru' => 'array',
    ];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id_user');
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
}
