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
        Schema::create('deskripsi_bidangs', function (Blueprint $table) {
            $table->string('id_deskripsi_bidang', 36)->primary();
            $table->string('id_bidang', 36)->unique();
            $table->text('deskripsi');
            $table->timestamps();

            $table->foreign('id_bidang')->references('id_bidang')->on('bidangs')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deskripsi_bidangs');
    }
};
