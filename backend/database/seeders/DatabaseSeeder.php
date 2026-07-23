<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\SampelData\DataDampinganSeeder;
use Database\Seeders\SampelData\FasilitatorSeeder;
use Database\Seeders\SampelData\GrupPJ_GrupSeeder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Panggil seeder lain (urutan penting)
        $this->call([
            WilayahSeeder::class,            // Isi provinsi, kabupaten, kecamatan
            RoleAndPermissionSeeder::class,  // Isi roles & permissions
            MasterSeeder::class,             // Isi bidang, pekerjaan, dll (jika ada)
            LandingPageSeeder::class,        // Isi landing page default & deskripsi bidang
            // FasilitatorSeeder::class,        // Isi sampel data fasilitator
            // GrupPJ_GrupSeeder::class,        // Isi sampel data grup dampingan & PJ grup
            // DataDampinganSeeder::class,      // Isi sampel data anggota grup dampingan
        ]);

        // Ambil role superadmin (skip jika sudah ada — aman dijalankan ulang)
        $superadminRole = Role::where('name', 'superadmin')->first();
        if ($superadminRole) {
            User::firstOrCreate(
                ['username' => 'superadmin'],
                [
                    'id_user' => (string) Str::uuid(),
                    'name' => 'Superadmin',
                    'password' => Hash::make('password'),
                    'role_id' => $superadminRole->id_role,
                    'created_by' => null,
                    'no_telp' => '081234567890',
                    'foto' => null,
                    'kode_prov' => null,
                    'kode_kab' => null,
                    'kode_kec' => null,
                    'status' => 'active',
                ]
            );
        }

        // Ambil data wilayah pertama (contoh, pastikan WilayahSeeder sudah dijalankan)
        $provinsi = DB::table('provinsis')->first();
        if (! $provinsi) {
            // Jika tidak ada provinsi, hentikan atau lempar exception
            $this->command->error('Tidak ada data provinsi. Pastikan WilayahSeeder berjalan dengan benar.');

            return;
        }

        $kabupaten = DB::table('kabupatens')->where('kode_prov', $provinsi->kode)->first();
        $kecamatan = null;
        if ($kabupaten) {
            $kecamatan = DB::table('kecamatans')->where('kode_kab', $kabupaten->kode)->first();
        }
    }
}
