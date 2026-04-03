<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('provinsis', function (Blueprint $table) {
            $table->string('kode', 10)->primary();
            $table->string('name', 100);
            $table->timestamps();
        });

        Schema::create('kabupatens', function (Blueprint $table) {
            $table->string('kode', 10)->primary();
            $table->string('name', 100);
            $table->string('kode_prov', 10);
            $table->timestamps();

            $table->foreign('kode_prov')->references('kode')->on('provinsis')->cascadeOnDelete();
        });

        Schema::create('kecamatans', function (Blueprint $table) {
            $table->string('kode', 10)->primary();
            $table->string('name', 100);
            $table->string('kode_kab', 10);
            $table->timestamps();

            $table->foreign('kode_kab')->references('kode')->on('kabupatens')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kecamatans');
        Schema::dropIfExists('kabupatens');
        Schema::dropIfExists('provinsis');
    }
};
