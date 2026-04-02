<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Str;

class RolePermission extends Pivot
{
    protected $table = 'role_permissions';

    protected $primaryKey = 'id_role_permission';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id_role_permission', 'role_id', 'permission_id'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id_role_permission)) {
                $model->id_role_permission = Str::uuid();
            }
        });
    }
}
