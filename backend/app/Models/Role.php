<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'roles';

    protected $primaryKey = 'id_role';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id_role', 'name'];

    public function permissions()
    {
        return $this->belongsToMany(
            Permission::class,
            'role_permissions',
            'role_id',
            'permission_id',
            'id_role',
            'id_permission'
        )
            ->using(RolePermission::class)
            ->withTimestamps();
    }
}
