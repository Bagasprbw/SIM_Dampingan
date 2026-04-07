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
            ->whereRaw("LOCATE('Temp', foto) > 0 OR LOCATE('tmp', foto) > 0 OR LOCATE('AppData', foto) > 0")
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
