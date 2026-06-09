<?php

namespace App\Console\Commands;

use App\Models\LogAktivitas;
use Illuminate\Console\Command;

class PruneLogAktivitasCommand extends Command
{
    protected $signature = 'log-aktivitas:prune {--days=365 : Hapus log lebih lama dari N hari}';

    protected $description = 'Hapus permanen log aktivitas yang sudah melewati batas retensi';

    public function handle(): int
    {
        $days = (int) $this->option('days');
        $cutoff = now()->subDays($days);

        $deleted = LogAktivitas::where('created_at', '<', $cutoff)->delete();

        $this->info("Berhasil menghapus {$deleted} log aktivitas (lebih dari {$days} hari).");

        return self::SUCCESS;
    }
}
