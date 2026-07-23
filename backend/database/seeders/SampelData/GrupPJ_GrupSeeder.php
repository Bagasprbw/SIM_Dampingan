<?php

namespace Database\Seeders\SampelData;

use App\Models\GrupDampingan;
use App\Models\GrupFasilitator;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class GrupPJ_GrupSeeder extends Seeder
{
    public function run(): void
    {
        $pjGrupRole = Role::where('name', 'pj_grup')->first();
        if (! $pjGrupRole) {
            $this->command->error('Role pj_grup tidak ditemukan.');

            return;
        }

        $fasilitatorRole = Role::where('name', 'fasilitator')->first();
        if (! $fasilitatorRole) {
            $this->command->error('Role fasilitator tidak ditemukan.');

            return;
        }

        $superadmin = User::where('username', 'superadmin')->first();

        $provinsi = DB::table('provinsis')->where('name', 'LIKE', '%YOGYAKARTA%')->first();
        if (! $provinsi) {
            $this->command->error('Provinsi Yogyakarta tidak ditemukan.');

            return;
        }

        $getKab = fn ($name) => DB::table('kabupatens')
            ->where('name', 'LIKE', "%$name%")
            ->where('kode_prov', $provinsi->kode)
            ->first();

        $getKec = fn ($kabKode, $name) => DB::table('kecamatans')
            ->where('name', 'LIKE', "%$name%")
            ->where('kode_kab', $kabKode)
            ->first();

        $getBidang = fn ($name) => DB::table('bidangs')
            ->where('name', 'LIKE', "%$name%")
            ->first();

        $getFasilitator = fn ($username) => User::where('username', $username)->first();

        $bidangPemulung = $getBidang('Pemulung');
        $bidangUMKM = $getBidang('UMKM');
        $bidangPeternak = $getBidang('Peternak');
        $bidangPetani = $getBidang('Petani');
        $bidangDifabel = $getBidang('Difabel & Disabilitas');
        $bidangPedagang = $getBidang('Pedagang');
        $bidangNelayan = $getBidang('Nelayan');

        $kabKulonProgo = $getKab('KULON PROGO');
        $kabSleman = $getKab('SLEMAN');
        $kabGunungKidul = $getKab('GUNUNG KIDUL');
        $kabYogyakarta = $getKab('YOGYAKARTA');

        $kecKokap = $kabKulonProgo ? $getKec($kabKulonProgo->kode, 'KOKAP') : null;
        $kecMinggir = $kabSleman ? $getKec($kabSleman->kode, 'MINGGIR') : null;
        $kecSleman = $kabSleman ? $getKec($kabSleman->kode, 'SLEMAN') : null;
        $kecPatuk = $kabGunungKidul ? $getKec($kabGunungKidul->kode, 'PATUK') : null;
        $kecGamping = $kabSleman ? $getKec($kabSleman->kode, 'GAMPING') : null;
        $kecNgaglik = $kabSleman ? $getKec($kabSleman->kode, 'NGAGLIK') : null;

        $fasilitatorSanupal = $getFasilitator('fasilitator_yogya');

        $grups = [
            [
                'name' => 'Mardiko',
                'bidang_id' => $bidangPemulung?->id_bidang,
                'level' => 'provinsi',
                'kode_prov' => $provinsi->kode,
                'kode_kab' => null,
                'kode_kec' => null,
                'fasilitator' => $fasilitatorSanupal,
            ],
            [
                'name' => 'Kokap',
                'bidang_id' => $bidangUMKM?->id_bidang,
                'level' => 'kecamatan',
                'kode_prov' => $provinsi->kode,
                'kode_kab' => $kabKulonProgo?->kode,
                'kode_kec' => $kecKokap?->kode,
                'fasilitator' => null,
            ],
            [
                'name' => 'JATAM Difabel',
                'bidang_id' => $bidangPeternak?->id_bidang,
                'level' => 'kecamatan',
                'kode_prov' => $provinsi->kode,
                'kode_kab' => $kabSleman?->kode,
                'kode_kec' => $kecMinggir?->kode,
                'fasilitator' => null,
            ],
            [
                'name' => 'JATAM Minggir',
                'bidang_id' => $bidangPetani?->id_bidang,
                'level' => 'kecamatan',
                'kode_prov' => $provinsi->kode,
                'kode_kab' => $kabSleman?->kode,
                'kode_kec' => $kecSleman?->kode,
                'fasilitator' => null,
            ],
            [
                'name' => 'Ngoro - Ngoro',
                'bidang_id' => $bidangUMKM?->id_bidang,
                'level' => 'kecamatan',
                'kode_prov' => $provinsi->kode,
                'kode_kab' => $kabGunungKidul?->kode,
                'kode_kec' => $kecPatuk?->kode,
                'fasilitator' => null,
            ],
            [
                'name' => 'Gading',
                'bidang_id' => $bidangDifabel?->id_bidang,
                'level' => 'kecamatan',
                'kode_prov' => $provinsi->kode,
                'kode_kab' => $kabSleman?->kode,
                'kode_kec' => $kecGamping?->kode,
                'fasilitator' => null,
            ],
            [
                'name' => 'Bank Difabel',
                'bidang_id' => $bidangDifabel?->id_bidang,
                'level' => 'kecamatan',
                'kode_prov' => $provinsi->kode,
                'kode_kab' => $kabSleman?->kode,
                'kode_kec' => $kecNgaglik?->kode,
                'fasilitator' => null,
            ],
            [
                'name' => 'Asongan',
                'bidang_id' => $bidangPedagang?->id_bidang,
                'level' => 'kabupaten',
                'kode_prov' => $provinsi->kode,
                'kode_kab' => $kabYogyakarta?->kode,
                'kode_kec' => null,
                'fasilitator' => null,
            ],
            [
                'name' => 'GERKATIN Sleman',
                'bidang_id' => $bidangDifabel?->id_bidang,
                'level' => 'kabupaten',
                'kode_prov' => $provinsi->kode,
                'kode_kab' => $kabSleman?->kode,
                'kode_kec' => null,
                'fasilitator' => null,
            ],
            [
                'name' => 'JALAMU',
                'bidang_id' => $bidangNelayan?->id_bidang,
                'level' => 'provinsi',
                'kode_prov' => $provinsi->kode,
                'kode_kab' => null,
                'kode_kec' => $kecNgaglik?->kode,
                'fasilitator' => null,
            ],
        ];

        foreach ($grups as $grup) {
            $grupName = $grup['name'];
            $pjUsername = 'pj_'.Str::slug($grupName, '_');

            $pjUser = User::firstOrCreate(
                ['username' => $pjUsername],
                [
                    'id_user' => (string) Str::uuid(),
                    'name' => 'Mr. '.$grupName,
                    'password' => Hash::make('password'),
                    'role_id' => $pjGrupRole->id_role,
                    'created_by' => $superadmin?->id_user,
                    'no_telp' => '0123456789',
                    'foto' => null,
                    'kode_prov' => $grup['kode_prov'],
                    'kode_kab' => $grup['kode_kab'],
                    'kode_kec' => $grup['kode_kec'],
                    'status' => 'active',
                ]
            );

            $grupDampinganId = (string) Str::uuid();
            $grupDampingan = GrupDampingan::firstOrCreate(
                ['name' => $grupName],
                [
                    'id_grup_dampingan' => $grupDampinganId,
                    'pengurus_id' => $pjUser->id_user,
                    'level_dampingan' => $grup['level'],
                    'kode_prov' => $grup['kode_prov'],
                    'kode_kab' => $grup['kode_kab'],
                    'kode_kec' => $grup['kode_kec'],
                    'created_at' => now(),
                ]
            );

            if ($grup['bidang_id']) {
                $grupDampingan->bidangs()->sync([$grup['bidang_id']]);
            }

            if ($grup['fasilitator']) {
                $existingGrup = GrupDampingan::where('name', $grupName)->first();
                if ($existingGrup) {
                    GrupFasilitator::firstOrCreate(
                        [
                            'grup_dampingan_id' => $existingGrup->id_grup_dampingan,
                            'fasilitator_id' => $grup['fasilitator']->id_user,
                        ],
                        [
                            'id_grup_fasilitator' => (string) Str::uuid(),
                            'created_at' => now(),
                        ]
                    );
                }
            }

            $this->command->info("✓ Grup '$grupName' dengan PJ 'Mr. $grupName' berhasil dibuat.");
        }
    }
}
