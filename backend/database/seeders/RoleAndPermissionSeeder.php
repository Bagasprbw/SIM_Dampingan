<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Disable FK checks to safely truncate
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Bersihin pivot supaya idempotent saat di-seed ulang
        DB::table('role_permissions')->truncate();
        DB::table('permissions')->truncate();
        DB::table('roles')->truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $roles = [
            'superadmin',
            'admin_provinsi',
            'admin_kabupaten',
            'admin_kecamatan',
            'fasilitator',
            'pj_grup',
        ];

        $roleData = [];
        foreach ($roles as $role) {
            $roleData[$role] = Role::create([
                'id_role' => (string) Str::uuid(),
                'name' => $role,
            ]);
        }

        $permissions = [
            ['code' => 'view_kegiatan', 'name' => 'View Kegiatan'],
            ['code' => 'create_kegiatan', 'name' => 'Create Kegiatan'],
            ['code' => 'edit_kegiatan', 'name' => 'Edit Kegiatan'],
            ['code' => 'delete_kegiatan', 'name' => 'Delete Kegiatan'],
            ['code' => 'view_anggota', 'name' => 'View Anggota'],
            ['code' => 'create_anggota', 'name' => 'Create Anggota'],
            ['code' => 'manage_roles', 'name' => 'Manage Roles'],
        ];

        $permissionData = [];
        foreach ($permissions as $perm) {
            $permissionData[$perm['code']] = Permission::create([
                'id_permission' => (string) Str::uuid(),
                'code' => $perm['code'],
                'name' => $perm['name'],
            ]);
        }

        $assign = function (Role $role, array $codes) use ($permissionData) {
            foreach ($codes as $code) {
                DB::table('role_permissions')->insert([
                    'id_role_permission' => (string) Str::uuid(),
                    'role_id' => $role->id_role,
                    'permission_id' => $permissionData[$code]->id_permission,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        };

        $assign($roleData['superadmin'], array_keys($permissionData));

        $assign($roleData['admin_provinsi'], [
            'view_kegiatan',
            'create_kegiatan',
            'edit_kegiatan',
            'view_anggota',
        ]);
        $assign($roleData['admin_kabupaten'], [
            'view_kegiatan',
            'create_kegiatan',
            'edit_kegiatan',
        ]);
        $assign($roleData['admin_kecamatan'], ['view_kegiatan']);
        $assign($roleData['fasilitator'], ['view_kegiatan']);
        $assign($roleData['pj_grup'], ['view_kegiatan', 'view_anggota']);
    }
}
