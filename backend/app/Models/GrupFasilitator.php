<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id_grup_fasilitator', 'grup_dampingan_id', 'fasilitator_id'])]
class GrupFasilitator extends Model
{
    protected $primaryKey = 'id_grup_fasilitator';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = ['id_grup_fasilitator', 'grup_dampingan_id', 'fasilitator_id', 'created_at'];

    // Relasi ke GrupDampingan
    public function grupDampingan()
    {
        return $this->belongsTo(GrupDampingan::class, 'grup_dampingan_id', 'id_grup_dampingan');
    }

    // Relasi ke User (sebagai fasilitator)
    public function fasilitator()
    {
        return $this->belongsTo(User::class, 'fasilitator_id', 'id_user');
    }
}
