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
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

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

        // Daftar semua permission
        $permissions = [
            ['code' => 'view_kegiatan', 'name' => 'View Kegiatan'],
            ['code' => 'create_kegiatan', 'name' => 'Create Kegiatan'],
            ['code' => 'edit_kegiatan', 'name' => 'Edit Kegiatan'],
            ['code' => 'delete_kegiatan', 'name' => 'Delete Kegiatan'],
            ['code' => 'kelola_fasilitator', 'name' => 'Kelola Fasilitator'],
            ['code' => 'kelola_masyarakat', 'name' => 'Kelola Masyarakat'],
            ['code' => 'kelola_grup', 'name' => 'Kelola Grup Dampingan'],
            ['code' => 'kelola_admin_bawahan', 'name' => 'Kelola Admin Bawahan'],
            ['code' => 'ajukan_anggota', 'name' => 'Ajukan Anggota'],
            ['code' => 'verifikasi_anggota', 'name' => 'Verifikasi Anggota'],
            ['code' => 'manage_roles', 'name' => 'Manage Roles'],
            ['code' => 'kelola_pj_grup', 'name' => 'Kelola PJ Grup'],
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


        // Superadmin - punya semua permission termasuk manage_roles untuk RBAC management
        $assign($roleData['superadmin'], array_keys($permissionData));

        // Admin Provinsi - kelola admin bawahan, fasilitator, masyarakat, grup, pj_grup
        $assign($roleData['admin_provinsi'], [
            'view_kegiatan',
            'kelola_fasilitator',
            'kelola_masyarakat',
            'kelola_grup',
            'kelola_admin_bawahan',
            'kelola_pj_grup',
        ]);

        // Admin Kabupaten - kelola admin bawahan (kecamatan), fasilitator, masyarakat, grup, pj_grup
        $assign($roleData['admin_kabupaten'], [
            'view_kegiatan',
            'kelola_fasilitator',
            'kelola_masyarakat',
            'kelola_grup',
            'kelola_admin_bawahan',
            'kelola_pj_grup',
        ]);

        // Admin Kecamatan - kelola fasilitator, masyarakat, grup, pj_grup
        $assign($roleData['admin_kecamatan'], [
            'view_kegiatan',
            'kelola_fasilitator',
            'kelola_masyarakat',
            'kelola_grup',
            'kelola_pj_grup',
        ]);

        // Fasilitator - buat dan edit kegiatan, verifikasi anggota, kelola pj_grup
        $assign($roleData['fasilitator'], [
            'view_kegiatan',
            'create_kegiatan',
            'edit_kegiatan',
            'verifikasi_anggota',
            'kelola_pj_grup',
        ]);

        // PJ Grup - hanya lihat kegiatan dan ajukan anggota
        $assign($roleData['pj_grup'], [
            'view_kegiatan',
            'ajukan_anggota',
        ]);
    }
}
