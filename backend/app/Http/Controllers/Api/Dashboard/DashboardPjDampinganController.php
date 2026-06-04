<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\AnggotaGrupDampingan;
use App\Models\GrupDampingan;
use App\Models\Kegiatan;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardPjDampinganController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (! $user || ! $user->role || $user->role->name !== 'pj_grup') {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Endpoint ini hanya untuk PJ Dampingan.',
            ], 403);
        }

        $grupIds = GrupDampingan::where('pengurus_id', $user->id_user)
            ->pluck('id_grup_dampingan');

        $totalMasyarakat = AnggotaGrupDampingan::query()
            ->whereIn('grup_id', $grupIds)
            ->whereIn('status', ['aktif', 'non-aktif'])
            ->count();

        $statusCounts = AnggotaGrupDampingan::query()
            ->whereIn('grup_id', $grupIds)
            ->selectRaw("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending")
            ->selectRaw("SUM(CASE WHEN status = 'aktif' THEN 1 ELSE 0 END) as aktif")
            ->selectRaw("SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak")
            ->first();

        $pengajuanTerbaru = AnggotaGrupDampingan::query()
            ->whereIn('grup_id', $grupIds)
            ->whereIn('status', ['pending', 'aktif', 'ditolak'])
            ->orderByDesc('created_at')
            ->limit(3)
            ->get()
            ->map(fn ($item) => [
                'id_anggota_grup' => $item->id_anggota_grup,
                'name' => $item->name,
                'status' => $item->status,
                'created_at' => $item->created_at,
            ]);

        $now = Carbon::now();
        $start = $now->copy()->startOfMonth()->subMonths(5);
        $end = $now->copy()->endOfMonth();
        $monthStart = $now->copy()->startOfMonth()->toDateString();
        $monthEnd = $now->copy()->endOfMonth()->toDateString();

        $monthLabels = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember',
        ];

        $monthlyTotals = Kegiatan::query()
            ->selectRaw("DATE_FORMAT(COALESCE(tanggal, created_at), '%Y-%m-01') as month_key")
            ->selectRaw('COUNT(DISTINCT id_kegiatan) as total')
            ->whereHas('kegiatanGrups', function ($query) use ($grupIds) {
                $query->whereIn('grup_dampingan_id', $grupIds);
            })
            ->whereBetween(DB::raw('COALESCE(tanggal, created_at)'), [$start->toDateString(), $end->toDateString()])
            ->groupBy('month_key')
            ->orderBy('month_key')
            ->get()
            ->keyBy('month_key');

        $kegiatanPerBulan = [];
        $cursor = $start->copy();
        while ($cursor <= $end) {
            $key = $cursor->format('Y-m-01');
            $total = (int) ($monthlyTotals[$key]->total ?? 0);
            $monthNumber = (int) $cursor->format('n');
            $kegiatanPerBulan[] = [
                'name'     => $monthLabels[$monthNumber] ?? $cursor->format('M'),
                'kegiatan' => $total,
                'month'    => $monthNumber,
                'year'     => (int) $cursor->format('Y'),
            ];
            $cursor->addMonth();
        }

        $totalKegiatanBulanIni = Kegiatan::query()
            ->whereHas('kegiatanGrups', function ($query) use ($grupIds) {
                $query->whereIn('grup_dampingan_id', $grupIds);
            })
            ->whereBetween(DB::raw('COALESCE(tanggal, created_at)'), [$monthStart, $monthEnd])
            ->distinct('id_kegiatan')
            ->count('id_kegiatan');

        $logAktivitas = LogAktivitas::with([
                'user:id_user,name,role_id',
                'user.role:id_role,name',
            ])
            ->where('user_id', $user->id_user)
            ->where('aksi', 'LOGIN')
            ->orderByDesc('created_at')
            ->limit(3)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'totals' => [
                    'total_masyarakat' => $totalMasyarakat,
                    'total_kegiatan_bulan_ini' => $totalKegiatanBulanIni,
                ],
                'pengajuan' => [
                    'pending' => (int) ($statusCounts->pending ?? 0),
                    'aktif' => (int) ($statusCounts->aktif ?? 0),
                    'ditolak' => (int) ($statusCounts->ditolak ?? 0),
                ],
                'pengajuan_terbaru' => $pengajuanTerbaru,
                'kegiatan_per_bulan' => $kegiatanPerBulan,
                'log_aktivitas_login' => $logAktivitas,
                'period' => [
                    'current_month' => (int) $now->format('n'),
                    'current_year' => (int) $now->format('Y'),
                    'current_month_label' => $monthLabels[(int) $now->format('n')] ?? $now->format('M'),
                ],
            ],
        ]);
    }
}
