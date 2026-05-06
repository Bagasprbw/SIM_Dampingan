<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kegiatans', function (Blueprint $table) {
            // Path ke file PDF fillable yang diupload fasilitator
            // NULL = kegiatan ini tidak menerbitkan sertifikat
            $table->string('template_sertifikat', 255)->nullable()->after('laporan');
        });
    }

    public function down(): void
    {
        Schema::table('kegiatans', function (Blueprint $table) {
            $table->dropColumn('template_sertifikat');
        });
    }
};
