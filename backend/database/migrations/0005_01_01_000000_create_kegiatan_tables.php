<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kegiatans', function (Blueprint $table) {
            $table->string('id_kegiatan', 36)->primary();
            $table->string('judul', 200);
            $table->text('deskripsi')->nullable();
            $table->text('masalah')->nullable();
            $table->text('solusi')->nullable();
            $table->date('tanggal')->nullable();
            $table->time('waktu')->nullable();
            $table->text('lokasi')->nullable();
            $table->string('fasilitator_id', 36);
            $table->string('level_id', 36);
            $table->string('bidang_id', 36);
            $table->string('kode_prov', 10)->nullable();
            $table->string('kode_kab', 10)->nullable();
            $table->string('kode_kec', 10)->nullable();
            $table->enum('status', ['draft', 'published', 'selesai'])->default('draft');
            $table->integer('jumlah_hadir')->nullable();
            $table->integer('jumlah_tdk_hadir')->nullable();
            $table->string('laporan', 255)->nullable();
            $table->timestamp('created_at')->nullable();

            $table->foreign('fasilitator_id')->references('id_user')->on('users')->restrictOnDelete();
            $table->foreign('level_id')->references('id_level')->on('level_kegiatans')->restrictOnDelete();
            $table->foreign('bidang_id')->references('id_bidang')->on('bidangs')->restrictOnDelete();
            $table->foreign('kode_prov')->references('kode')->on('provinsis')->nullOnDelete();
            $table->foreign('kode_kab')->references('kode')->on('kabupatens')->nullOnDelete();
            $table->foreign('kode_kec')->references('kode')->on('kecamatans')->nullOnDelete();
        });

        Schema::create('peserta_kegiatans', function (Blueprint $table) {
            $table->string('id_peserta_kegiatan', 36)->primary();
            $table->string('kegiatan_id', 36);
            $table->string('anggota_id', 36)->nullable();
            $table->string('nama_peserta', 150)->nullable();
            $table->enum('jenis_peserta', ['anggota', 'eksternal']);
            $table->enum('status_hadir', ['hadir', 'tidak'])->default('tidak');
            $table->timestamp('created_at')->nullable();

            $table->foreign('kegiatan_id')->references('id_kegiatan')->on('kegiatans')->cascadeOnDelete();
            $table->foreign('anggota_id')->references('id_anggota_grup')->on('anggota_grup_dampingans')->nullOnDelete();
        });

        Schema::create('kegiatan_grups', function (Blueprint $table) {
            $table->string('id_kegiatan_grup', 36)->primary();
            $table->string('kegiatan_id', 36);
            $table->string('grup_dampingan_id', 36);

            $table->foreign('kegiatan_id')->references('id_kegiatan')->on('kegiatans')->cascadeOnDelete();
            $table->foreign('grup_dampingan_id')->references('id_grup_dampingan')->on('grup_dampingans')->cascadeOnDelete();

            $table->unique(['kegiatan_id', 'grup_dampingan_id']);
        });

        Schema::create('foto_absensis', function (Blueprint $table) {
            $table->string('id_foto_absensi', 36)->primary();
            $table->string('kegiatan_id', 36);
            $table->string('file', 255);
            $table->timestamp('created_at')->nullable();

            $table->foreign('kegiatan_id')->references('id_kegiatan')->on('kegiatans')->cascadeOnDelete();
        });

        Schema::create('foto_kegiatans', function (Blueprint $table) {
            $table->string('id_foto', 36)->primary();
            $table->string('kegiatan_id', 36);
            $table->string('file', 255);
            $table->timestamp('created_at')->nullable();

            $table->foreign('kegiatan_id')->references('id_kegiatan')->on('kegiatans')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('foto_kegiatans');
        Schema::dropIfExists('foto_absensis');
        Schema::dropIfExists('kegiatan_grups');
        Schema::dropIfExists('peserta_kegiatans');
        Schema::dropIfExists('kegiatans');
    }
};
