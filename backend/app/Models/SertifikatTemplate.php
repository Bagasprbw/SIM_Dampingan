<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SertifikatTemplate extends Model
{
    protected $table = 'sertifikat_templates';
    protected $primaryKey = 'id_template';
    public $incrementing = false;
    protected $keyType = 'string';

    // Gunakan created_at & updated_at secara manual (bukan auto Eloquent timestamps)
    public $timestamps = false;

    protected $fillable = [
        'id_template',
        'file',
        'created_by',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relasi ke User (superadmin yang upload)
    public function uploader()
    {
        return $this->belongsTo(User::class, 'created_by', 'id_user');
    }
}
