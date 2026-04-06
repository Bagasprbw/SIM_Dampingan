<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
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
        ]);

        // Ambil role superadmin
        $superadminRole = Role::where('name', 'superadmin')->first();
        if ($superadminRole) {
            User::create([
                'id_user'    => (string) Str::uuid(),
                'name'       => 'Superadmin',
                'username'   => 'superadmin',
                'password'   => Hash::make('password'),
                'role_id'    => $superadminRole->id_role,
                'created_by' => null,
                'no_telp'    => '081234567890',
                'foto'       => null,
                'kode_prov'  => null,
                'kode_kab'   => null,
                'kode_kec'   => null,
                'status'     => 'active',
            ]);
        }

        // Ambil data wilayah pertama (contoh, pastikan WilayahSeeder sudah dijalankan)
        $provinsi = DB::table('provinsis')->first();
        if (!$provinsi) {
            // Jika tidak ada provinsi, hentikan atau lempar exception
            $this->command->error('Tidak ada data provinsi. Pastikan WilayahSeeder berjalan dengan benar.');
            return;
        }

        $kabupaten = DB::table('kabupatens')->where('kode_prov', $provinsi->kode)->first();
        $kecamatan = null;
        if ($kabupaten) {
            $kecamatan = DB::table('kecamatans')->where('kode_kab', $kabupaten->kode)->first();
        }

        // Ambil user superadmin untuk dijadikan created_by
        $superadmin = User::where('username', 'superadmin')->first();

        // ---- Admin Provinsi ----
        $adminProvinsiRole = Role::where('name', 'admin_provinsi')->first();
        if ($adminProvinsiRole && $provinsi) {
            User::create([
                'id_user'    => (string) Str::uuid(),
                'name'       => 'Admin Provinsi',
                'username'   => 'admin_provinsi',
                'password'   => Hash::make('password'),
                'role_id'    => $adminProvinsiRole->id_role,
                'created_by' => $superadmin?->id_user,
                'no_telp'    => '081234567891',
                'foto'       => null,
                'kode_prov'  => $provinsi->kode,
                'kode_kab'   => null,
                'kode_kec'   => null,
                'status'     => 'active',
            ]);
        }

        // ---- Admin Kabupaten ----
        $adminKabupatenRole = Role::where('name', 'admin_kabupaten')->first();
        if ($adminKabupatenRole && $kabupaten) {
            User::create([
                'id_user'    => (string) Str::uuid(),
                'name'       => 'Admin Kabupaten',
                'username'   => 'admin_kabupaten',
                'password'   => Hash::make('password'),
                'role_id'    => $adminKabupatenRole->id_role,
                'created_by' => $superadmin?->id_user,
                'no_telp'    => '081234567892',
                'foto'       => null,
                'kode_prov'  => $kabupaten->kode_prov,
                'kode_kab'   => $kabupaten->kode,
                'kode_kec'   => null,
                'status'     => 'active',
            ]);
        }

        // ---- Admin Kecamatan ----
        $adminKecamatanRole = Role::where('name', 'admin_kecamatan')->first();
        if ($adminKecamatanRole && $kecamatan) {
            // Dapatkan kode_prov dari kabupaten yang terkait
            $kodeProv = DB::table('kabupatens')->where('kode', $kecamatan->kode_kab)->value('kode_prov');
            User::create([
                'id_user'    => (string) Str::uuid(),
                'name'       => 'Admin Kecamatan',
                'username'   => 'admin_kecamatan',
                'password'   => Hash::make('password'),
                'role_id'    => $adminKecamatanRole->id_role,
                'created_by' => $superadmin?->id_user,
                'no_telp'    => '081234567893',
                'foto'       => null,
                'kode_prov'  => $kodeProv,
                'kode_kab'   => $kecamatan->kode_kab,
                'kode_kec'   => $kecamatan->kode,
                'status'     => 'active',
            ]);
        }

        // ---- Fasilitator ----
        $fasilitatorRole = Role::where('name', 'fasilitator')->first();
        if ($fasilitatorRole) {
            User::create([
                'id_user'    => (string) Str::uuid(),
                'name'       => 'Fasilitator',
                'username'   => 'fasilitator',
                'password'   => Hash::make('password'),
                'role_id'    => $fasilitatorRole->id_role,
                'created_by' => $superadmin?->id_user,
                'no_telp'    => '081234567894',
                'foto'       => null,
                'kode_prov'  => $provinsi->kode ?? null,
                'kode_kab'   => $kabupaten->kode ?? null,
                'kode_kec'   => null,
                'status'     => 'active',
            ]);
        }

        // ---- PJ Grup ----
        $pjGrupRole = Role::where('name', 'pj_grup')->first();
        if ($pjGrupRole) {
            User::create([
                'id_user'    => (string) Str::uuid(),
                'name'       => 'PJ Grup',
                'username'   => 'pj_grup',
                'password'   => Hash::make('password'),
                'role_id'    => $pjGrupRole->id_role,
                'created_by' => $superadmin?->id_user,
                'no_telp'    => '081234567895',
                'foto'       => null,
                'kode_prov'  => $provinsi->kode ?? null,
                'kode_kab'   => $kabupaten->kode ?? null,
                'kode_kec'   => $kecamatan->kode ?? null,
                'status'     => 'active',
            ]);
        }
    }
}
