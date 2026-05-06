<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sertifikats', function (Blueprint $table) {
            $table->string('id_sertifikat', 36)->primary();
            $table->string('peserta_id', 36);
            $table->string('nomor_sertifikat', 50)->unique();
            $table->timestamp('diterbitkan_at')->nullable();

            $table->foreign('peserta_id')
                  ->references('id_peserta_kegiatan')
                  ->on('peserta_kegiatans')
                  ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sertifikats');
    }
};
