<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id_fasilitator_bidang', 'user_id', 'bidang_id'])]
class FasilitatorBidang extends Model
{
    protected $primaryKey = 'id_fasilitator_bidang';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = ['id_fasilitator_bidang', 'user_id', 'bidang_id', 'created_at'];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id_user');
    }

    // Relasi ke Bidang
    public function bidang()
    {
        return $this->belongsTo(Bidang::class, 'bidang_id', 'id_bidang');
    }
}
