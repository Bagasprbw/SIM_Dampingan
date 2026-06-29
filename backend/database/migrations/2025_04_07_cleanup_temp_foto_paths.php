<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Clean up temporary file paths yang tersimpan di database
        // Jika foto field berisi path dengan 'Temp' atau 'tmp', set menjadi NULL
        DB::table('users')
            ->where('foto', 'like', '%Temp%')
            ->orWhere('foto', 'like', '%tmp%')
            ->orWhere('foto', 'like', '%AppData%')
            ->update(['foto' => null]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Tidak perlu reverse, hanya cleanup
    }
};
