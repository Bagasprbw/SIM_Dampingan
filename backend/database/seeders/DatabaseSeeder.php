<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            WilayahSeeder::class,
            RoleAndPermissionSeeder::class,
            MasterSeeder::class,
        ]);

        $superadminRole = Role::where('name', 'superadmin')->first();

        if ($superadminRole) {
            User::create([
                'id_user' => (string) Str::uuid(),
                'name' => 'Superadmin',
                'username' => 'superadmin',
                'password' => Hash::make('password'),
                'role_id' => $superadminRole->id_role,
                'no_telp' => '081234567890',
                'foto' => null,
                'kode_prov' => null,
                'kode_kab' => null,
                'kode_kec' => null,
                'status' => 'active',
            ]);
        }
    }
}
