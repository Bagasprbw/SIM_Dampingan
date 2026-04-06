<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MasterSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedBidang();
        $this->seedPekerjaan();
        $this->seedLevelKegiatan();
    }

    private function seedBidang()
    {
        $data = ['Petani', 'Difabel', 'Nelayan', 'Pedagang'];

        $insert = [];

        foreach ($data as $item) {
            $insert[] = [
                'id_bidang' => (string) Str::uuid(),
                'name' => $item,
                'created_at' => now(),
            ];
        }

        DB::table('bidangs')->insert($insert);
    }

    private function seedPekerjaan()
    {
        $data = [
            'Petani',
            'Peternak',
            'Nelayan',
            'Buruh Pabrik',
            'Buruh Tani',
            'Wirausaha',
            'Pedagang',
            'Karyawan Swasta',
            'PNS',
            'TNI/Polri',
            'Guru/Dosen',
            'Pelajar/Mahasiswa',
            'Lainnya',
        ];

        $insert = [];

        foreach ($data as $item) {
            $insert[] = [
                'id_pekerjaan' => (string) Str::uuid(),
                'name' => $item,
                'created_at' => now(),
            ];
        }

        DB::table('pekerjaans')->insert($insert);
    }

    private function seedLevelKegiatan()
    {
        $data = ['Nasional', 'Provinsi', 'Kabupaten', 'Kecamatan'];

        $insert = [];

        foreach ($data as $item) {
            $insert[] = [
                'id_level' => (string) Str::uuid(),
                'nama_level' => $item,
            ];
        }

        DB::table('level_kegiatans')->insert($insert);
    }
}
