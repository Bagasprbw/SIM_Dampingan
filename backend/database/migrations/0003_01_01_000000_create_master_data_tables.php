<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bidangs', function (Blueprint $table) {
            $table->string('id_bidang', 36)->primary();
            $table->string('name', 150);
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('pekerjaans', function (Blueprint $table) {
            $table->string('id_pekerjaan', 36)->primary();
            $table->string('name', 100);
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('level_kegiatans', function (Blueprint $table) {
            $table->string('id_level', 36)->primary();
            $table->string('nama_level', 50);
        });

        Schema::create('fasilitator_bidangs', function (Blueprint $table) {
            $table->string('id_fasilitator_bidang', 36)->primary();
            $table->string('user_id', 36);
            $table->string('bidang_id', 36);
            $table->timestamp('created_at')->nullable();

            $table->foreign('user_id')->references('id_user')->on('users')->cascadeOnDelete();
            $table->foreign('bidang_id')->references('id_bidang')->on('bidangs')->cascadeOnDelete();

            $table->unique(['user_id', 'bidang_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fasilitator_bidangs');
        Schema::dropIfExists('level_kegiatans');
        Schema::dropIfExists('pekerjaans');
        Schema::dropIfExists('bidangs');
    }
};
