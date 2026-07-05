<?php

namespace Database\Seeders\SampelData;

use App\Models\FasilitatorBidang;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class FasilitatorSeeder extends Seeder
{
    public function run(): void
    {
        $fasilitatorRole = Role::where('name', 'fasilitator')->first();
        if (! $fasilitatorRole) {
            $this->command->error('Role fasilitator tidak ditemukan. Jalankan RoleAndPermissionSeeder terlebih dahulu.');

            return;
        }

        $provinsi = DB::table('provinsis')->where('name', 'DI YOGYAKARTA')->first();
        if (! $provinsi) {
            $this->command->error('Provinsi DI YOGYAKARTA tidak ditemukan. Jalankan WilayahSeeder terlebih dahulu.');

            return;
        }

        $bidang = DB::table('bidangs')->where('name', 'Pemulung')->first();
        if (! $bidang) {
            $this->command->error('Bidang Pemulung tidak ditemukan. Jalankan MasterSeeder terlebih dahulu.');

            return;
        }

        $superadmin = User::where('username', 'superadmin')->first();

        $user = User::firstOrCreate(
            ['username' => 'fasilitator_yogya'],
            [
                'id_user' => (string) Str::uuid(),
                'name' => 'Sanupal Muzamil',
                'password' => Hash::make('password'),
                'role_id' => $fasilitatorRole->id_role,
                'created_by' => $superadmin?->id_user,
                'no_telp' => '012345678',
                'foto' => null,
                'kode_prov' => $provinsi->kode,
                'kode_kab' => null,
                'kode_kec' => null,
                'status' => 'active',
            ]
        );

        FasilitatorBidang::firstOrCreate(
            ['user_id' => $user->id_user, 'bidang_id' => $bidang->id_bidang],
            [
                'id_fasilitator_bidang' => (string) Str::uuid(),
                'created_at' => now(),
            ]
        );

        $this->command->info('Fasilitator "Sanupal Muzamil" berhasil dibuat.');
    }
}
