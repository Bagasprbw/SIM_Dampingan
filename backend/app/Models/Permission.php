<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $table = 'permissions';

    protected $primaryKey = 'id_permission';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id_permission', 'code', 'name'];
}
