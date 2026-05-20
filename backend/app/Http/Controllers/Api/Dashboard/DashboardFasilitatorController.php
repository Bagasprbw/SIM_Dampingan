<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\AnggotaGrupDampingan;
use App\Models\GrupFasilitator;
use App\Models\Kegiatan;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardFasilitatorController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (! $user || ! $user->role || $user->role->name !== 'fasilitator') {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Endpoint ini hanya untuk fasilitator.',
            ], 403);
        }

        $grupIds = GrupFasilitator::where('fasilitator_id', $user->id_user)
            ->pluck('grup_dampingan_id');

        $totalGrup = $grupIds->unique()->count();

        $totalDampinganAktif = AnggotaGrupDampingan::query()
            ->whereIn('grup_id', $grupIds)
            ->where('status', 'aktif')
            ->count();

        $statistikDampingan = AnggotaGrupDampingan::query()
            ->join('grup_dampingans', 'anggota_grup_dampingans.grup_id', '=', 'grup_dampingans.id_grup_dampingan')
            ->leftJoin('kabupatens', 'grup_dampingans.kode_kab', '=', 'kabupatens.kode')
            ->leftJoin('kecamatans', 'grup_dampingans.kode_kec', '=', 'kecamatans.kode')
            ->leftJoin('provinsis', 'grup_dampingans.kode_prov', '=', 'provinsis.kode')
            ->whereIn('grup_dampingans.id_grup_dampingan', $grupIds)
            ->where('anggota_grup_dampingans.status', 'aktif')
            ->selectRaw("COALESCE(kabupatens.name, kecamatans.name, provinsis.name, 'Tidak diketahui') as wilayah")
            ->selectRaw('COUNT(*) as total')
            ->groupBy('wilayah')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($item) => [
                'wilayah' => $item->wilayah,
                'total' => (int) $item->total,
            ]);

        $now = Carbon::now();
        $start = $now->copy()->startOfMonth()->subMonths(5);
        $end = $now->copy()->endOfMonth();

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
                'name' => $monthLabels[$monthNumber] ?? $cursor->format('M'),
                'kegiatan' => $total,
                'month' => $monthNumber,
                'year' => (int) $cursor->format('Y'),
            ];

            $cursor->addMonth();
        }

        $monthStart = $now->copy()->startOfMonth()->toDateString();
        $monthEnd = $now->copy()->endOfMonth()->toDateString();

        $totalKegiatanBulanIni = Kegiatan::query()
            ->whereHas('kegiatanGrups', function ($query) use ($grupIds) {
                $query->whereIn('grup_dampingan_id', $grupIds);
            })
            ->whereBetween(DB::raw('COALESCE(tanggal, created_at)'), [$monthStart, $monthEnd])
            ->distinct('id_kegiatan')
            ->count('id_kegiatan');

        $totalKegiatan = Kegiatan::query()
            ->whereHas('kegiatanGrups', function ($query) use ($grupIds) {
                $query->whereIn('grup_dampingan_id', $grupIds);
            })
            ->distinct('id_kegiatan')
            ->count('id_kegiatan');

        $kegiatanTerbaru = Kegiatan::with(['kegiatanGrups.grupDampingan:id_grup_dampingan,name'])
            ->whereHas('kegiatanGrups', function ($query) use ($grupIds) {
                $query->whereIn('grup_dampingan_id', $grupIds);
            })
            ->orderByDesc('created_at')
            ->limit(3)
            ->get()
            ->map(fn ($item) => [
                'id_kegiatan' => $item->id_kegiatan,
                'judul' => $item->judul,
                'tanggal' => $item->tanggal,
                'waktu' => $item->waktu,
                'lokasi' => $item->lokasi,
                'status' => $item->status,
                'grup_dampingan' => $item->kegiatanGrups
                    ->map(fn ($grup) => [
                        'id_grup_dampingan' => $grup->grupDampingan?->id_grup_dampingan,
                        'name' => $grup->grupDampingan?->name,
                    ])
                    ->values(),
            ]);

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
                    'total_dampingan_aktif' => $totalDampinganAktif,
                    'total_grup_dampingan' => $totalGrup,
                    'total_kegiatan' => $totalKegiatan,
                    'total_kegiatan_bulan_ini' => $totalKegiatanBulanIni,
                ],
                'statistik_dampingan' => $statistikDampingan,
                'kegiatan_per_bulan' => $kegiatanPerBulan,
                'kegiatan_terbaru' => $kegiatanTerbaru,
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
