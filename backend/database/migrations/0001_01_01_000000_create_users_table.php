<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->string('id_role', 36)->primary();
            $table->string('name', 50)->unique();
            $table->timestamps();
        });

        Schema::create('users', function (Blueprint $table) {
            $table->string('id_user', 36)->primary();
            $table->string('name', 150);
            $table->string('username', 100)->unique();
            $table->string('password', 255);

            $table->string('role_id', 36);
            $table->string('created_by', 36)->nullable();

            $table->string('no_telp', 20)->nullable();
            $table->string('foto', 255)->nullable();

            $table->string('kode_prov', 10)->nullable();
            $table->string('kode_kab', 10)->nullable();
            $table->string('kode_kec', 10)->nullable();

            $table->enum('status', ['active', 'inactive'])->default('active');

            $table->rememberToken();
            $table->timestamps();

            $table->foreign('role_id')->references('id_role')->on('roles')->restrictOnDelete();
            $table->foreign('created_by')->references('id_user')->on('users')->nullOnDelete();
            $table->foreign('kode_prov')->references('kode')->on('provinsis')->nullOnDelete();
            $table->foreign('kode_kab')->references('kode')->on('kabupatens')->nullOnDelete();
            $table->foreign('kode_kec')->references('kode')->on('kecamatans')->nullOnDelete();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('username', 100)->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id', 36)->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
        Schema::dropIfExists('roles');
    }
};
