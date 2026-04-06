<?php

namespace Database\Seeders;

use App\Models\Provinsi;
use App\Models\Kabupaten;
use App\Models\Kecamatan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class WilayahSeeder extends Seeder
{
    private $baseUrl = 'https://emsifa.github.io/api-wilayah-indonesia/api';

    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('kecamatans')->truncate();
        DB::table('kabupatens')->truncate();
        DB::table('provinsis')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        try {
            $this->seedProvinsis();
            $this->seedKabupatens();
            $this->seedKecamatans();

            $this->command->info('🔥 SELESAI! Semua wilayah berhasil di-seed');
        } catch (\Exception $e) {
            $this->command->error('❌ Error: ' . $e->getMessage());
        }
    }

    private function apiGet($url)
    {
        $response = Http::retry(3, 200)->get($url);

        if (!$response->successful()) {
            throw new \Exception("API gagal: $url");
        }

        return $response->json();
    }

    private function seedProvinsis(): void
    {
        $this->command->info('📍 Ambil provinsi...');

        $provinsis = $this->apiGet("{$this->baseUrl}/provinces.json");;

        $data = [];
        foreach ($provinsis as $prov) {
            $data[] = [
                'kode' => (string) $prov['id'],
                'name' => $prov['name'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        Provinsi::insert($data);

        $this->command->info('✓ ' . count($data) . ' provinsi');
    }

    private function seedKabupatens(): void
    {
        $this->command->info('📍 Ambil kabupaten...');

        $provinsis = Provinsi::pluck('kode');
        $total = count($provinsis);

        $this->command->getOutput()->progressStart($total);

        $allData = [];

        foreach ($provinsis as $kodeProv) {
            $kabupatens = $this->apiGet("{$this->baseUrl}/regencies/{$kodeProv}.json");;

            foreach ($kabupatens as $kab) {
                $allData[] = [
                    'kode' => (string) $kab['id'],
                    'name' => $kab['name'],
                    'kode_prov' => (string) $kodeProv,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            $this->command->getOutput()->progressAdvance();
        }

        Kabupaten::insert($allData);

        $this->command->getOutput()->progressFinish();
        $this->command->info("\n✓ " . count($allData) . " kabupaten");
    }

    private function seedKecamatans(): void
    {
        $this->command->info('📍 Ambil kecamatan...');

        $kabupatens = Kabupaten::pluck('kode');
        $total = count($kabupatens);

        $this->command->getOutput()->progressStart($total);

        $batchSize = 500;
        $buffer = [];
        $totalInsert = 0;

        foreach ($kabupatens as $kodeKab) {
            $kecamatans = $this->apiGet("{$this->baseUrl}/districts/{$kodeKab}.json");;

            foreach ($kecamatans as $kec) {
                $buffer[] = [
                    'kode' => (string) $kec['id'],
                    'name' => $kec['name'],
                    'kode_kab' => (string) $kodeKab,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                if (count($buffer) >= $batchSize) {
                    Kecamatan::insert($buffer);
                    $totalInsert += count($buffer);
                    $buffer = [];
                }
            }

            $this->command->getOutput()->progressAdvance();
        }

        // Insert sisa buffer
        if (!empty($buffer)) {
            Kecamatan::insert($buffer);
            $totalInsert += count($buffer);
        }

        $this->command->getOutput()->progressFinish();
        $this->command->info("\n✓ $totalInsert kecamatan");
    }
}
