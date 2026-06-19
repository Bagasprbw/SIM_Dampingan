<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id_halaman_utama', 'judul_website', 'deskripsi_website', 'hero_image', 'tentang', 'filosofi', 'created_at', 'updated_at'])]
class HalamanUtama extends Model
{
    protected $table = 'halaman_utamas';
    protected $primaryKey = 'id_halaman_utama';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_halaman_utama',
        'judul_website',
        'deskripsi_website',
        'hero_image',
        'tentang',
        'filosofi',
    ];
}
