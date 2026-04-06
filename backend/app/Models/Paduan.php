<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id_paduan', 'judul', 'file', 'role_target'])]
class Paduan extends Model
{
    protected $primaryKey = 'id_paduan';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = ['id_paduan', 'judul', 'file', 'role_target', 'created_at'];

    // Relasi ke Role
    public function roleTarget()
    {
        return $this->belongsTo(Role::class, 'role_target', 'id_role');
    }
}
