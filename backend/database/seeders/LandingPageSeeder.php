<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LandingPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed halaman_utamas
        if (DB::table('halaman_utamas')->count() === 0) {
            DB::table('halaman_utamas')->insert([
                'id_halaman_utama' => (string) Str::uuid(),
                'judul_website' => 'Sistem Informasi Manajemen Dampingan MPM Muhammadiyah',
                'deskripsi_website' => "Selamat datang di Mentora, platform integrasi data dan monitoring kelompok dampingan Majelis Pemberdayaan Masyarakat (MPM) Muhammadiyah. Kami berkomitmen mewujudkan kemandirian mustadh'afin secara terukur, terarah, dan berkelanjutan.",
                'hero_image' => null,
                'tentang' => 'Majelis Pemberdayaan Masyarakat (MPM) Muhammadiyah adalah salah satu unsur pembantu pimpinan di tingkat Pimpinan Pusat (PP) Muhammadiyah yang berdiri kokoh mengemban amanat khusus untuk pemberdayaan masyarakat. Fokus utama kami adalah kelompok dhu\'afa (lemah) dan mustadh\'afin (terpinggirkan) secara struktural maupun kultural. Melalui pendekatan ekologi perkembangan manusia, kami berupaya mengentaskan kemiskinan, memajukan kemandirian ekonomi, serta memperluas akses sosial-politik bagi mereka yang membutuhkan.',
                'filosofi' => 'Mengembangkan cebong yang hanya mampu hidup di dalam kolam kecil menjadi katak yang dapat meloncat ke mana-mana.',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 2. Seed deskripsi_bidangs
        $bidangs = DB::table('bidangs')->get();
        
        $defaultDescriptions = [
            'Petani' => 'Pengembangan sistem pertanian berkelanjutan, edukasi pupuk organik mandiri, pendampingan pasca-panen, serta pembukaan akses pasar tani.',
            'Difabel' => 'Penyediaan ruang pelatihan keterampilan inklusif, pendampingan kemandirian wirausaha, serta sosialisasi aksesibilitas fasilitas umum.',
            'Nelayan' => 'Pemberdayaan nelayan tradisional melalui penyediaan alat tangkap ramah lingkungan, manajemen pemasaran hasil laut, dan penguatan ekonomi keluarga pesisir.',
            'Pedagang' => 'Pembinaan pedagang kecil dan wirausaha mikro melalui cooperative financial support, manajemen tata kelola usaha, dan pelatihan peningkatan penjualan digital.'
        ];

        foreach ($bidangs as $bidang) {
            $exists = DB::table('deskripsi_bidangs')->where('id_bidang', $bidang->id_bidang)->exists();
            if (!$exists) {
                $desc = $defaultDescriptions[$bidang->name] ?? 'Pendampingan dan pemberdayaan terintegrasi di bidang ' . $bidang->name . ' untuk mewujudkan kemandirian ekonomi dan sosial kelompok dampingan.';
                
                DB::table('deskripsi_bidangs')->insert([
                    'id_deskripsi_bidang' => (string) Str::uuid(),
                    'id_bidang' => $bidang->id_bidang,
                    'deskripsi' => $desc,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
