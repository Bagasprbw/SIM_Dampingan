<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paduans', function (Blueprint $table) {
            $table->string('id_paduan', 36)->primary();
            $table->string('judul', 200);
            $table->string('file', 255);
            $table->string('link', 255); //link video
            $table->string('role_target', 36);
            $table->timestamp('created_at')->nullable();

            $table->foreign('role_target')->references('id_role')->on('roles')->cascadeOnDelete();
        });

        Schema::create('log_aktivitas', function (Blueprint $table) {
            $table->string('id_log', 36)->primary();
            $table->string('user_id', 36);
            $table->string('aksi', 50);
            $table->string('modul', 100);
            $table->string('data_id', 36)->nullable();
            $table->text('deskripsi')->nullable();
            $table->json('data_lama')->nullable();
            $table->json('data_baru')->nullable();
            $table->string('ip_address', 50)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('kode_prov', 10)->nullable();
            $table->string('kode_kab', 10)->nullable();
            $table->string('kode_kec', 10)->nullable();
            $table->timestamp('created_at')->nullable();

            $table->foreign('user_id')->references('id_user')->on('users')->cascadeOnDelete();
            $table->foreign('kode_prov')->references('kode')->on('provinsis')->nullOnDelete();
            $table->foreign('kode_kab')->references('kode')->on('kabupatens')->nullOnDelete();
            $table->foreign('kode_kec')->references('kode')->on('kecamatans')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_aktivitas');
        Schema::dropIfExists('paduans');
    }
};
