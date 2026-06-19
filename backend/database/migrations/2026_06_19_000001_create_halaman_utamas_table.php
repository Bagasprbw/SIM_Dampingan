<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('halaman_utamas', function (Blueprint $table) {
            $table->string('id_halaman_utama', 36)->primary();
            $table->string('judul_website', 150);
            $table->text('deskripsi_website');
            $table->string('hero_image')->nullable();
            $table->text('tentang');
            $table->text('filosofi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('halaman_utamas');
    }
};
