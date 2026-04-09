<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grup_dampingans', function (Blueprint $table) {
            $table->string('id_grup_dampingan', 36)->primary();
            $table->string('name', 200);
            $table->string('bidang_id', 36);
            $table->string('pengurus_id', 36); //user(pj_grup) yang jadi pengurus grup dampingannya
            $table->enum('level_dampingan', ['pusat', 'provinsi', 'kabupaten', 'kecamatan']);
            $table->string('kode_prov', 10)->nullable();
            $table->string('kode_kab', 10)->nullable();
            $table->string('kode_kec', 10)->nullable();
            $table->timestamp('created_at')->nullable();

            $table->foreign('bidang_id')->references('id_bidang')->on('bidangs')->restrictOnDelete();
            $table->foreign('pengurus_id')->references('id_user')->on('users')->restrictOnDelete();
            $table->foreign('kode_prov')->references('kode')->on('provinsis')->nullOnDelete();
            $table->foreign('kode_kab')->references('kode')->on('kabupatens')->nullOnDelete();
            $table->foreign('kode_kec')->references('kode')->on('kecamatans')->nullOnDelete();
        });

        //karena nanti di form ada pilih fasilitator lebih dari 1
        Schema::create('grup_fasilitators', function (Blueprint $table) {
            $table->string('id_grup_fasilitator', 36)->primary();
            $table->string('grup_dampingan_id', 36);
            $table->string('fasilitator_id', 36);
            $table->timestamp('created_at')->nullable();

            $table->foreign('grup_dampingan_id')->references('id_grup_dampingan')->on('grup_dampingans')->cascadeOnDelete();
            $table->foreign('fasilitator_id')->references('id_user')->on('users')->cascadeOnDelete();

            $table->unique(['grup_dampingan_id', 'fasilitator_id']);
        });

        Schema::create('anggota_grup_dampingans', function (Blueprint $table) {
            $table->string('id_anggota_grup', 36)->primary();
            $table->string('bidang_id', 36);
            $table->string('no_anggota', 50)->unique();
            $table->string('name', 150);
            $table->string('tempat_lahir', 100)->nullable();
            $table->date('tgl_lahir')->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
            $table->enum('agama', ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'])->nullable();
            $table->text('alamat')->nullable();
            $table->string('no_telp', 20)->nullable();
            $table->string('foto', 255)->nullable();
            $table->string('pekerjaan_id', 36)->nullable();
            $table->string('grup_id', 36);
            $table->enum('status', ['aktif', 'non aktif'])->default('aktif');
            $table->enum('peran', ['koordinator', 'anggota'])->default('anggota');
            $table->timestamp('created_at')->nullable();

            $table->foreign('bidang_id')->references('id_bidang')->on('bidangs')->restrictOnDelete();
            $table->foreign('pekerjaan_id')->references('id_pekerjaan')->on('pekerjaans')->nullOnDelete();
            $table->foreign('grup_id')->references('id_grup_dampingan')->on('grup_dampingans')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anggota_grup_dampingans');
        Schema::dropIfExists('grup_fasilitators');
        Schema::dropIfExists('grup_dampingans');
    }
};
