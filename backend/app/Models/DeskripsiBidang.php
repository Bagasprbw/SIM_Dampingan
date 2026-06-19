<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id_deskripsi_bidang', 'id_bidang', 'deskripsi', 'created_at', 'updated_at'])]
class DeskripsiBidang extends Model
{
    protected $table = 'deskripsi_bidangs';
    protected $primaryKey = 'id_deskripsi_bidang';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_deskripsi_bidang',
        'id_bidang',
        'deskripsi',
    ];

    /**
     * Relationship to Bidang
     */
    public function bidang()
    {
        return $this->belongsTo(Bidang::class, 'id_bidang', 'id_bidang');
    }
}
