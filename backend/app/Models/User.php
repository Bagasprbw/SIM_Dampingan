<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[
    Fillable([
        'id_user',
        'name',
        'username',
        'password',
        'role_id',
        'created_by',
        'no_telp',
        'foto',
        'kode_prov',
        'kode_kab',
        'kode_kec',
        'status',
    ]),
]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'id_user';

    public $incrementing = false;

    protected $keyType = 'string';

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    // Relasi ke Role
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'id_role');
    }

    // Check apakah user punya role tertentu
    public function hasRole($roleName)
    {
        return $this->role && $this->role->name === $roleName;
    }

    // Check apakah user punya permission tertentu
    public function hasPermission($permissionCode)
    {
        if (! $this->role) {
            return false;
        }

        return $this->role
            ->permissions()
            ->where('permissions.code', $permissionCode)
            ->exists();
    }
}
