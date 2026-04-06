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

    // Relasi ke FasilitatorBidang
    public function fasilitatorBidangs()
    {
        return $this->hasMany(FasilitatorBidang::class, 'user_id', 'id_user');
    }

    // Relasi ke GrupDampingan sebagai pengurus
    public function grupDampingansPengurus()
    {
        return $this->hasMany(GrupDampingan::class, 'pengurus_id', 'id_user');
    }

    // Relasi ke GrupFasilitator
    public function grupFasilitators()
    {
        return $this->hasMany(GrupFasilitator::class, 'fasilitator_id', 'id_user');
    }

    // Relasi ke Kegiatan sebagai fasilitator
    public function kegiatansFasilitator()
    {
        return $this->hasMany(Kegiatan::class, 'fasilitator_id', 'id_user');
    }

    // Relasi ke LogAktivitas
    public function logAktivitas()
    {
        return $this->hasMany(LogAktivitas::class, 'user_id', 'id_user');
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
