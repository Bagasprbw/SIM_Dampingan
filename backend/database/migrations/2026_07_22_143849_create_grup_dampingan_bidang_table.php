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
        Schema::create('grup_dampingan_bidang', function (Blueprint $table) {
            $table->id();
            $table->string('grup_dampingan_id', 36);
            $table->string('bidang_id', 36);
            $table->timestamp('created_at')->nullable();

            $table->foreign('grup_dampingan_id')
                ->references('id_grup_dampingan')
                ->on('grup_dampingans')
                ->cascadeOnDelete();

            $table->foreign('bidang_id')
                ->references('id_bidang')
                ->on('bidangs')
                ->cascadeOnDelete();

            $table->unique(['grup_dampingan_id', 'bidang_id'], 'grup_bidang_unique');
        });

        // Pindahkan data lama dari grup_dampingans.bidang_id ke grup_dampingan_bidang
        $grupLama = DB::table('grup_dampingans')->select('id_grup_dampingan', 'bidang_id')->get();
        foreach ($grupLama as $grup) {
            if ($grup->bidang_id) {
                DB::table('grup_dampingan_bidang')->insert([
                    'grup_dampingan_id' => $grup->id_grup_dampingan,
                    'bidang_id' => $grup->bidang_id,
                    'created_at' => now(),
                ]);
            }
        }

        // Hapus foreign key dan kolom bidang_id
        Schema::table('grup_dampingans', function (Blueprint $table) {
            $table->dropForeign(['bidang_id']);
            $table->dropColumn('bidang_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('grup_dampingans', function (Blueprint $table) {
            $table->string('bidang_id', 36)->nullable();
            $table->foreign('bidang_id')->references('id_bidang')->on('bidangs')->restrictOnDelete();
        });

        // Kembalikan data dari grup_dampingan_bidang ke grup_dampingans
        $pivots = DB::table('grup_dampingan_bidang')->get();
        foreach ($pivots as $pivot) {
            DB::table('grup_dampingans')
                ->where('id_grup_dampingan', $pivot->grup_dampingan_id)
                ->update(['bidang_id' => $pivot->bidang_id]);
        }

        Schema::dropIfExists('grup_dampingan_bidang');
    }
};
