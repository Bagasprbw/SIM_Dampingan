<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Buat tabel global template sertifikat
        Schema::create('sertifikat_templates', function (Blueprint $table) {
            $table->string('id_template', 36)->primary();
            $table->string('file', 255)->comment('Path file template sertifikat PDF fillable (AcroForm)');
            $table->string('created_by', 36)->nullable()->comment('User yang upload (hanya superadmin)');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->foreign('created_by')
                  ->references('id_user')
                  ->on('users')
                  ->nullOnDelete();
        });

        // 2. Hapus kolom template_sertifikat dari tabel kegiatans
        if (Schema::hasColumn('kegiatans', 'template_sertifikat')) {
            Schema::table('kegiatans', function (Blueprint $table) {
                $table->dropColumn('template_sertifikat');
            });
        }
    }

    public function down(): void
    {
        // Kembalikan kolom template_sertifikat ke kegiatans
        Schema::table('kegiatans', function (Blueprint $table) {
            $table->string('template_sertifikat', 255)->nullable()->after('laporan');
        });

        // Hapus tabel sertifikat_templates
        Schema::dropIfExists('sertifikat_templates');
    }
};
