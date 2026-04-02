<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permissions', function (Blueprint $table) {
            $table->string('id_permission', 36)->primary();
            $table->string('code', 100)->unique();
            $table->string('name', 100);
            $table->timestamps();
        });

        Schema::create('role_permissions', function (Blueprint $table) {
            $table->string('id_role_permission', 36)->primary();
            $table->string('role_id', 36);
            $table->string('permission_id', 36);
            $table->timestamps();

            $table->foreign('role_id')->references('id_role')->on('roles')->cascadeOnDelete();
            $table->foreign('permission_id')->references('id_permission')->on('permissions')->cascadeOnDelete();

            $table->unique(['role_id', 'permission_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('role_permissions');
        Schema::dropIfExists('permissions');
    }
};
